import { env } from '../config/env.js';
import type { ClinicCandidate } from '../types/domain.js';

export async function searchJapanClinics(input: {
  symptoms: string;
  specialty: string;
  latitude?: number;
  longitude?: number;
  city?: string;
}): Promise<ClinicCandidate[]> {
  // POC stub: this contract is intentionally stable for future Perplexity + JP directories wiring.
  // We keep Perplexity as the default discovery engine.
  void env.PERPLEXITY_API_KEY;
  void input;

  return [
    {
      name: 'Tokyo Central Clinic (POC stub)',
      address: 'Chiyoda, Tokyo',
      distanceKm: 2.1,
      specialty: input.specialty,
      availabilityHint: 'Likely same-day intake window',
      bookingMode: 'phone',
    },
  ];
}
