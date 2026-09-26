import React, { useState } from 'react';
import { X, Download, Camera, Check, Sparkles, Smartphone, Eye, Layers } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ScreenshotStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ScreenshotCardData {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  badge: string;
  mockContent: {
    heading: string;
    subheading: string;
    items: Array<{
      title: string;
      tag: string;
      us: string;
      de: string;
      progress: number;
      status: string;
    }>;
  };
}

export const ScreenshotStudioModal: React.FC<ScreenshotStudioModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isCapturingLive, setIsCapturingLive] = useState(false);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  if (!isOpen) return null;

  // The 4 official Play Store Screenshots
  const SCREENSHOT_PREVIEWS: ScreenshotCardData[] = [
    {
      id: 'shot-1',
      number: 1,
      title: 'Serien-Radar & Produktionsstand',
      subtitle: 'Alle geplanten Hollywood-Serien mit aktuellen Set-Berichten',
      badge: 'Haupt-Screen',
      mockContent: {
        heading: 'Serien in Planung & Release',
        subheading: '12 im Radar · 4 im Dreh · 2 Start fix',
        items: [
          {
            title: 'Harry Potter (HBO Serie)',
            tag: 'HBO / Max · Fantasy',
            us: 'Ende 2026',
            de: 'Ende 2026 (WOW)',
            progress: 35,
            status: 'Casting & Vorbereitung',
          },
          {
            title: 'Blade Runner 2099',
            tag: 'Prime Video · Sci-Fi',
            us: 'Frühjahr 2026',
            de: 'Frühjahr 2026 (Prime)',
            progress: 75,
            status: 'Post-Produktion',
          },
          {
            title: 'Alien: Earth',
            tag: 'FX / Hulu · Horror',
            us: 'August 2025',
            de: 'August 2025 (Disney+)',
            progress: 95,
            status: 'Starttermin fix',
          },
        ],
      },
    },
    {
      id: 'shot-2',
      number: 2,
      title: '5-Stufen-Roadmap & Akte',
      subtitle: 'Vom Konzept & Writers Room bis zum Premierentag',
      badge: 'Detail-Akte',
      mockContent: {
        heading: 'A Knight of the Seven Kingdoms',
        subheading: 'Game of Thrones Prequel: Ser Duncan & Egg',
        items: [
          {
            title: '1. In Entwicklung & Drehbuch',
            tag: 'George R.R. Martin & Ira Parker',
            us: 'Erledigt',
            de: 'Bestätigt',
            progress: 100,
            status: 'Abgeschlossen',
          },
          {
            title: '2. Vorproduktion & Casting',
            tag: 'Peter Claffey & Dexter Sol Ansell',
            us: 'Erledigt',
            de: 'Bestätigt',
            progress: 100,
            status: 'Abgeschlossen',
          },
          {
            title: '3. Dreharbeiten am Set',
            tag: 'Belfast & Nordirland Drehort',
            us: 'Herbst 2024',
            de: 'Abgedreht',
            progress: 100,
            status: 'Abgeschlossen',
          },
          {
            title: '4. Post-Produktion & VFX',
            tag: 'Schnitt, Sound & visuelle Effekte',
            us: 'Aktuell',
            de: 'In Arbeit',
            progress: 85,
            status: 'Aktiver Stand am Set',
          },
        ],
      },
    },
    {
      id: 'shot-3',
      number: 3,
      title: 'US- vs. DE-Starttermin Vergleich',
      subtitle: 'Direkter Zeitvergleich: Simultan oder mit Lizenzverzögerung',
      badge: 'Release-Kalender',
      mockContent: {
        heading: 'Release-Radar & Zeitvergleich',
        subheading: 'Chronologische Übersicht 2025 / 2026 / 2027',
        items: [
          {
            title: 'The White Lotus (Staffel 3)',
            tag: 'HBO / Sky / WOW',
            us: 'April 2025',
            de: 'April 2025 (Simultan)',
            progress: 95,
            status: 'Simultaner Weltstart',
          },
          {
            title: 'Spider-Noir (Nicolas Cage)',
            tag: 'MGM+ / Prime Video',
            us: 'Herbst 2025',
            de: 'Herbst 2025 (Simultan)',
            progress: 60,
            status: 'Dreharbeiten in LA',
          },
          {
            title: 'Daredevil: Born Again (St. 2)',
            tag: 'Disney+ Star',
            us: 'Frühjahr 2026',
            de: 'Frühjahr 2026 (Simultan)',
            progress: 55,
            status: 'Dreharbeiten in NY',
          },
        ],
      },
    },
    {
      id: 'shot-4',
      number: 4,
      title: 'BYOK ("Bring Your Own Key")',
      subtitle: '0 € Kosten für Entwickler – Nutzer nutzen eigenen Gratis-Key',
      badge: 'Entwickler & Settings',
      mockContent: {
        heading: 'Einstellungen: TMDb API-Key',
        subheading: 'Persönlicher Gratis-Key des Nutzers',
        items: [
          {
            title: 'Persönlicher TMDb API-Schlüssel',
            tag: 'tmdb_user_key_8f3a1... (AES-256)',
            us: 'Gültig',
            de: 'Aktiv',
            progress: 100,
            status: 'Lokal verschlüsselt gespeichert',
          },
          {
            title: 'Fallback ohne Key: TVMaze API',
            tag: '100% frei und kostenlos',
            us: 'Aktiv',
            de: 'Bereit',
            progress: 100,
            status: 'Sofort einsatzbereit',
          },
          {
            title: 'Entwickler-Kosten',
            tag: 'Keine Abonnements für dich nötig',
            us: '0,00 $',
            de: '0,00 €',
            progress: 100,
            status: '100% Kostenfrei für dich',
          },
        ],
      },
    },
  ];

  // 1. Download live current screen using html2canvas
  const handleCaptureLiveScreen = async () => {
    setIsCapturingLive(true);
    try {
      const element = document.getElementById('android-phone-device');
      if (!element) {
        throw new Error('Smartphone-Element nicht gefunden. Bitte auf Smartphone-Ansicht umschalten.');
      }

      const canvas = await html2canvas(element, {
        scale: 2, // High resolution (2x Retina)
        backgroundColor: '#090d16',
        useCORS: true,
        logging: false,
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `SeriesRadar_Live_Screenshot_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      setDownloadSuccessMessage('Live-Screenshot erfolgreich als PNG gespeichert!');
      setTimeout(() => setDownloadSuccessMessage(null), 3000);
    } catch (err: any) {
      alert(err?.message || 'Fehler beim Erstellen des Screenshots.');
    } finally {
      setIsCapturingLive(false);
    }
  };

  // 2. Download styled Play Store card screenshot using html2canvas
  const handleDownloadCardScreenshot = async (cardId: string, filename: string) => {
    setDownloadingId(cardId);
    try {
      const element = document.getElementById(`screenshot-card-${cardId}`);
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2.5, // Ultra crisp for presentations
        backgroundColor: '#060911',
        useCORS: true,
        logging: false,
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();

      setDownloadSuccessMessage(`${filename}.png heruntergeladen!`);
      setTimeout(() => setDownloadSuccessMessage(null), 3000);
    } catch {
      alert('Fehler beim Exportieren des Screenshots.');
    } finally {
      setDownloadingId(null);
    }
  };

  // Download all 4 screenshots sequentially
  const handleDownloadAll = async () => {
    for (const shot of SCREENSHOT_PREVIEWS) {
      await handleDownloadCardScreenshot(shot.id, `SeriesRadar_Screenshot_${shot.number}_${shot.id}`);
      await new Promise((resolve) => setTimeout(resolve, 350));
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-hidden"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-[#090d16] border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100 min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-[#0c111d]">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-sm shadow-amber-400/20 font-bold">
              <Camera className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight truncate">
                App-Screenshots & Download-Studio
              </h2>
              <p className="text-[11px] text-slate-400 truncate">
                Speichere gestochen scharfe Screenshots der Android-App als PNG
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-950/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 shrink-0 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCaptureLiveScreen}
              disabled={isCapturingLive}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm shadow-amber-950/50 disabled:opacity-50"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{isCapturingLive ? 'Erstelle Snapshot...' : 'Live-Ansicht jetzt fotografieren'}</span>
            </button>

            <button
              onClick={handleDownloadAll}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Alle 4 Screenshots laden</span>
              <span className="sm:hidden">Alle 4</span>
            </button>
          </div>

          {downloadSuccessMessage && (
            <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 animate-fade-in bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
              <Check className="w-3 h-3" />
              <span>{downloadSuccessMessage}</span>
            </div>
          )}
        </div>

        {/* Scrollable Gallery Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <div className="text-xs text-slate-400">
            Klicke bei einem beliebigen Screen auf <strong>„Als PNG speichern“</strong>, um den Screenshot in hoher Auflösung direkt auf deinem Computer oder Handy zu sichern:
          </div>

          {/* 4 Screenshot Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SCREENSHOT_PREVIEWS.map((shot) => {
              const isDownloading = downloadingId === shot.id;

              return (
                <div
                  key={shot.id}
                  className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3.5 shadow-sm"
                >
                  {/* Top Bar for Card */}
                  <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-800/80">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-mono-numbers px-1.5 py-0.2 bg-amber-400/20 text-amber-300 rounded font-semibold">
                          #{shot.number}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {shot.badge}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white truncate">
                        {shot.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 truncate">
                        {shot.subtitle}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDownloadCardScreenshot(shot.id, `SeriesRadar_Screenshot_${shot.number}_${shot.id}`)}
                      disabled={isDownloading}
                      className="px-2.5 py-1.5 bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 border border-amber-400/30 font-semibold rounded-xl text-xs flex items-center gap-1 shrink-0 transition-colors"
                      title="Diesen Screenshot als PNG herunterladen"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isDownloading ? 'Lädt...' : 'Als PNG'}</span>
                    </button>
                  </div>

                  {/* Visual Phone Mockup Container (This is what gets captured) */}
                  <div
                    id={`screenshot-card-${shot.id}`}
                    className="p-3 bg-[#060911] rounded-2xl border border-slate-800 shadow-inner flex flex-col space-y-2.5 select-none"
                  >
                    {/* Simulated Phone Top Bezel */}
                    <div className="flex items-center justify-between text-[9px] font-mono-numbers text-slate-500 px-1">
                      <span>10:42</span>
                      <div className="flex items-center gap-1">
                        <span className="text-[8px] bg-slate-800 px-1 rounded text-slate-400">5G</span>
                        <span>98%</span>
                      </div>
                    </div>

                    {/* App Title Header */}
                    <div className="px-1 flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400 tracking-tight">
                        SeriesRadar
                      </span>
                      <span className="text-[9px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded">
                        Android Preview
                      </span>
                    </div>

                    {/* Mini Hero */}
                    <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 space-y-0.5">
                      <div className="text-[11px] font-bold text-white truncate">
                        {shot.mockContent.heading}
                      </div>
                      <div className="text-[9px] text-slate-400 truncate">
                        {shot.mockContent.subheading}
                      </div>
                    </div>

                    {/* Mock Series List */}
                    <div className="space-y-1.5">
                      {shot.mockContent.items.map((item, i) => (
                        <div
                          key={i}
                          className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1"
                        >
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-bold text-white truncate max-w-[150px]">{item.title}</span>
                            <span className="font-mono-numbers text-amber-400 font-semibold text-[9px]">
                              {item.progress}%
                            </span>
                          </div>

                          <div className="text-[9px] text-slate-400 truncate">
                            {item.tag}
                          </div>

                          {/* Progress bar */}
                          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>

                          {/* Dual Date Box */}
                          <div className="grid grid-cols-2 gap-1 pt-0.5 text-[8px] text-slate-400">
                            <div className="bg-slate-900/60 p-1 rounded">
                              <span className="text-slate-500 block">🇺🇸 US</span>
                              <span className="text-slate-200 font-medium truncate block">{item.us}</span>
                            </div>
                            <div className="bg-slate-900/60 p-1 rounded">
                              <span className="text-amber-400 block">🇩🇪 DE</span>
                              <span className="text-amber-300 font-medium truncate block">{item.de}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Mini Android Bottom Gestures Bar */}
                    <div className="pt-1 flex items-center justify-center">
                      <div className="w-16 h-0.5 bg-slate-700/60 rounded-full" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 border-t border-slate-800 bg-[#0c111d] flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>Format: Hochauflösende PNG-Dateien</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors font-medium"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
