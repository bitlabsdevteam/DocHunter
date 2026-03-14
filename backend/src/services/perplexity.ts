import type { ClinicCandidate, TriageRequest } from '../types/triage.js';

export async function searchClinics(
  input: TriageRequest & { specialty: string }
): Promise<ClinicCandidate[]> {
  void input;

  // TODO: Wire Perplexity API + Japanese healthcare directories.
  return [
    {
      name: 'Tokyo Central Clinic (stub)',
      address: 'Chiyoda, Tokyo',
      distanceKm: 2.1,
      specialty: input.specialty,
      availabilityHint: 'Likely same-day slots'
    }
  ];
}
