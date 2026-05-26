const NIM_BASE_URL = 'https://integrate.api.nvidia.com/v1';
const DEFAULT_MODEL = 'meta/llama-3.1-70b-instruct';

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

const ALLOWED_ROLES = new Set<ChatMessage['role']>(['system', 'user', 'assistant']);

function parseOriginsList(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function extractOrigin(value: string | undefined): string | null {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const apiKey = process.env.NIM_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error:
        'Missing environment variable: NIM_API_KEY. Add it in Vercel Project Settings → Environment Variables.',
    });
  }

  const configuredOrigins = parseOriginsList(
    process.env.NIM_ALLOWED_ORIGINS ?? process.env.APP_URL,
  );
  const requestOrigin = extractOrigin(req.headers.origin as string | undefined);
  const requestRefererOrigin = extractOrigin(req.headers.referer as string | undefined);
  const allowedRequest =
    configuredOrigins.length === 0 ||
    (requestOrigin !== null && configuredOrigins.includes(requestOrigin)) ||
    (requestRefererOrigin !== null && configuredOrigins.includes(requestRefererOrigin));

  if (!allowedRequest) {
    return res.status(403).json({ error: 'Forbidden origin.' });
  }

  const { messages, model = DEFAULT_MODEL, temperature = 0.7, max_tokens = 500 } = req.body ?? {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Body must include a non-empty messages array.' });
  }

  try {
    const sanitizedMessages: ChatMessage[] = [];

    for (const message of messages) {
      if (!message || typeof message !== 'object') {
        return res.status(400).json({ error: 'Each message must be an object.' });
      }

      const { role, content } = message as { role?: unknown; content?: unknown };

      if (typeof role !== 'string' || !ALLOWED_ROLES.has(role as ChatMessage['role'])) {
        return res.status(400).json({
          error: "Each message.role must be one of: 'system', 'user', 'assistant'.",
        });
      }

      sanitizedMessages.push({
        role: role as ChatMessage['role'],
        content: String(content ?? ''),
      });
    }

    const nimResponse = await fetch(`${NIM_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: sanitizedMessages,
        temperature,
        max_tokens,
      }),
    });

    const rawBody = await nimResponse.text();
    let data: unknown = null;

    if (rawBody) {
      try {
        data = JSON.parse(rawBody);
      } catch {
        data = { raw: rawBody };
      }
    }

    if (!nimResponse.ok) {
      return res.status(nimResponse.status).json({
        error: 'NVIDIA NIM request failed.',
        details: data ?? { raw: null },
      });
    }

    return res.status(200).json(data ?? {});
  } catch (error) {
    return res.status(500).json({
      error: 'Unexpected error while calling NVIDIA NIM.',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
