import React from 'react';
import { Plus, Bell } from 'lucide-react';

interface TopBarProps {
  currentTab: 'feed' | 'timeline' | 'watchlist' | 'sources';
  onSelectTab: (tab: 'feed' | 'timeline' | 'watchlist' | 'sources') => void;
  watchlistCount: number;
  unreadNotificationsCount: number;
  onOpenAddModal: () => void;
  onOpenNotifications: () => void;
  isMobile: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  onSelectTab,
  watchlistCount,
  unreadNotificationsCount,
  onOpenAddModal,
  onOpenNotifications,
  isMobile,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-[#090d16]/95 backdrop-blur-md border-b border-slate-800/80 px-3.5 sm:px-4 py-2.5 flex items-center justify-between shrink-0">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center min-w-0">
        <button
          onClick={() => onSelectTab('feed')}
          className="text-left group flex items-center gap-1.5 focus:outline-none"
        >
          <span className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">
            SeriesRadar
          </span>
        </button>
      </div>

      {/* Zone 2: Navigation links (Desktop view only, on mobile handled by thumb BottomNav) */}
      {!isMobile && (
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => onSelectTab('feed')}
            className={`whitespace-nowrap transition-colors hover:text-slate-100 ${
              currentTab === 'feed' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Serien in Planung
          </button>
          <button
            onClick={() => onSelectTab('timeline')}
            className={`whitespace-nowrap transition-colors hover:text-slate-100 ${
              currentTab === 'timeline' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Release-Kalender
          </button>
          <button
            onClick={() => onSelectTab('watchlist')}
            className={`whitespace-nowrap transition-colors hover:text-slate-100 flex items-center gap-1.5 ${
              currentTab === 'watchlist' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            <span>Merkliste</span>
            {watchlistCount > 0 && (
              <span className="text-xs px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded font-mono-numbers">
                {watchlistCount}
              </span>
            )}
          </button>
          <button
            onClick={() => onSelectTab('sources')}
            className={`whitespace-nowrap transition-colors hover:text-slate-100 ${
              currentTab === 'sources' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Quellen & API-Guide
          </button>
        </nav>
      )}

      {/* Zone 3: Notification Bell & Action buttons */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Bell Button */}
        <button
          type="button"
          onClick={onOpenNotifications}
          className="relative min-h-[36px] min-w-[36px] p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors flex items-center justify-center"
          title="Benachrichtigungen & Watchlist-Alarme"
          aria-label="Benachrichtigungen öffnen"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold font-mono-numbers flex items-center justify-center ring-2 ring-[#090d16] animate-pulse">
              {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* Add Series Button */}
        <button
          onClick={onOpenAddModal}
          className="min-h-[36px] px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] rounded-xl transition-all flex items-center gap-1 whitespace-nowrap shadow-sm shadow-amber-950/40"
          title="Neue Serie zur Beobachtung hinzufügen"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Serie tracken</span>
        </button>
      </div>
    </header>
  );
};
