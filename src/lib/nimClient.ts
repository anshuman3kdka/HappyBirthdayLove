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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || 'NIM request failed.');
  }

  return data;
}
