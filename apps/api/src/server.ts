import Fastify from 'fastify';
import { assertRuntimeReadiness, env } from './config/env.js';
import { registerLocateCareRoute } from './routes/locate-care.js';
import { registerBookingIntentRoute } from './routes/booking-intent.js';
import { registerDiscoveryResearchRoute } from './routes/discovery-research.js';
import { frameworkEvaluation, recommendedFramework } from './agent/framework/evaluation.js';
import { japanDirectorySources } from './integrations/japan-directory/source-registry.js';
import { discoveryQueries } from './integrations/japan-directory/research-queries.js';

const app = Fastify({ logger: true });

app.get('/health', async () => ({ ok: true, service: 'dochunter-api', env: env.NODE_ENV }));

app.get('/api/status', async () => ({
  product: 'DocHunter',
  region: 'Japan',
  locale: ['en', 'ja'],
  modelSupport: {
    providers: ['openai', 'gemini'],
    defaultProvider: env.DEFAULT_MODEL_PROVIDER,
    openaiDefaultModel: env.OPENAI_MODEL,
  },
  architecture: {
    deployment: 'vercel-first',
    mcpReady: true,
    researchEngine: env.RESEARCH_ENGINE,
    frameworkRecommendation: recommendedFramework,
  },
  frameworkEvaluation,
  directoryDiscoverySources: japanDirectorySources,
  perplexityDiscoveryBacklog: discoveryQueries,
  startupIssues: assertRuntimeReadiness(),
}));

await registerLocateCareRoute(app);
await registerBookingIntentRoute(app);
await registerDiscoveryResearchRoute(app);

app.listen({ port: env.PORT, host: '0.0.0.0' }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
