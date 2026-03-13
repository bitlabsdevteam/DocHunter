import type { Locale, Urgency } from '../types/domain.js';

export function inferUrgencyAndSpecialty(symptoms: string): { urgency: Urgency; specialty: string } {
  const s = symptoms.toLowerCase();

  if (s.includes('chest pain') || s.includes('unconscious') || s.includes('severe bleeding')) {
    return { urgency: 'emergency', specialty: 'emergency medicine' };
  }

  if (s.includes('fracture') || s.includes('broken bone')) {
    return { urgency: 'high', specialty: 'orthopedics' };
  }

  if (s.includes('stomach') || s.includes('abdominal')) {
    return { urgency: 'medium', specialty: 'gastroenterology' };
  }

  return { urgency: 'low', specialty: 'general medicine' };
}

export function disclaimer(locale: Locale): string {
  return locale === 'ja'
    ? '本サービスは医療診断を行いません。緊急時は119へ連絡してください。'
    : 'This service does not provide medical diagnosis. In emergencies in Japan, call 119.';
}
