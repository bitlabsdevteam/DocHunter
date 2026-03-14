export type AgentFramework = 'langgraph' | 'langchain' | 'mastra' | 'custom-orchestrator';

export interface FrameworkScore {
  framework: AgentFramework;
  orchestrationControl: number;
  mcpReadiness: number;
  vercelFit: number;
  observability: number;
  total: number;
  rationale: string;
}

// MVP/POC scoring for DocHunter constraints: MCP, Vercel-first, healthcare safety rails.
export const frameworkEvaluation: FrameworkScore[] = [
  {
    framework: 'langgraph',
    orchestrationControl: 5,
    mcpReadiness: 4,
    vercelFit: 4,
    observability: 4,
    total: 17,
    rationale: 'Best fit for stateful, tool-heavy flow control while keeping a clear graph for triage/search/booking safety gates.',
  },
  {
    framework: 'langchain',
    orchestrationControl: 3,
    mcpReadiness: 3,
    vercelFit: 4,
    observability: 3,
    total: 13,
    rationale: 'Fast to start but less deterministic for complex branching without additional structure.',
  },
  {
    framework: 'mastra',
    orchestrationControl: 4,
    mcpReadiness: 3,
    vercelFit: 4,
    observability: 3,
    total: 14,
    rationale: 'Good DX and modern agent abstractions; MCP/healthcare-specific guardrail patterns still less battle-tested.',
  },
  {
    framework: 'custom-orchestrator',
    orchestrationControl: 5,
    mcpReadiness: 4,
    vercelFit: 5,
    observability: 2,
    total: 16,
    rationale: 'Maximum control with explicit safety gates, but higher implementation burden for POC timeline.',
  },
];

export const recommendedFramework: AgentFramework = 'langgraph';
