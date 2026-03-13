import type { VercelRequest, VercelResponse } from '@vercel/node';

type Clinic = {
  name: string;
  address: string;
  distanceKm: number;
  specialty: string;
  availabilityHint: string;
  bookingMode: 'external_link' | 'phone' | 'mcp_booking';
  sourceUrl?: string;
};

function parsePayload(body: unknown): { symptoms: string; specialty: string; city?: string } | null {
  if (!body || typeof body !== 'object') return null;
  const data = body as Record<string, unknown>;
  const symptoms = String(data.symptoms ?? '').trim();
  const specialty = String(data.specialty ?? 'general medicine').trim();
  const city = data.city ? String(data.city).trim() : undefined;
  if (!symptoms) return null;
  return { symptoms, specialty, city };
}

function safeParseJsonObject(text: string): unknown {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');
    if (start >= 0 && end > start) return JSON.parse(trimmed.slice(start, end + 1));
    throw new Error('Invalid JSON response from Perplexity.');
  }
}

function normalizeClinics(payload: unknown, specialty: string, citations: string[]): Clinic[] {
  if (!payload || typeof payload !== 'object') return [];
  const raw = (payload as { clinics?: unknown[] }).clinics;
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item, index) => {
      const c = item as Record<string, unknown>;
      const bookingMode =
        c.bookingMode === 'external_link' || c.bookingMode === 'phone' || c.bookingMode === 'mcp_booking'
          ? c.bookingMode
          : 'phone';

      return {
        name: String(c.name ?? '').trim(),
        address: String(c.address ?? '').trim(),
        distanceKm: Number(c.distanceKm ?? Number.NaN),
        specialty: String(c.specialty ?? specialty).trim(),
        availabilityHint: String(c.availabilityHint ?? 'Availability unknown').trim(),
        bookingMode,
        sourceUrl: String(c.sourceUrl ?? citations[index] ?? citations[0] ?? '').trim() || undefined,
      } as Clinic;
    })
    .filter((c) => c.name && c.address && Number.isFinite(c.distanceKm))
    .slice(0, 5);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const payload = parsePayload(req.body);
  if (!payload) {
    res.status(400).json({ ok: false, error: 'symptoms is required' });
    return;
  }

  if (!process.env.PERPLEXITY_API_KEY) {
    const fallback: Clinic[] = [
      {
        name: 'Tokyo Central Clinic (fallback)',
        address: payload.city ? `${payload.city}, Japan` : 'Tokyo, Japan',
        distanceKm: 2.5,
        specialty: payload.specialty,
        availabilityHint: 'Set PERPLEXITY_API_KEY for live discovery.',
        bookingMode: 'phone',
      },
    ];
    res.status(200).json({ ok: true, data: fallback, fallback: true });
    return;
  }

  const prompt = [
    'Find real clinics/hospitals in Japan relevant to this user request.',
    'Return strict JSON only, no markdown:',
    '{"clinics":[{"name":"string","address":"string","distanceKm":number,"specialty":"string","availabilityHint":"string","bookingMode":"external_link|phone|mcp_booking","sourceUrl":"string"}]}',
    'Rank by likely availability, specialty match, then distance. Max 5.',
    `Symptoms: ${payload.symptoms}`,
    `Target specialty: ${payload.specialty}`,
    payload.city ? `City: ${payload.city}` : 'City: unknown',
  ].join('\n');

  const response = await fetch(`${process.env.PERPLEXITY_BASE_URL ?? 'https://api.perplexity.ai'}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.PERPLEXITY_MODEL ?? 'sonar-pro',
      temperature: 0.1,
      messages: [
        { role: 'system', content: 'You are a healthcare discovery assistant for Japan. Do not diagnose.' },
        { role: 'user', content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    res.status(502).json({ ok: false, error: `Perplexity error ${response.status}`, detail: text.slice(0, 400) });
    return;
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    citations?: string[];
  };

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    res.status(200).json({ ok: true, data: [] });
    return;
  }

  const parsed = safeParseJsonObject(content);
  const clinics = normalizeClinics(parsed, payload.specialty, data.citations ?? []);
  res.status(200).json({ ok: true, data: clinics });
}
