import { ApiSourceDoc } from '../types/series';

export const API_SOURCES_DATA: ApiSourceDoc[] = [
  {
    id: 'tmdb',
    name: 'The Movie Database (TMDb)',
    provider: 'TMDb Community API',
    price: '100% Kostenlos für jeden Nutzer (Gratis-Account)',
    requiresKey: true,
    rateLimit: 'ca. 40-50 Anfragen pro Sekunde (pro eigenem Key!)',
    usCoverage: 'Hervorragend: Jede angekündigte US-Serie mit Cast, Crew, Teaser und Produktionsstatus.',
    deCoverage: 'Sehr gut: Enthält deutsche Übersetzungen, Titel und oft deutsche Verleiher/Plattformen.',
    pros: [
      'Perfekt für "Bring Your Own Key" (BYOK): Jeder User holt sich in 60 Sekunden einen kostenlosen Key',
      'Umfangreichste Datenbank weltweit für Film & Serien',
      'Status-Feld: "Planned", "In Production", "Pilot", "Returning Series"',
      'Zweisprachig abfragbar mit language=de-DE und Fallback'
    ],
    cons: [
      'Nutzer muss sich 1x bei themoviedb.org registrieren, um den Key zu kopieren'
    ],
    sampleEndpoint: 'GET https://api.themoviedb.org/3/tv/{id}?api_key={USER_EIGENER_KEY}&language=de-DE',
    bestFor: 'Basis-Datenbank für Titel, Bilder, Cast, Status & Übersicht aller Serien',
    officialUrl: 'https://developer.themoviedb.org/docs'
  },
  {
    id: 'tvmaze',
    name: 'TVmaze API (Gratis Fallback)',
    provider: 'TVmaze.com',
    price: '100% Kostenlos (Open REST API, KEIN Key erforderlich!)',
    requiresKey: false,
    rateLimit: '20 Calls pro 10 Sekunden',
    usCoverage: 'Ausgezeichnet: Detaillierte Sendezeiten (Network, Webchannel, Premiere-Datum).',
    deCoverage: 'Gut: Listet internationale Networks und deutsche TV-Sender.',
    pros: [
      'Sofort einsatzbereit für User, die noch keinen eigenen Key eingetragen haben',
      'Null Kosten für dich als Entwickler',
      'Präzises Feld status: "In Development", "Running", "To Be Determined"',
      'Sehr leichtgewichtige JSON-Antworten'
    ],
    cons: [
      'Fokus liegt historisch stärker auf US/UK als auf deutschen Streaming-Diensten'
    ],
    sampleEndpoint: 'GET https://api.tvmaze.com/shows/{id} (Kein Key im Header nötig)',
    bestFor: 'Sofortiger Start ohne Key-Hürde für Gelegenheitsnutzer',
    officialUrl: 'https://www.tvmaze.com/api'
  },
  {
    id: 'thetvdb',
    name: 'TheTVDB (Version 4)',
    provider: 'Whip Media',
    price: 'Abo erforderlich ($7.99/Jahr für Developer Key)',
    requiresKey: true,
    rateLimit: 'Hoch',
    usCoverage: 'Sehr tiefgehend: Strukturierte Episoden-Listen und Produktionsnotizen.',
    deCoverage: 'Sehr stark: Große deutsche Fan-Community pflegt deutsche Titel & Termine.',
    pros: [
      'Sehr hohe Datenqualität bei Staffelstrukturen',
      'Genaueste Trennung zwischen US-Originalausstrahlung und internationalem Release'
    ],
    cons: [
      'Kostenpflichtig: Hier MUSS der Nutzer zwingend seinen eigenen Key mitbringen, damit du nicht zahlst!'
    ],
    sampleEndpoint: 'GET https://api4.thetvdb.com/v4/series/{id}/extended (Header: Bearer {USER_KEY})',
    bestFor: 'Power-User, die bereits ein TheTVDB-Abo besitzen',
    officialUrl: 'https://thetvdb.com/api-information'
  },
  {
    id: 'justwatch',
    name: 'JustWatch / Watchmode API',
    provider: 'Watchmode LLC',
    price: 'Free Tier für 1.000 Calls/Monat (danach kostenpflichtig)',
    requiresKey: true,
    rateLimit: 'Abhängig vom User-Plan',
    usCoverage: 'Exzellente Streaming-Verfügbarkeit nach US-Plattformen.',
    deCoverage: 'Beste Quelle für Deutschland: Zeigt WOW, Netflix DE, Prime DE, Disney+.',
    pros: [
      'Löst das Lizenz-Chaos: Erkennt, ob eine US-Serie in DE auf WOW, RTL+ oder Disney+ landet',
      'Bring Your Own Key schützt dich vor teuren B2B-Kosten'
    ],
    cons: [
      'Für Normalnutzer etwas umständlicher zu registrieren'
    ],
    sampleEndpoint: 'GET https://api.watchmode.com/v1/title/{id}/sources/?apiKey={USER_KEY}&regions=DE',
    bestFor: 'Gezielte Prüfung des deutschen Streaming-Anbieters',
    officialUrl: 'https://api.watchmode.com'
  },
  {
    id: 'german-sources',
    name: 'Fernsehserien.de & Wunschliste.de',
    provider: 'imfernsehen GmbH & Co. KG',
    price: 'Kostenlos über RSS-Feeds',
    requiresKey: false,
    rateLimit: 'Fair-Use',
    usCoverage: 'Mittel: Berichtet über US-Starts im News-Bereich.',
    deCoverage: 'Die unangefochtene Nr. 1 in Deutschland für Premieren auf Sky, Free-TV und Streaming.',
    pros: [
      'Kostenloser RSS-Feed ohne API-Key',
      'Genaueste Termine für deutsche Synchron-Premieren'
    ],
    cons: [
      'Keine REST-Schnittstelle, XML/RSS muss geparst werden'
    ],
    sampleEndpoint: 'GET https://www.fernsehserien.de/news/feed.rss (RSS Parsing)',
    bestFor: 'Deutsche TV-Premieren und Synchro-Termine zum Nulltarif',
    officialUrl: 'https://www.fernsehserien.de'
  }
];

export const BYOK_GUIDE = {
  title: 'Das BYOK-Modell ("Bring Your Own Key")',
  summary: 'Warum du als Entwickler KEIN teures API-Abo bezahlen musst',
  reasons: [
    {
      title: '1. Null Kosten für dich als Entwickler',
      description: 'Wenn 10.000 Nutzer deine App verwenden, würden dich kommerzielle API-Abos hunderte Euro im Monat kosten. Beim BYOK-Modell fragt jedes Smartphone mit dem persönlichen Kontingent des Nutzers an – für dich fallen 0 € API-Kosten an.'
    },
    {
      title: '2. TMDb ist für Privatnutzer 100% kostenlos',
      description: 'The Movie Database (TMDb) schenkt jedem registrierten Privatnutzer einen kostenlosen API-Key mit 40 Anfragen pro Sekunde. Dein Nutzer muss lediglich auf themoviedb.org ein Gratis-Konto anlegen und den Key in die App kopieren.'
    },
    {
      title: '3. Hybrides Fallback (Kein Zwang für Gelegenheitsnutzer)',
      description: 'Für Nutzer, die sich nicht registrieren wollen, nutzt deine Android-App TVMaze (100% frei ohne Key). Sobald der Nutzer in den App-Einstellungen seinen eigenen TMDb-Key hinterlegt, schaltet die App deutsche Detail-Synchros und TMDb-Poster frei.'
    },
    {
      title: '4. Rechtssicherheit & Google Play Store Konformität',
      description: 'Apps wie Kodi, Nova Video Player, Stremio oder Tachiyomi nutzen seit Jahren dieses Modell. Die Nutzer tragen ihre eigenen Zugangsdaten ein, womit der Entwickler von Abonnements und Lizenzverträgen befreit ist.'
    }
  ],
  howToImplementAndroid: [
    { step: '1. Einstellungen-Screen', detail: 'In Jetpack Compose ein Textfeld unter "Einstellungen > API-Schlüssel" bereitstellen mit Button "Gratis-Key bei TMDb holen".' },
    { step: '2. Sicher speichern', detail: 'Den Key lokal auf dem Smartphone des Nutzers in EncryptedSharedPreferences oder Jetpack DataStore verschlüsselt sichern.' },
    { step: '3. OkHttp Interceptor', detail: 'In Retrofit einen Interceptor registrieren, der bei jedem API-Aufruf automatisch den gespeicherten Key des Nutzers anfügt.' }
  ]
};

export const ANDROID_DEV_GUIDE = {
  architecture: {
    stack: 'Kotlin + Jetpack Compose + MVVM Architecture',
    libraries: [
      { name: 'Jetpack Compose', purpose: 'Moderne, native Android UI nach Material Design 3' },
      { name: 'EncryptedSharedPreferences', purpose: 'Sichere lokale Speicherung des privaten API-Keys des Nutzers' },
      { name: 'Retrofit & OkHttp', purpose: 'REST-Client mit dynamischem ApiKeyInterceptor' },
      { name: 'Room Database', purpose: 'Lokale SQLite-Datenbank zum Zwischenspeichern von Serien (Offline-First)' },
      { name: 'WorkManager', purpose: 'Hintergrund-Dienst: Prüft 1x täglich im Hintergrund nach neuen Startterminen' },
      { name: 'Coil (Compose)', purpose: 'Asynchrones Laden und Cachen von Postern & Bannern' }
    ]
  },
  whyDelayHappens: [
    {
      title: 'Globaler Streaming-Start (Day & Date)',
      description: 'Bei weltweiten Plattformen (Netflix, Prime Video, Apple TV+, Disney+) erfolgt der Release in 95% der Fälle am selben Tag weltweit synchron mit deutscher Tonspur.',
      impact: '0 Tage Verzögerung'
    },
    {
      title: 'US-Pay-TV & HBO (Sky/WOW Deal)',
      description: 'Serien von HBO/Max (z.B. White Lotus, Knight of the Seven Kingdoms) laufen in Deutschland traditionell exklusiv bei Sky/WOW. Oft zeitgleich nachts im Originalton, die deutsche Synchro folgt teils zeitgleich oder wenige Wochen später.',
      impact: '0 bis 30 Tage'
    },
    {
      title: 'US-Kabelnetzwerke (FX, AMC, Starz, Peacock)',
      description: 'US-Kabelserien haben oft keinen festen weltweiten Partner. Ein deutscher Verleiher muss erst die Lizenzrechte kaufen (z.B. Disney+ für FX, MagentaTV für AMC). Hier entstehen oft 3 bis 12 Monate Verzögerung.',
      impact: '3 bis 12 Monate'
    }
  ]
};
