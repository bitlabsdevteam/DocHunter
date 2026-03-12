import type { McpBookingTool, McpDirectoryTool } from './contracts.js';

export const stubMcpDirectoryTool: McpDirectoryTool = {
  async lookup() {
    return [];
  },
};

export const stubMcpBookingTool: McpBookingTool = {
  async createIntent() {
    return {
      status: 'manual_required',
      instructions: 'Booking connector not wired yet. Use clinic phone flow in MVP.',
    };
  },
};
