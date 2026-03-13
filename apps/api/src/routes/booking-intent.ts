import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { createMcpRegistry } from '../mcp/registry.js';
import { env } from '../config/env.js';

const RequestSchema = z.object({
  clinicIdOrName: z.string().min(2),
  preferredDateTimeISO: z.string().datetime(),
  patientEmail: z.string().email(),
  patientName: z.string().optional(),
  locale: z.enum(['en', 'ja']).default('en'),
});

export async function registerBookingIntentRoute(app: FastifyInstance) {
  app.post('/api/v1/booking-intent', async (req, reply) => {
    const parsed = RequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ ok: false, error: parsed.error.flatten() });
    }

    const mcp = createMcpRegistry({
      directoryServerUrl: env.MCP_DIRECTORY_SERVER_URL,
      bookingServerUrl: env.MCP_BOOKING_SERVER_URL,
    });

    const result = await mcp.tools.booking.createIntent(parsed.data);
    return reply.send({ ok: true, data: result });
  });
}
