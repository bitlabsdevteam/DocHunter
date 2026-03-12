import type { TriageRequest, TriageResponse } from '../types/triage';
import { inferUrgencyAndSpecialty } from '../services/triage';
import { searchClinics } from '../services/perplexity';

export async function runHealthcareLocatorAgent(input: TriageRequest): Promise<TriageResponse> {
  const { urgency, specialty } = inferUrgencyAndSpecialty(input.symptoms);
  const recommendations = await searchClinics({ ...input, specialty });

  return {
    urgency,
    specialty,
    recommendations,
    disclaimer:
      input.locale === 'ja'
        ? '本サービスは医療診断を行いません。緊急時は119へ連絡してください。'
        : 'This service does not provide medical diagnosis. In emergencies call 119 in Japan.'
  };
}
