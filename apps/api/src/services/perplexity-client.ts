import { env } from '../config/env.js';

interface PerplexityChatResponse {
  choices?: Array<{ message?: { content?: string } }>;
  citations?: string[];
}

export interface PerplexityChatInput {
  system: string;
  user: string;
  temperature?: number;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function perplexityChat(input: PerplexityChatInput): Promise<PerplexityChatResponse> {
  if (!env.PERPLEXITY_API_KEY) {
    throw new Error('PERPLEXITY_API_KEY is required.');
  }

  const maxAttempts = env.PERPLEXITY_MAX_RETRIES + 1;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const response = await fetch(`${env.PERPLEXITY_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: env.PERPLEXITY_MODEL,
        temperature: input.temperature ?? 0.1,
        messages: [
          { role: 'system', content: input.system },
          { role: 'user', content: input.user },
        ],
      }),
      signal: AbortSignal.timeout(env.PERPLEXITY_TIMEOUT_MS),
    });

    if (response.ok) {
      return (await response.json()) as PerplexityChatResponse;
    }

    const body = await response.text();
    const retryAfterHeader = response.headers.get('retry-after');
    const retryAfterMs = retryAfterHeader ? Number(retryAfterHeader) * 1000 : undefined;
    const retryable = response.status === 429 || response.status >= 500;

    if (!retryable || attempt >= maxAttempts) {
      throw new Error(`Perplexity request failed (${response.status}): ${body.slice(0, 400)}`);
    }

    const backoffMs = retryAfterMs ?? Math.min(1500 * attempt, 5000);
    await sleep(backoffMs);
  }

  throw new Error('Perplexity request failed unexpectedly.');
}
