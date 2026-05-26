const NIM_BASE_URL = 'https://integrate.api.nvidia.com/v1';
const DEFAULT_MODEL = 'meta/llama-3.1-70b-instruct';

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const apiKey = process.env.mykey;

  if (!apiKey) {
    return res.status(500).json({
      error:
        'Missing environment variable: mykey. Add it in Vercel Project Settings → Environment Variables.',
    });
  }

  const { messages, model = DEFAULT_MODEL, temperature = 0.7, max_tokens = 500 } = req.body ?? {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Body must include a non-empty messages array.' });
  }

  const sanitizedMessages = (messages as ChatMessage[]).map((message) => ({
    role: message.role,
    content: String(message.content ?? ''),
  }));

  try {
    const nimResponse = await fetch(`${NIM_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: sanitizedMessages,
        temperature,
        max_tokens,
      }),
    });

    const data = await nimResponse.json();

    if (!nimResponse.ok) {
      return res.status(nimResponse.status).json({
        error: 'NVIDIA NIM request failed.',
        details: data,
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: 'Unexpected error while calling NVIDIA NIM.',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
