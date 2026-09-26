import React from 'react';
import { Bookmark, Film, ChevronRight } from 'lucide-react';
import { SeriesItem } from '../types/series';
import { STAGE_CONFIG } from '../data/mockSeries';

interface SeriesCardProps {
  series: SeriesItem;
  isBookmarked: boolean;
  onToggleBookmark: (seriesId: string) => void;
  onOpenDetails: (series: SeriesItem) => void;
}

export const SeriesCard: React.FC<SeriesCardProps> = ({
  series,
  isBookmarked,
  onToggleBookmark,
  onOpenDetails,
}) => {
  const currentStage = STAGE_CONFIG[series.stage] || STAGE_CONFIG.development;

  return (
    <article
      onClick={() => onOpenDetails(series)}
      className="group relative bg-slate-900/60 hover:bg-slate-900/95 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-3.5 sm:p-4 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:shadow-black/50 flex flex-col justify-between w-full min-w-0 overflow-hidden"
    >
      <div className="w-full min-w-0">
        {/* Top Header Row: Network / Platform & Bookmark Action */}
        <div className="flex items-center justify-between gap-2 mb-1.5 text-xs text-slate-400 min-w-0">
          <div className="flex items-center gap-1.5 truncate min-w-0">
            <span className="font-semibold text-slate-300 truncate">{series.release.usNetwork}</span>
            <span aria-hidden="true" className="text-slate-600 shrink-0">·</span>
            <span className="truncate text-slate-400">{series.genres.slice(0, 2).join(', ')}</span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(series.id);
            }}
            aria-label={isBookmarked ? 'Aus Merkliste entfernen' : 'In Merkliste speichern'}
            className={`min-h-[32px] min-w-[32px] p-1.5 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
              isBookmarked
                ? 'text-amber-400 bg-amber-400/10'
                : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
          </button>
        </div>

        {/* Title & Tagline */}
        <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-400 transition-colors leading-snug line-clamp-1">
          {series.title}
        </h3>
        <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
          {series.tagline}
        </p>

        {/* Production Stage Indicator */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/70">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-slate-400 flex items-center gap-1.5 truncate">
              <Film className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">Stand: <strong className="text-slate-200 font-medium">{currentStage.label}</strong></span>
            </span>
            <span className="font-mono-numbers text-amber-400/90 text-[10px] font-semibold shrink-0 ml-1">
              {series.stageProgress}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-300"
              style={{ width: `${series.stageProgress}%` }}
            />
          </div>

          <p className="text-[10px] text-slate-400 mt-1 line-clamp-1 italic">
            {series.stageDetail}
          </p>
        </div>

        {/* Dual Release Tracker Box (US vs DE) */}
        <div className="mt-2.5 p-2 rounded-xl bg-slate-950/80 border border-slate-800/70 grid grid-cols-2 gap-2 text-xs min-w-0">
          {/* US Release */}
          <div className="border-r border-slate-800/80 pr-1.5 min-w-0">
            <div className="text-[9px] uppercase tracking-wider text-slate-400 font-medium flex items-center gap-1 truncate">
              <span>🇺🇸 US-Start</span>
            </div>
            <div className="text-slate-200 font-semibold mt-0.5 truncate font-mono-numbers text-[11px]">
              {series.release.usDate}
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              {series.release.usNetwork}
            </div>
          </div>

          {/* DE Release */}
          <div className="pl-1 min-w-0">
            <div className="text-[9px] uppercase tracking-wider text-amber-400/90 font-medium flex items-center gap-1 truncate">
              <span>🇩🇪 DE-Start</span>
            </div>
            <div className="text-amber-300 font-semibold mt-0.5 truncate font-mono-numbers text-[11px]">
              {series.release.deDate}
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              {series.release.dePlatform}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Metadata */}
      <div className="mt-2.5 pt-2 border-t border-slate-800/40 flex items-center justify-between text-[10px] text-slate-400 min-w-0">
        <div className="flex items-center gap-1 truncate min-w-0 pr-2">
          {series.id.startsWith('tvmaze-') ? (
            <span className="flex items-center gap-1 text-emerald-400 font-medium truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="truncate">TVMaze Live</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-slate-400 truncate">
              <span className="text-slate-500 shrink-0">Quelle:</span>
              <span className="truncate text-slate-300">{series.source.name}</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-0.5 text-slate-400 group-hover:text-amber-400 transition-colors shrink-0">
          <span>Details</span>
          <ChevronRight className="w-3 h-3" />
        </div>
      </div>
    </article>
  );
};
