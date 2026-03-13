import type { FastifyInstance } from 'fastify';
import { runDiscoveryResearch } from '../services/perplexity-research.js';

export async function registerDiscoveryResearchRoute(app: FastifyInstance) {
  app.post('/api/research/discovery', async (_request, reply) => {
    try {
      const findings = await runDiscoveryResearch();
      return {
        ok: true,
        engine: 'perplexity',
        findings,
      };
    } catch (error) {
      app.log.error(error);
      reply.code(502);
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Discovery research failed',
      };
    }
  });
}
