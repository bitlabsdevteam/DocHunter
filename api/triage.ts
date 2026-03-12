import type { VercelRequest, VercelResponse } from '@vercel/node';
import { runHealthcareLocatorAgent } from '../backend/src/agent/orchestrator';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const result = await runHealthcareLocatorAgent(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
