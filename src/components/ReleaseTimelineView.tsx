import React, { useState } from 'react';
import { Calendar, ChevronRight, Globe2 } from 'lucide-react';
import { SeriesItem } from '../types/series';

interface ReleaseTimelineViewProps {
  seriesList: SeriesItem[];
  onSelectSeries: (series: SeriesItem) => void;
  onToggleBookmark: (id: string) => void;
  bookmarks: string[];
}

export const ReleaseTimelineView: React.FC<ReleaseTimelineViewProps> = ({
  seriesList,
  onSelectSeries,
}) => {
  const [yearFilter, setYearFilter] = useState<'all' | '2025' | '2026' | '2027'>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');

  // Filter series
  const filteredList = seriesList.filter((s) => {
    if (yearFilter !== 'all') {
      const matchUS = s.release.usDate.includes(yearFilter) || (s.release.usQuarter && s.release.usQuarter.includes(yearFilter));
      const matchDE = s.release.deDate.includes(yearFilter);
      if (!matchUS && !matchDE) return false;
    }
    if (platformFilter !== 'all') {
      const combined = `${s.release.usNetwork} ${s.release.dePlatform}`.toLowerCase();
      if (!combined.includes(platformFilter.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="space-y-3.5 w-full min-w-0">
      {/* Intro Header */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 sm:p-5">
        <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold uppercase tracking-wider mb-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>Release-Radar & Zeitvergleich</span>
        </div>
        <h2 className="text-base sm:text-xl font-bold text-white leading-tight">
          US-Start vs. Deutscher Starttermin
        </h2>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          Vergleiche anstehende Serien chronologisch und erfahre, ob sie simultan oder mit Verzögerung starten.
        </p>

        {/* Filter Rows (Clean horizontal scroll for mobile) */}
        <div className="mt-3.5 pt-3 border-t border-slate-800/80 space-y-2">
          {/* Year Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-[10px] uppercase text-slate-500 font-medium shrink-0 mr-1">Jahr:</span>
            {(['all', '2025', '2026', '2027'] as const).map((yr) => (
              <button
                key={yr}
                onClick={() => setYearFilter(yr)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  yearFilter === yr
                    ? 'bg-amber-400 text-slate-950 font-semibold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {yr === 'all' ? 'Alle Jahre' : yr}
              </button>
            ))}
          </div>

          {/* Platform Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-[10px] uppercase text-slate-500 font-medium shrink-0 mr-1">Sender:</span>
            {[
              { id: 'all', label: 'Alle' },
              { id: 'hbo', label: 'HBO / Sky' },
              { id: 'disney', label: 'Disney+' },
              { id: 'prime', label: 'Prime' },
              { id: 'netflix', label: 'Netflix' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPlatformFilter(p.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  platformFilter === p.id
                    ? 'bg-amber-400 text-slate-950 font-semibold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-2.5">
        {filteredList.length === 0 ? (
          <div className="text-center py-10 bg-slate-900/30 rounded-2xl border border-slate-800/60 p-4">
            <p className="text-slate-400 text-xs">Keine Serien für diese Filter gefunden.</p>
            <button
              onClick={() => { setYearFilter('all'); setPlatformFilter('all'); }}
              className="mt-2.5 px-3 py-1 text-xs text-amber-400 border border-amber-500/30 rounded-lg"
            >
              Filter zurücksetzen
            </button>
          </div>
        ) : (
          filteredList.map((series) => {
            const isSimultaneous = series.release.deStatus === 'simultaneous';

            return (
              <div
                key={series.id}
                onClick={() => onSelectSeries(series)}
                className="group p-3 sm:p-4 rounded-xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer shadow-sm flex flex-col gap-2.5 w-full min-w-0"
              >
                {/* Title & Metadata Header */}
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 truncate">
                      <span className="font-semibold text-slate-300 truncate">{series.release.usNetwork}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="truncate">{series.genres[0]}</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-400 transition-colors truncate mt-0.5">
                      {series.title}
                    </h3>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 shrink-0 ml-1" />
                </div>

                {/* Release Schedule Box (Fits 100% on mobile without blowout) */}
                <div className="grid grid-cols-2 gap-2 bg-slate-950/80 p-2 sm:p-2.5 rounded-xl border border-slate-800/80 text-xs min-w-0">
                  {/* US Date */}
                  <div className="border-r border-slate-800/80 pr-2 min-w-0">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-medium">
                      🇺🇸 US-Start
                    </span>
                    <span className="text-xs font-bold text-slate-200 font-mono-numbers block truncate mt-0.5">
                      {series.release.usDate}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {series.release.usNetwork}
                    </span>
                  </div>

                  {/* DE Date */}
                  <div className="pl-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] uppercase tracking-wider text-amber-400 font-medium">
                        🇩🇪 DE-Start
                      </span>
                      {isSimultaneous && (
                        <span className="text-[8px] bg-emerald-500/20 text-emerald-300 px-1 rounded">
                          Simultan
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-amber-300 font-mono-numbers block truncate mt-0.5">
                      {series.release.deDate}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {series.release.dePlatform}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
