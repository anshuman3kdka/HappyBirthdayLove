export type AiMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export async function askNim(messages: AiMessage[], options?: {
  model?: string;
  temperature?: number;
  max_tokens?: number;
}) {
  const response = await fetch('/api/nim-chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages,
      ...options,
    }),
  });

  const rawBody = await response.text();
  let data: unknown = null;

  if (rawBody) {
    try {
      data = JSON.parse(rawBody);
    } catch {
      data = { raw: rawBody };
    }
  }

  if (!response.ok) {
    const parsedError =
      data && typeof data === 'object' && 'error' in data ? (data as { error?: string }).error : null;
    throw new Error(`NIM request failed (${response.status}): ${parsedError || rawBody || 'Unknown error'}`);
  }

  return data;
}
