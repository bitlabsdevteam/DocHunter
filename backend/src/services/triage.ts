import type { Urgency } from '../types/triage';

export function inferUrgencyAndSpecialty(symptoms: string): { urgency: Urgency; specialty: string } {
  const s = symptoms.toLowerCase();

  if (s.includes('chest pain') || s.includes('unconscious') || s.includes('severe bleeding')) {
    return { urgency: 'emergency', specialty: 'emergency medicine' };
  }

  if (s.includes('broken') || s.includes('fracture')) {
    return { urgency: 'high', specialty: 'orthopedics' };
  }

  if (s.includes('stomach') || s.includes('abdominal')) {
    return { urgency: 'medium', specialty: 'gastroenterology' };
  }

  return { urgency: 'low', specialty: 'general medicine' };
}
