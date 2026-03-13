import type { VercelRequest, VercelResponse } from '@vercel/node';

const discoveryQueries = [
  {
    id: 'jp-hospital-apis',
    priority: 'p0',
    query: 'Japan hospital APIs or public datasets for clinic/hospital search and availability signals with licensing details',
  },
  {
    id: 'jp-clinic-directories',
    priority: 'p0',
    query: 'Japanese clinic directories with terms of service that allow API or partner integrations',
  },
  {
    id: 'jp-testing-data',
    priority: 'p0',
    query: 'development testing datasets for Japanese healthcare locations geocoding specialties and contact channels',
  },
  {
    id: 'agent-framework-benchmark',
    priority: 'p1',
    query: 'LangGraph vs LangChain vs alternatives for healthcare-safe single-agent tool orchestration on Vercel',
  },
  {
    id: 'agentic-architecture-patterns',
    priority: 'p1',
    query: 'Agentic architecture patterns for tool boundaries and long-running workflows relevant to healthcare-safe orchestration',
  },
] as const;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  if (!process.env.PERPLEXITY_API_KEY) {
    res.status(400).json({ ok: false, error: 'PERPLEXITY_API_KEY missing' });
    return;
  }

  try {
    const findings = [] as Array<{ id: string; priority: string; query: string; summary: string; citations: string[] }>;

    for (const item of discoveryQueries) {
      const prompt = [
        'You are supporting an AI healthcare locator MVP for Japan.',
        'Return concise implementation-focused findings with risks, licensing constraints, and integration readiness.',
        `Question: ${item.query}`,
      ].join('\n');

      const response = await fetch(`${process.env.PERPLEXITY_BASE_URL ?? 'https://api.perplexity.ai'}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: process.env.PERPLEXITY_MODEL ?? 'sonar-pro',
          temperature: 0.1,
          messages: [
            {
              role: 'system',
              content:
                'You are a research analyst for a healthcare-safe AI product. Be accurate and explicit about uncertainty.',
            },
            { role: 'user', content: prompt },
          ],
        }),
      });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(`${item.id}: ${response.status} ${body.slice(0, 300)}`);
      }

      const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
        citations?: string[];
      };

      findings.push({
        id: item.id,
        priority: item.priority,
        query: item.query,
        summary: data.choices?.[0]?.message?.content?.trim() ?? 'No summary returned.',
        citations: data.citations ?? [],
      });
    }

    res.status(200).json({ ok: true, engine: 'perplexity', findings });
  } catch (error) {
    res.status(502).json({ ok: false, error: error instanceof Error ? error.message : 'Research failed' });
  }
}
