import { env } from '../config/env.js';
import type { ClinicCandidate } from '../types/domain.js';
import { perplexityChat } from '../services/perplexity-client.js';

interface PerplexitySearchResult {
  clinics: Array<{
    name?: string;
    address?: string;
    distanceKm?: number;
    specialty?: string;
    availabilityHint?: string;
    bookingMode?: string;
    sourceUrl?: string;
  }>;
}

interface PerplexityChatResponse {
  choices?: Array<{ message?: { content?: string } }>;
  citations?: string[];
}

function buildDiscoveryPrompt(input: {
  symptoms: string;
  specialty: string;
  latitude?: number;
  longitude?: number;
  city?: string;
}): string {
  const locationContext = [
    input.city ? `city: ${input.city}` : undefined,
    input.latitude !== undefined ? `latitude: ${input.latitude}` : undefined,
    input.longitude !== undefined ? `longitude: ${input.longitude}` : undefined,
  ]
    .filter(Boolean)
    .join(', ');

  return [
    'Find real clinics/hospitals in Japan relevant to the request.',
    'Prioritize practical options for appointment intent (phone/web booking signals).',
    'Prefer official sources when possible (clinic/hospital websites, municipality pages, directories).',
    'Return strict JSON with this schema and no markdown:',
    '{"clinics":[{"name":"string","address":"string","distanceKm":number,"specialty":"string","availabilityHint":"string","bookingMode":"external_link|phone|mcp_booking","sourceUrl":"string"}]}',
    'Provide at most 5 clinics, ranked by likely availability, specialty match, then distance.',
    `Symptoms: ${input.symptoms}`,
    `Target specialty: ${input.specialty}`,
    locationContext ? `User location context: ${locationContext}` : 'User location context: unavailable, infer from city-level Japan context.',
  ].join('\n');
}

function safeParseJsonObject(text: string): unknown {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');
    if (start >= 0 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1));
    }
    throw new Error('No JSON object found in Perplexity response content.');
  }
}

function normalizeClinics(payload: unknown, fallbackSpecialty: string, citations: string[]): ClinicCandidate[] {
  if (!payload || typeof payload !== 'object') return [];
  const rawClinics = (payload as PerplexitySearchResult).clinics;
  if (!Array.isArray(rawClinics)) return [];

  return rawClinics
    .map((item, index) => {
      const bookingMode =
        item?.bookingMode === 'external_link' || item?.bookingMode === 'phone' || item?.bookingMode === 'mcp_booking'
          ? item.bookingMode
          : 'phone';

      const sourceUrl = String(item?.sourceUrl ?? citations[index] ?? citations[0] ?? '').trim();

      return {
        name: String(item?.name ?? '').trim(),
        address: String(item?.address ?? '').trim(),
        distanceKm: Number(item?.distanceKm ?? Number.NaN),
        specialty: String(item?.specialty ?? fallbackSpecialty).trim() || fallbackSpecialty,
        availabilityHint: String(item?.availabilityHint ?? 'Availability unknown').trim(),
        bookingMode,
        sourceUrl: sourceUrl || undefined,
      } as ClinicCandidate;
    })
    .filter((c) => c.name.length > 0 && c.address.length > 0 && Number.isFinite(c.distanceKm))
    .slice(0, 5);
}

export async function searchJapanClinics(input: {
  symptoms: string;
  specialty: string;
  latitude?: number;
  longitude?: number;
  city?: string;
}): Promise<ClinicCandidate[]> {
  if (!env.PERPLEXITY_API_KEY) {
    return [
      {
        name: 'Tokyo Central Clinic (fallback: missing PERPLEXITY_API_KEY)',
        address: input.city ? `${input.city}, Japan` : 'Tokyo, Japan',
        distanceKm: 2.5,
        specialty: input.specialty,
        availabilityHint: 'Configure PERPLEXITY_API_KEY for live discovery.',
        bookingMode: 'phone',
      },
    ];
  }

  const data = (await perplexityChat({
    system:
      'You are a healthcare discovery assistant for Japan. Never diagnose; only return practical location options with cautious language.',
    user: buildDiscoveryPrompt(input),
    temperature: 0.1,
  })) as PerplexityChatResponse;

  const content = data.choices?.[0]?.message?.content;
  if (!content) return [];

  const parsed = safeParseJsonObject(content);
  return normalizeClinics(parsed, input.specialty, data.citations ?? []);
}
