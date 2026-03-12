import { env } from '../config/env.js';
import { createMcpRegistry } from '../mcp/registry.js';
import { runLocateCareWorkflow } from '../workflows/locate-care-workflow.js';
import type { LocateCareRequest, LocateCareResponse, ModelProvider } from '../types/domain.js';

const mcp = createMcpRegistry({
  directoryServerUrl: env.MCP_DIRECTORY_SERVER_URL,
  bookingServerUrl: env.MCP_BOOKING_SERVER_URL,
});

void mcp;

export async function locateHealthcare(
  input: LocateCareRequest,
  preferredProvider?: ModelProvider,
): Promise<LocateCareResponse> {
  const result = await runLocateCareWorkflow(input, preferredProvider);

  return {
    urgency: result.urgency,
    specialty: result.specialty,
    modelProvider: result.modelProvider,
    recommendations: result.recommendations,
    disclaimer: result.disclaimer,
  };
}
