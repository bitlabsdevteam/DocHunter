import type { LocateCareRequest, Urgency } from '../types/domain.js';

export type SingleAgentPhase =
  | 'intake'
  | 'safety-triage'
  | 'directory-lookup'
  | 'ranking'
  | 'booking-intent';

export interface SingleAgentPlan {
  mode: 'single-agent-first';
  phases: SingleAgentPhase[];
  emergencyBypass: boolean;
}

export function buildSingleAgentPlan(input: LocateCareRequest, urgency: Urgency): SingleAgentPlan {
  void input;

  const emergencyBypass = urgency === 'emergency';

  return {
    mode: 'single-agent-first',
    phases: emergencyBypass
      ? ['intake', 'safety-triage']
      : ['intake', 'safety-triage', 'directory-lookup', 'ranking', 'booking-intent'],
    emergencyBypass,
  };
}
