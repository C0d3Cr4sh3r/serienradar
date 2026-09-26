import { SeriesItem, ProductionStage } from '../types/series';

export interface TvMazeShow {
  id: number;
  url: string;
  name: string;
  type: string;
  language: string;
  genres: string[];
  status: string; // 'In Development', 'Running', 'Ended', 'To Be Determined'
  runtime?: number;
  averageRuntime?: number;
  premiered?: string;
  ended?: string;
  officialSite?: string;
  schedule?: {
    time: string;
    days: string[];
  };
  rating?: {
    average?: number;
  };
  network?: {
    id: number;
    name: string;
    country?: {
      name: string;
      code: string;
      timezone: string;
    };
  };
  webChannel?: {
    id: number;
    name: string;
    country?: {
      name: string;
      code: string;
      timezone: string;
    };
  };
  image?: {
    medium?: string;
    original?: string;
  };
  summary?: string;
  updated?: number;
}

// Map TVMaze status to our ProductionStage
export function mapTvMazeStatusToStage(status: string, premiered?: string): { stage: ProductionStage; progress: number } {
  const s = (status || '').toLowerCase();
  
  if (s.includes('development')) {
    return { stage: 'development', progress: 25 };
  }
  if (s.includes('determined') || !premiered) {
    return { stage: 'pre_production', progress: 45 };
  }
  if (premiered) {
    const premiereYear = parseInt(premiered.slice(0, 4), 10);
    const currentYear = new Date().getFullYear();
    if (premiereYear >= currentYear) {
      return { stage: 'scheduled', progress: 95 };
    }
  }
  return { stage: 'post_production', progress: 75 };
}

// Infer probable German distributor based on US network
export function inferGermanPlatform(networkName: string): { platform: string; isSimultaneous: boolean; note: string } {
  const net = (networkName || '').toLowerCase();
  
  if (net.includes('hbo') || net.includes('max')) {
    return { platform: 'Sky / WOW Deutschland', isSimultaneous: true, note: 'HBO-Lizenzabkommen in DE' };
  }
  if (net.includes('netflix')) {
    return { platform: 'Netflix Deutschland', isSimultaneous: true, note: 'Weltweiter synchroner Start' };
  }
  if (net.includes('disney') || net.includes('fx') || net.includes('hulu') || net.includes('marvel')) {
    return { platform: 'Disney+ (Star)', isSimultaneous: true, note: 'Disney Konzernauswertung' };
  }
  if (net.includes('amazon') || net.includes('prime') || net.includes('mgm')) {
    return { platform: 'Amazon Prime Video Deutschland', isSimultaneous: true, note: 'Globaler Prime Video Release' };
  }
  if (net.includes('apple')) {
    return { platform: 'Apple TV+ Deutschland', isSimultaneous: true, note: 'Weltweiter Day-and-Date Start' };
  }
  if (net.includes('paramount')) {
    return { platform: 'Paramount+ Deutschland', isSimultaneous: false, note: 'Teils zeitversetzt' };
  }
  return { platform: 'Rechteauswertung offen (z.B. WOW / RTL+)', isSimultaneous: false, note: 'Lizenz noch nicht vergeben' };
}

// Convert a TVMaze show to our SeriesItem structure
export function convertTvMazeToShow(show: TvMazeShow): SeriesItem {
  const { stage, progress } = mapTvMazeStatusToStage(show.status, show.premiered);
  const networkName = show.network?.name || show.webChannel?.name || 'US Network';
  const deInfo = inferGermanPlatform(networkName);
  
  // Clean HTML from summary
  const cleanSummary = (show.summary || '')
    .replace(/<[^>]*>?/gm, '')
    .trim() || 'Aktuell in Planung / Entwicklung laut TVMaze Datenbank.';

  return {
    id: `tvmaze-${show.id}`,
    title: show.name,
    originalTitle: show.name,
    tagline: `${networkName} Originalproduktion (${show.status})`,
    synopsis: cleanSummary,
    stage,
    stageProgress: progress,
    stageDetail: `Live-Status aus TVMaze: "${show.status}". Sender/Plattform: ${networkName}.`,
    genres: show.genres && show.genres.length > 0 ? show.genres : ['Drama', 'Serie'],
    creators: [networkName],
    cast: ['Wird via TVMaze aktualisiert'],
    release: {
      usDate: show.premiered ? `Start: ${show.premiered}` : 'Termin TBA (In Planung)',
      usQuarter: show.premiered ? show.premiered.slice(0, 7) : 'TBA',
      usNetwork: networkName,
      deDate: deInfo.isSimultaneous ? 'Zeitgleich mit US erwartet' : 'TBA (Verzögerung möglich)',
      dePlatform: deInfo.platform,
      deStatus: deInfo.isSimultaneous ? 'simultaneous' : 'unconfirmed',
    },
    source: {
      name: 'TVmaze Open REST API (Live)',
      url: show.url,
      verifiedDate: 'Echtzeit-Abfrage',
      reliability: 'Offiziell bestätigt',
    },
    expectedEpisodes: show.runtime || 8,
    bannerColor: 'from-slate-900 via-slate-950 to-black',
  };
}

// Search TVMaze shows live
export async function searchTvMazeLive(query: string): Promise<SeriesItem[]> {
  const res = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`);
  if (!res.ok) {
    throw new Error(`TVMaze API Fehler: ${res.status}`);
  }
  const data: Array<{ show: TvMazeShow }> = await res.json();
  return data.map((item) => convertTvMazeToShow(item.show));
}

// Fetch a curated list of upcoming / in development shows live from TVMaze
export async function fetchLiveUpcomingShows(): Promise<SeriesItem[]> {
  const searchTerms = ['Alien', 'Blade Runner', 'Dune', 'Spider-Man', 'Star Wars', 'Daredevil', 'Harry Potter', 'Game of Thrones', 'Neuromancer', 'Lord of the Rings'];
  
  const results = await Promise.allSettled(
    searchTerms.slice(0, 6).map(async (term) => {
      const res = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(term)}`);
      if (!res.ok) return [];
      const data: Array<{ show: TvMazeShow }> = await res.json();
      return data.slice(0, 2).map((item) => convertTvMazeToShow(item.show));
    })
  );

  const merged: SeriesItem[] = [];
  const seenIds = new Set<string>();

  for (const r of results) {
    if (r.status === 'fulfilled') {
      for (const item of r.value) {
        if (!seenIds.has(item.id)) {
          seenIds.add(item.id);
          merged.push(item);
        }
      }
    }
  }

  return merged;
}
