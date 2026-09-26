export type ProductionStage = 
  | 'development'    // Konzept & Drehbuch
  | 'pre_production' // Casting & Vorbereitung
  | 'filming'        // Aktive Dreharbeiten
  | 'post_production'// Schnitt, CGI & Ton
  | 'scheduled';     // Fester Starttermin angekündigt

export interface ReleaseInfo {
  usDate: string;             // z.B. "15. Januar 2026" oder "Herbst 2026"
  usQuarter?: string;         // z.B. "Q4 2026"
  usNetwork: string;          // z.B. "HBO / Max", "FX / Hulu", "Apple TV+"
  deDate: string;             // z.B. "16. Januar 2026 (Simultan)" oder "Frühjahr 2027"
  dePlatform: string;         // z.B. "WOW / Sky Deutschland", "Disney+ Star"
  deStatus: 'simultaneous' | 'delayed' | 'unconfirmed' | 'free_tv_later';
  deDelayDays?: number;       // Verzögerung in Tagen (0 = simultan)
}

export interface SeriesItem {
  id: string;
  title: string;
  originalTitle?: string;
  tagline: string;
  synopsis: string;
  stage: ProductionStage;
  stageProgress: number;      // 0 bis 100 Prozent
  stageDetail: string;        // z.B. "Dreharbeiten laufen seit Jan 2025 in Leavesden Studios"
  genres: string[];
  creators: string[];
  cast: string[];
  release: ReleaseInfo;
  source: {
    name: string;             // z.B. "TMDb & Deadline Hollywood"
    url?: string;
    verifiedDate: string;     // z.B. "Februar 2025"
    reliability: 'Offiziell bestätigt' | 'Verlässlicher Insider' | 'In Verhandlung';
  };
  expectedSeasons?: number;
  expectedEpisodes?: number;
  bannerColor: string;        // Gradient background color accent
  iconEmoji?: string;
}

export interface ApiSourceDoc {
  id: string;
  name: string;
  provider: string;
  price: string;
  requiresKey: boolean;
  rateLimit: string;
  usCoverage: string;
  deCoverage: string;
  pros: string[];
  cons: string[];
  sampleEndpoint: string;
  bestFor: string;
  officialUrl: string;
}
