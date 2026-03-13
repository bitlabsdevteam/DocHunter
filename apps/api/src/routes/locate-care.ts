import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { locateHealthcare } from '../agent/orchestrator.js';

const RequestSchema = z.object({
  locale: z.enum(['en', 'ja']).default('en'),
  symptoms: z.string().min(3),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  city: z.string().optional(),
  preferredProvider: z.enum(['openai', 'gemini']).optional(),
});

export async function registerLocateCareRoute(app: FastifyInstance) {
  app.post('/api/v1/locate-care', async (req, reply) => {
    const parsed = RequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ ok: false, error: parsed.error.flatten() });
    }

    const { preferredProvider, ...input } = parsed.data;
    const response = await locateHealthcare(input, preferredProvider);

    return reply.send({ ok: true, data: response });
  });
}
