import { inferUrgencyAndSpecialty, disclaimer } from '../services/triage.js';
import { searchJapanClinics } from '../tools/perplexity-directory-tool.js';
import { resolveModelProvider } from '../agent/model-router.js';
import { buildSingleAgentPlan } from '../agent/single-agent-plan.js';
import { buildSingleAgentSystemPrompt } from '../agent/prompt-template.js';
import type { LocateCareRequest, LocateCareResponse, ModelProvider } from '../types/domain.js';

export async function runLocateCareWorkflow(
  input: LocateCareRequest,
  preferredProvider?: ModelProvider,
): Promise<LocateCareResponse> {
  const modelProvider = resolveModelProvider(preferredProvider);
  const { urgency, specialty } = inferUrgencyAndSpecialty(input.symptoms);
  const plan = buildSingleAgentPlan(input, urgency);

  // Prompt scaffold for upcoming model-call integration (OpenAI/Gemini).
  void buildSingleAgentSystemPrompt(input.locale);

  const recommendations = plan.emergencyBypass
    ? []
    : await searchJapanClinics({
        symptoms: input.symptoms,
        specialty,
        latitude: input.latitude,
        longitude: input.longitude,
        city: input.city,
      });

  return {
    urgency,
    specialty,
    modelProvider,
    recommendations,
    disclaimer: disclaimer(input.locale),
    orchestration: {
      architecture: 'single-agent-first',
      phases: plan.phases,
      promptProfile: 'healthcare-locator-japan',
    },
  };
}
