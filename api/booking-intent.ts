import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' })

  const providerId = String(req.body?.providerId ?? '').trim()
  const providerName = String(req.body?.providerName ?? '').trim()
  const userEmail = String(req.body?.userEmail ?? '').trim()
  const requestedTime = String(req.body?.requestedTime ?? 'Next available').trim()

  if (!providerId || !providerName || !userEmail) {
    return res.status(400).json({ ok: false, error: 'providerId, providerName, and userEmail are required' })
  }

  const bookingReference = `DH-${Date.now().toString(36).toUpperCase()}`
  return res.status(200).json({
    ok: true,
    booking: {
      status: 'requested',
      bookingReference,
      providerId,
      providerName,
      requestedTime,
      handoff: 'MCP booking adapter queued for provider follow-up',
    },
  })
}
