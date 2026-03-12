export type Urgency = 'low' | 'medium' | 'high' | 'emergency';

export interface TriageRequest {
  symptoms: string;
  locale: 'en' | 'ja';
  location?: {
    lat: number;
    lng: number;
    city?: string;
    postalCode?: string;
  };
}

export interface ClinicCandidate {
  name: string;
  address: string;
  distanceKm: number;
  specialty: string;
  availabilityHint?: string;
}

export interface TriageResponse {
  urgency: Urgency;
  specialty: string;
  recommendations: ClinicCandidate[];
  disclaimer: string;
}
