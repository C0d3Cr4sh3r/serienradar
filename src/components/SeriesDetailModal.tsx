import React, { useState } from 'react';
import { X, Bookmark, Bell, BellRing, ExternalLink, Film, CheckCircle2, Circle, AlertCircle, Share2 } from 'lucide-react';
import { SeriesItem } from '../types/series';
import { STAGE_CONFIG } from '../data/mockSeries';

interface SeriesDetailModalProps {
  series: SeriesItem | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
}

export const SeriesDetailModal: React.FC<SeriesDetailModalProps> = ({
  series,
  onClose,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!series) return null;

  const currentStage = STAGE_CONFIG[series.stage] || STAGE_CONFIG.development;

  const stagesList = [
    { key: 'development', label: '1. In Entwicklung / Skript' },
    { key: 'pre_production', label: '2. Casting & Vorbereitung' },
    { key: 'filming', label: '3. Dreharbeiten am Set' },
    { key: 'post_production', label: '4. Post-Produktion & VFX' },
    { key: 'scheduled', label: '5. Starttermin angekündigt' },
  ];

  const currentStageIndex = stagesList.findIndex((s) => s.key === series.stage);

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[90vh] bg-[#0c111d] border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator */}
        <div className="w-10 h-1.5 bg-slate-700/80 rounded-full mx-auto my-3 sm:hidden shrink-0" />

        {/* Modal Top Bar */}
        <div className="px-5 py-3 border-b border-slate-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 truncate">
            <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
              Serien-Akte
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400 truncate">{series.release.usNetwork}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleShare}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1"
              title="Teilen"
            >
              <Share2 className="w-4 h-4" />
              {copiedLink && <span className="text-amber-400">Kopiert!</span>}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Schließen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto px-5 py-4 space-y-5 text-sm">
          {/* Header Title & Tagline */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {series.title}
            </h2>
            {series.originalTitle && series.originalTitle !== series.title && (
              <p className="text-xs text-slate-400 mt-0.5">
                Originaltitel: <span className="text-slate-300 italic">{series.originalTitle}</span>
              </p>
            )}
            <p className="text-slate-300 text-sm mt-2 leading-relaxed font-medium">
              {series.tagline}
            </p>
          </div>

          {/* Dual Release Dates Spotlight */}
          <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Starttermin-Radar & Verfügbarkeit
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* US Release */}
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                  <span className="text-base">🇺🇸</span>
                  <span>US-Premiere</span>
                </div>
                <div className="text-base font-bold text-white mt-1 font-mono-numbers">
                  {series.release.usDate}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Sender: <strong className="text-slate-300">{series.release.usNetwork}</strong>
                </div>
              </div>

              {/* German Release */}
              <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                <div className="text-xs text-amber-400 font-medium flex items-center gap-1.5">
                  <span className="text-base">🇩🇪</span>
                  <span>Deutscher Starttermin</span>
                </div>
                <div className="text-base font-bold text-amber-300 mt-1 font-mono-numbers">
                  {series.release.deDate}
                </div>
                <div className="text-xs text-slate-300 mt-0.5">
                  Plattform: <strong className="text-white">{series.release.dePlatform}</strong>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/50 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                {series.release.deStatus === 'simultaneous'
                  ? 'Simultan-Release: Durch globale Lizenzierung ist die Veröffentlichung in Deutschland zeitgleich mit US geplant.'
                  : 'Zeitverzögerung möglich: Die Rechte für den deutschen Markt werden separat ausgewertet.'}
              </span>
            </div>
          </div>

          {/* 5-Step Production Roadmap */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Film className="w-4 h-4 text-amber-400" />
                <span>Produktions-Pipeline</span>
              </span>
              <span className="text-amber-400 font-mono-numbers font-semibold">
                {series.stageProgress}% abgeschlossen
              </span>
            </div>

            <div className="space-y-1.5 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
              {stagesList.map((st, idx) => {
                const isPassed = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                return (
                  <div
                    key={st.key}
                    className={`flex items-center gap-2.5 p-1.5 rounded-lg text-xs transition-colors ${
                      isCurrent
                        ? 'bg-amber-400/10 text-amber-300 font-semibold'
                        : isPassed
                        ? 'text-slate-400'
                        : 'text-slate-600'
                    }`}
                  >
                    {isPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <div className="w-4 h-4 rounded-full border-2 border-amber-400 flex items-center justify-center shrink-0">
                        <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                      </div>
                    ) : (
                      <Circle className="w-4 h-4 text-slate-700 shrink-0" />
                    )}
                    <span className="truncate">{st.label}</span>
                    {isCurrent && (
                      <span className="ml-auto text-[10px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded">
                        Aktueller Stand
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800/60">
              <strong>Aktueller Detailbericht:</strong> {series.stageDetail}
            </p>
          </div>

          {/* Synopsis */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Handlung & Konzept
            </h4>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {series.synopsis}
            </p>
          </div>

          {/* Creators & Cast */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800/80">
              <span className="text-slate-400 block mb-1">Macher & Showrunner:</span>
              <span className="text-slate-200 font-medium">
                {series.creators.join(', ')}
              </span>
            </div>

            <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800/80">
              <span className="text-slate-400 block mb-1">Besetzung / Cast:</span>
              <span className="text-slate-200 font-medium">
                {series.cast.join(', ')}
              </span>
            </div>
          </div>

          {/* Source Attribution & Data Reliability */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs flex items-center justify-between">
            <div>
              <div className="text-slate-400">Offizielle Datenquelle:</div>
              <div className="text-slate-200 font-semibold mt-0.5">{series.source.name}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Verifiziert: {series.source.verifiedDate} · Status: <span className="text-emerald-400">{series.source.reliability}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Episodenzahl ca.</span>
              <span className="font-mono-numbers text-slate-200 font-semibold">{series.expectedEpisodes || 'TBA'} Folgen</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 border-t border-slate-800 bg-[#090d16] flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onToggleBookmark(series.id)}
            className={`flex-1 min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              isBookmarked
                ? 'bg-amber-400 text-slate-950 shadow-sm shadow-amber-400/20'
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            <span>{isBookmarked ? 'In Merkliste gespeichert' : 'Auf Merkliste setzen'}</span>
          </button>

          <button
            onClick={() => setNotificationEnabled(!notificationEnabled)}
            className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors border ${
              notificationEnabled
                ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                : 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300'
            }`}
            title="Benachrichtigung bei festem DE-Starttermin aktivieren"
          >
            {notificationEnabled ? (
              <>
                <BellRing className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Alarm aktiv</span>
              </>
            ) : (
              <>
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Start-Alarm</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
