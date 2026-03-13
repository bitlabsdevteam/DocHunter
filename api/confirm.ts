import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' })

  const userEmail = String(req.body?.userEmail ?? '').trim()
  const providerName = String(req.body?.providerName ?? '').trim()
  const providerAddress = String(req.body?.providerAddress ?? '').trim()
  const bookingReference = String(req.body?.bookingReference ?? '').trim()

  if (!userEmail || !providerName || !bookingReference) {
    return res.status(400).json({ ok: false, error: 'Missing required confirmation fields' })
  }

  return res.status(200).json({
    ok: true,
    confirmation: {
      status: 'sent',
      to: userEmail,
      subject: `DocHunter booking intent confirmed (${bookingReference})`,
      bodyPreview: `Provider: ${providerName} | Address: ${providerAddress || 'N/A'} | Ref: ${bookingReference}`,
    },
  })
}
