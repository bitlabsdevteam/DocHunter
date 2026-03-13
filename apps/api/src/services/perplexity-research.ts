import { env } from '../config/env.js';
import { discoveryQueries } from '../integrations/japan-directory/research-queries.js';
import { perplexityChat } from './perplexity-client.js';

interface PerplexityResponse {
  choices?: Array<{ message?: { content?: string } }>;
  citations?: string[];
}

export interface DiscoveryFinding {
  id: string;
  priority: 'p0' | 'p1';
  query: string;
  summary: string;
  citations: string[];
}

export async function runDiscoveryResearch(): Promise<DiscoveryFinding[]> {
  if (!env.PERPLEXITY_API_KEY) {
    throw new Error('PERPLEXITY_API_KEY is required for live discovery research.');
  }

  const findings: DiscoveryFinding[] = [];

  for (const item of discoveryQueries) {
    const prompt = [
      'You are supporting an AI healthcare locator MVP for Japan.',
      'Return concise, implementation-focused findings (not generic marketing text).',
      'Prioritize: licensing, API access, data freshness, coverage, booking practicality, and risks.',
      'Keep it short (<= 8 bullet points worth of content in plain text).',
      `Question: ${item.query}`,
    ].join('\n');

    const data = (await perplexityChat({
      system:
        'You are a research analyst for a healthcare-safe AI product. Be accurate, practical, and explicit about uncertainty.',
      user: prompt,
      temperature: 0.1,
    })) as PerplexityResponse;
    findings.push({
      id: item.id,
      priority: item.priority,
      query: item.query,
      summary: data.choices?.[0]?.message?.content?.trim() ?? 'No summary returned.',
      citations: data.citations ?? [],
    });
  }

  return findings;
}
