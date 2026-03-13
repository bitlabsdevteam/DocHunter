# DocHunter

DocHunter is an AI Agentic Healthcare Locator for Japan (MVP/POC), designed for Vercel-first deployment with MCP-based tool boundaries.

OpenClaw architecture reference used in design thinking: https://github.com/openclaw/openclaw

## MVP Architecture Skeleton

- `apps/web` — React/Vite chat UI shell (EN/JA-ready)
- `apps/api` — Fastify orchestration API
  - `src/workflows` — care-location workflow graph seam
  - `src/agent/framework` — framework evaluation + recommendation
  - `src/tools` — live Perplexity clinic discovery adapter + fallback
  - `src/mcp` — MCP registry/tool contracts (directory + booking)
  - `src/integrations/japan-directory` — JP healthcare source registry

## Framework Decision (for DocHunter)

Evaluated: **LangGraph**, **LangChain**, **Mastra**, and a custom OpenClaw-style orchestrator.

Current recommendation for this POC: **LangGraph**
- best control for safety-gated healthcare flow
- strong fit for explicit state transitions (triage → discovery → ranking → booking intent)
- practical path to MCP tool wrapping and observability

## Model Strategy

- Multi-provider support: OpenAI + Gemini
- Default provider: OpenAI
- Default OpenAI model: `gpt-5.4`
- Perplexity is the default discovery/research engine

## Env & Secrets Strategy

- Commit only `.env.example`
- Never commit real secrets
- Create local env with:
  - `./scripts/setup-env.sh`
- Load Vercel key from local OpenClaw env when deploying:
  - `./scripts/load-vercel-env.sh`

## Local Dev

```bash
npm install
npm run dev:api
npm run dev:web
```

## Docker

```bash
./scripts/docker-up.sh
```

## Vercel Deploy Path (token from local OpenClaw env)

```bash
./scripts/vercel-deploy.sh
```

## Current Safety Guardrail

DocHunter does **not** provide medical diagnosis. It provides healthcare navigation and booking assistance guidance.
