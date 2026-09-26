import React, { useState } from 'react';
import { X, Plus, Film, Search, Globe, RefreshCw, ArrowRight } from 'lucide-react';
import { SeriesItem, ProductionStage } from '../types/series';
import { searchTvMazeLive } from '../services/tvmazeApi';

interface AddCustomSeriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSeries: (newSeries: SeriesItem) => void;
}

export const AddCustomSeriesModal: React.FC<AddCustomSeriesModalProps> = ({
  isOpen,
  onClose,
  onAddSeries,
}) => {
  const [activeTab, setActiveTab] = useState<'api_search' | 'manual'>('api_search');

  // Live API Search State
  const [apiQuery, setApiQuery] = useState('');
  const [apiLoading, setApiLoading] = useState(false);
  const [apiResults, setApiResults] = useState<SeriesItem[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  // Manual Form State
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [usNetwork, setUsNetwork] = useState('HBO / Max');
  const [dePlatform, setDePlatform] = useState('WOW / Sky');
  const [usDate, setUsDate] = useState('Herbst 2026');
  const [deDate, setDeDate] = useState('Zeitgleich in DE');
  const [stage, setStage] = useState<ProductionStage>('development');
  const [stageProgress, setStageProgress] = useState(25);
  const [stageDetail, setStageDetail] = useState('In Entwicklung, Writers Room aktiv');
  const [genre, setGenre] = useState('Sci-Fi');

  if (!isOpen) return null;

  const handleApiSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!apiQuery.trim()) return;

    setApiLoading(true);
    setApiError(null);
    try {
      const results = await searchTvMazeLive(apiQuery);
      setApiResults(results);
      if (results.length === 0) {
        setApiError('Keine Serien in der TVMaze-Datenbank gefunden.');
      }
    } catch (err: any) {
      setApiError(err?.message || 'Fehler beim Verbinden mit der TVMaze API.');
    } finally {
      setApiLoading(false);
    }
  };

  const handleImportApiShow = (item: SeriesItem) => {
    onAddSeries(item);
    onClose();
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newSeries: SeriesItem = {
      id: `manual-${Date.now()}`,
      title: title.trim(),
      tagline: tagline.trim() || 'Neu angekündigte Serie in Vorbereitung',
      synopsis: 'Manuell hinzugefügte Serie zur Beobachtung von Dreharbeiten und Veröffentlichungsterminen.',
      stage,
      stageProgress,
      stageDetail: stageDetail.trim(),
      genres: [genre, 'Drama'],
      creators: ['Wird noch bekanntgegeben'],
      cast: ['Casting läuft'],
      release: {
        usDate: usDate.trim(),
        usNetwork: usNetwork.trim(),
        deDate: deDate.trim(),
        dePlatform: dePlatform.trim(),
        deStatus: 'simultaneous',
      },
      source: {
        name: 'Benutzer-Eintrag / Branchen-News',
        verifiedDate: 'Echtzeit-Eintrag',
        reliability: 'In Verhandlung',
      },
      bannerColor: 'from-amber-950 via-slate-900 to-black',
    };

    onAddSeries(newSeries);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-hidden"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#0c111d] border border-slate-800 rounded-2xl shadow-2xl p-4 sm:p-5 text-slate-100 space-y-3.5 max-h-[88vh] flex flex-col min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800 shrink-0">
          <div className="min-w-0 pr-2">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5 truncate">
              <Film className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="truncate">Serie tracken</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">
              Live importieren oder manuell anlegen
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch (Compact labels) */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 shrink-0 text-xs">
          <button
            onClick={() => setActiveTab('api_search')}
            className={`flex-1 py-1.5 font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 truncate ${
              activeTab === 'api_search'
                ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">TVMaze Live</span>
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-1.5 font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 truncate ${
              activeTab === 'manual'
                ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Manuell</span>
          </button>
        </div>

        {/* Tab Content 1: Live API Search */}
        {activeTab === 'api_search' && (
          <div className="flex-1 overflow-y-auto space-y-2.5 text-xs pr-0.5 min-w-0">
            <form onSubmit={handleApiSearch} className="flex gap-1.5">
              <div className="relative flex-1 min-w-0">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={apiQuery}
                  onChange={(e) => setApiQuery(e.target.value)}
                  placeholder="Serie suchen (z.B. Severance)..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-2.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
              <button
                type="submit"
                disabled={apiLoading}
                className="px-3 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold rounded-xl flex items-center gap-1 shrink-0 disabled:opacity-50"
              >
                {apiLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>Suchen</span>
              </button>
            </form>

            {apiError && (
              <div className="p-2.5 bg-rose-950/30 border border-rose-500/30 text-rose-300 rounded-xl text-[11px]">
                {apiError}
              </div>
            )}

            {apiResults.length > 0 ? (
              <div className="space-y-1.5">
                <span className="text-slate-400 block text-[10px] font-mono-numbers">
                  Treffer (Klicke zum Importieren):
                </span>
                {apiResults.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-2 min-w-0"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-white text-xs truncate">{item.title}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                        <span className="truncate">{item.release.usNetwork}</span>
                        <span>·</span>
                        <span className="text-amber-400 truncate">{item.release.usDate}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleImportApiShow(item)}
                      className="px-2.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold rounded-lg shrink-0 flex items-center gap-1 text-[11px] transition-all"
                    >
                      <span>Import</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500 text-[11px]">
                Gib einen Namen ein, um Serien live aus TVMaze zu suchen.
              </div>
            )}
          </div>
        )}

        {/* Tab Content 2: Manual Form */}
        {activeTab === 'manual' && (
          <form onSubmit={handleManualSubmit} className="flex-1 overflow-y-auto space-y-2.5 text-xs pr-0.5 min-w-0">
            <div>
              <label className="block text-slate-400 mb-0.5 text-[11px] font-medium">Serientitel:</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="z.B. Mass Effect..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-0.5 text-[11px] font-medium">Kurzbeschreibung:</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="z.B. Neuankündigung..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 mb-0.5 text-[11px] font-medium">Status:</label>
                <select
                  value={stage}
                  onChange={(e) => {
                    const val = e.target.value as ProductionStage;
                    setStage(val);
                    if (val === 'development') setStageProgress(20);
                    if (val === 'pre_production') setStageProgress(40);
                    if (val === 'filming') setStageProgress(65);
                    if (val === 'post_production') setStageProgress(85);
                    if (val === 'scheduled') setStageProgress(95);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                >
                  <option value="development">In Entwicklung</option>
                  <option value="pre_production">Casting / Pre</option>
                  <option value="filming">Dreharbeiten</option>
                  <option value="post_production">Post-Produktion</option>
                  <option value="scheduled">Starttermin fix</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-0.5 text-[11px] font-medium">Genre:</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                >
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="Drama">Drama</option>
                  <option value="Action">Action</option>
                  <option value="Krimi">Krimi</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 mb-0.5 text-[11px] font-medium">🇺🇸 US-Start:</label>
                <input
                  type="text"
                  value={usDate}
                  onChange={(e) => setUsDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-0.5 text-[11px] font-medium">🇩🇪 DE-Start:</label>
                <input
                  type="text"
                  value={deDate}
                  onChange={(e) => setDeDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl text-xs"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-amber-400 text-slate-950 font-semibold rounded-xl text-xs"
              >
                Speichern
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
