import type { ClinicCandidate } from '../../types/domain.js';

export interface DirectoryLookupInput {
  symptoms: string;
  specialty: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  locale: 'en' | 'ja';
}

export interface BookingIntentInput {
  clinicIdOrName: string;
  preferredDateTimeISO: string;
  patientEmail: string;
  patientName?: string;
  locale: 'en' | 'ja';
}

export interface BookingIntentResult {
  status: 'pending' | 'confirmed' | 'manual_required';
  reference?: string;
  instructions?: string;
}

export interface McpDirectoryTool {
  lookup(input: DirectoryLookupInput): Promise<ClinicCandidate[]>;
}

export interface McpBookingTool {
  createIntent(input: BookingIntentInput): Promise<BookingIntentResult>;
}
