import React, { useEffect, useState } from 'react';
import { Film, X, ChevronRight, Bell, Sparkles } from 'lucide-react';
import { AppNotification } from '../types/notifications';

interface AndroidPushBannerProps {
  notification: AppNotification | null;
  onDismiss: () => void;
  onOpenSeries: (seriesId: string) => void;
}

export const AndroidPushBanner: React.FC<AndroidPushBannerProps> = ({
  notification,
  onDismiss,
  onOpenSeries,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 300);
      }, 5500);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [notification, onDismiss]);

  if (!notification) return null;

  return (
    <div
      className={`absolute top-8 left-2 right-2 z-50 transition-all duration-300 transform ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-6 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div
        onClick={() => {
          onOpenSeries(notification.seriesId);
          onDismiss();
        }}
        className="bg-slate-900/95 border border-amber-500/40 backdrop-blur-md rounded-2xl p-3 shadow-2xl shadow-black/80 flex items-start gap-2.5 cursor-pointer hover:border-amber-400 transition-all text-slate-100 ring-1 ring-amber-400/20"
      >
        {/* App Icon */}
        <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-sm shadow-amber-400/30 mt-0.5">
          <Film className="w-4 h-4 stroke-[2.5]" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
            <span className="font-semibold text-amber-400 flex items-center gap-1">
              <span>SeriesRadar</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-300">Watchlist-Alarm</span>
            </span>
            <span className="font-mono-numbers text-[9px] text-slate-400">Jetzt</span>
          </div>

          <h4 className="text-xs font-bold text-white truncate leading-tight">
            {notification.title}
          </h4>
          <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5 leading-relaxed">
            {notification.message}
          </p>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(false);
            setTimeout(onDismiss, 200);
          }}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0"
          title="Schließen"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
