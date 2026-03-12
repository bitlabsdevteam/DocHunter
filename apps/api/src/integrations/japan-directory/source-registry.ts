export interface DirectorySource {
  id: string;
  kind: 'official' | 'aggregator' | 'search';
  region: 'japan';
  hasPublicApi: boolean;
  bookingSignal: 'direct' | 'indirect' | 'none';
  notes: string;
}

// Discovery registry for Perplexity-assisted research and future connector implementation.
export const japanDirectorySources: DirectorySource[] = [
  {
    id: 'perplexity-web-discovery',
    kind: 'search',
    region: 'japan',
    hasPublicApi: true,
    bookingSignal: 'indirect',
    notes: 'Default research/discovery engine to identify clinic pages, intake hints, and contact channels.',
  },
  {
    id: 'mhlw-registry-candidates',
    kind: 'official',
    region: 'japan',
    hasPublicApi: false,
    bookingSignal: 'none',
    notes: 'Ministry/official registries may require scraping or downloadable datasets; verify licensing before usage.',
  },
  {
    id: 'prefecture-medical-guides',
    kind: 'official',
    region: 'japan',
    hasPublicApi: false,
    bookingSignal: 'indirect',
    notes: 'Prefecture-level portals often expose practical clinic metadata and emergency routing info.',
  },
  {
    id: 'private-clinic-directories',
    kind: 'aggregator',
    region: 'japan',
    hasPublicApi: false,
    bookingSignal: 'indirect',
    notes: 'Commercial directories can be useful for fallback data but require strict ToS review.',
  },
];
