import { stubMcpBookingTool, stubMcpDirectoryTool } from './tools/stub-tools.js';
import type { McpBookingTool, McpDirectoryTool } from './tools/contracts.js';

export interface McpServerRegistry {
  directoryServerUrl?: string;
  bookingServerUrl?: string;
}

export interface McpToolCall<TInput, TOutput> {
  name: string;
  input: TInput;
  output?: TOutput;
}

export interface McpRegistry {
  config: McpServerRegistry;
  tools: {
    directory: McpDirectoryTool;
    booking: McpBookingTool;
  };
}

// MCP-ready seam: wire actual MCP transport/client here in next iteration.
export function createMcpRegistry(registry: McpServerRegistry): McpRegistry {
  return {
    config: registry,
    tools: {
      directory: stubMcpDirectoryTool,
      booking: stubMcpBookingTool,
    },
  };
}
