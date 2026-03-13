export type Locale = 'en' | 'ja';
export type ModelProvider = 'openai' | 'gemini';
export type Urgency = 'low' | 'medium' | 'high' | 'emergency';

export interface LocateCareRequest {
  locale: Locale;
  symptoms: string;
  latitude?: number;
  longitude?: number;
  city?: string;
}

export interface ClinicCandidate {
  name: string;
  address: string;
  distanceKm: number;
  specialty: string;
  availabilityHint: string;
  bookingMode: 'external_link' | 'phone' | 'mcp_booking';
  sourceUrl?: string;
}

export interface LocateCareResponse {
  urgency: Urgency;
  specialty: string;
  modelProvider: ModelProvider;
  recommendations: ClinicCandidate[];
  disclaimer: string;
  orchestration?: {
    architecture: 'single-agent-first';
    phases: string[];
    promptProfile: 'healthcare-locator-japan';
  };
}
