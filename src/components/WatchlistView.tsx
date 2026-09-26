import React from 'react';
import { Bookmark, Film, Trash2, Calendar, ChevronRight, Check } from 'lucide-react';
import { SeriesItem } from '../types/series';

interface WatchlistViewProps {
  seriesList: SeriesItem[];
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
  onSelectSeries: (series: SeriesItem) => void;
  onExploreMore: () => void;
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({
  seriesList,
  bookmarkedIds,
  onToggleBookmark,
  onSelectSeries,
  onExploreMore,
}) => {
  const bookmarkedSeries = seriesList.filter((s) => bookmarkedIds.includes(s.id));

  return (
    <div className="space-y-3.5 w-full min-w-0 overflow-hidden">
      {/* Header Banner */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3.5 sm:p-4 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold uppercase tracking-wider truncate">
            <Bookmark className="w-3.5 h-3.5 fill-amber-400 shrink-0" />
            <span className="truncate">Merkliste & Start-Alarme</span>
          </div>
          <span className="text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 font-medium">
            <Check className="w-2.5 h-2.5" />
            <span>Alarme an</span>
          </span>
        </div>

        <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
          Deine beobachteten Serien
        </h2>
        <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 leading-relaxed">
          Aktuell befinden sich <strong className="text-amber-400 font-mono-numbers">{bookmarkedSeries.length}</strong> Serien auf deinem Release-Radar.
        </p>
      </div>

      {/* Bookmarked Series Cards */}
      {bookmarkedSeries.length === 0 ? (
        <div className="text-center py-12 px-4 bg-slate-900/30 rounded-2xl border border-slate-800/80">
          <div className="w-10 h-10 rounded-xl bg-slate-800/80 text-amber-400 flex items-center justify-center mx-auto mb-2.5">
            <Bookmark className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-200">Noch keine Serien gemerkt</h3>
          <p className="text-[11px] text-slate-400 max-w-xs mx-auto mt-1 leading-relaxed">
            Klicke bei einer Serie auf das Lesezeichen, um Veröffentlichungsdaten im Blick zu behalten.
          </p>
          <button
            onClick={onExploreMore}
            className="mt-3.5 px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs rounded-xl transition-all"
          >
            Serien durchstöbern
          </button>
        </div>
      ) : (
        <div className="space-y-2.5 w-full min-w-0">
          {bookmarkedSeries.map((series) => (
            <div
              key={series.id}
              onClick={() => onSelectSeries(series)}
              className="group p-3 sm:p-3.5 bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 rounded-xl transition-all cursor-pointer shadow-sm flex flex-col gap-2 w-full min-w-0"
            >
              {/* Row 1: Title & Actions */}
              <div className="flex items-start justify-between gap-2 min-w-0">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 truncate mb-0.5">
                    <span className="font-semibold text-slate-300 truncate">{series.release.usNetwork}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-amber-400 font-medium">Stand: {series.stageProgress}%</span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                    {series.title}
                  </h4>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(series.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Aus Merkliste entfernen"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400" />
                </div>
              </div>

              {/* Row 2: Status detail text */}
              <p className="text-[11px] text-slate-400 line-clamp-1 italic">
                {series.stageDetail}
              </p>

              {/* Row 3: Release compact comparison box */}
              <div className="grid grid-cols-2 gap-1.5 p-2 bg-slate-950/80 rounded-lg border border-slate-800/70 text-xs min-w-0">
                <div className="border-r border-slate-800/80 pr-1.5 min-w-0">
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 block font-medium">
                    🇺🇸 US-Start
                  </span>
                  <span className="text-[11px] font-semibold text-slate-200 block truncate font-mono-numbers mt-0.5">
                    {series.release.usDate}
                  </span>
                </div>

                <div className="pl-1 min-w-0">
                  <span className="text-[9px] uppercase tracking-wider text-amber-400/90 block font-medium">
                    🇩🇪 DE-Start
                  </span>
                  <span className="text-[11px] font-semibold text-amber-300 block truncate font-mono-numbers mt-0.5">
                    {series.release.deDate}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
