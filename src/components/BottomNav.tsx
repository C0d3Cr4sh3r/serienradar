import React from 'react';
import { Compass, Calendar, Bookmark, Database } from 'lucide-react';

interface BottomNavProps {
  currentTab: 'feed' | 'timeline' | 'watchlist' | 'sources';
  onSelectTab: (tab: 'feed' | 'timeline' | 'watchlist' | 'sources') => void;
  watchlistCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  watchlistCount,
}) => {
  const tabs = [
    { id: 'feed' as const, label: 'Serien', icon: Compass },
    { id: 'timeline' as const, label: 'Kalender', icon: Calendar },
    { id: 'watchlist' as const, label: 'Merkliste', icon: Bookmark, badge: watchlistCount },
    { id: 'sources' as const, label: 'Quellen', icon: Database },
  ];

  return (
    <nav className="sticky bottom-0 left-0 right-0 z-40 bg-[#090d16]/95 backdrop-blur-md border-t border-slate-800/90 shrink-0">
      <div className="grid grid-cols-4 items-center h-16 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`min-h-[48px] min-w-[48px] flex flex-col items-center justify-center relative py-1 rounded-lg transition-colors ${
                isActive ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 min-w-[16px] h-4 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center px-1 font-mono-numbers">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span className={`text-[10px] font-medium tracking-tight mt-1 ${isActive ? 'font-semibold' : ''}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 bg-amber-400 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
