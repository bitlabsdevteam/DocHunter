export interface ResearchQuery {
  id: string;
  owner: 'discovery-agent';
  engine: 'perplexity';
  query: string;
  priority: 'p0' | 'p1';
}

// Perplexity-first discovery backlog for DocHunter MVP/POC.
export const discoveryQueries: ResearchQuery[] = [
  {
    id: 'jp-hospital-apis',
    owner: 'discovery-agent',
    engine: 'perplexity',
    priority: 'p0',
    query: 'Japan hospital APIs or public datasets for clinic/hospital search and availability signals with licensing details',
  },
  {
    id: 'jp-clinic-directories',
    owner: 'discovery-agent',
    engine: 'perplexity',
    priority: 'p0',
    query: 'Japanese clinic directories with terms of service that allow API or partner integrations',
  },
  {
    id: 'jp-testing-data',
    owner: 'discovery-agent',
    engine: 'perplexity',
    priority: 'p0',
    query: 'development testing datasets for Japanese healthcare locations geocoding specialties and contact channels',
  },
  {
    id: 'agent-framework-benchmark',
    owner: 'discovery-agent',
    engine: 'perplexity',
    priority: 'p1',
    query: 'LangGraph vs LangChain vs alternatives for healthcare-safe single-agent tool orchestration on Vercel',
  },
  {
    id: 'agentic-architecture-patterns',
    owner: 'discovery-agent',
    engine: 'perplexity',
    priority: 'p1',
    query: 'Agentic architecture patterns for tool boundaries and long-running workflows relevant to healthcare-safe orchestration',
  },
];
