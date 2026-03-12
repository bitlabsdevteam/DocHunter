# DocHunter

DocHunter is an AI Agentic Healthcare Locator for Japan.

## Current POC Scope
- Vercel-first deployment
- React + Vite frontend
- Fastify backend
- English / Japanese support
- Perplexity-backed clinic discovery research
- OpenAI + Gemini model support (OpenAI GPT-5.4 default)
- MCP-oriented agentic system design
- Docker / docker-compose support

## Structure
- `apps/web` — frontend
- `apps/api` — backend
- `.env.example` — environment template
- `docker-compose.yml` — local container setup
- `vercel.json` — Vercel deployment config

## Safety
DocHunter must not provide medical diagnosis.
It is a healthcare navigation and booking-assistance tool.
