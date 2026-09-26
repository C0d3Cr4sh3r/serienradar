import React, { useState } from 'react';
import { X, Bell, Check, Trash2, Settings, Film, Clock, Sparkles, AlertCircle, Volume2, Shield } from 'lucide-react';
import { AppNotification, NotificationSettings } from '../types/notifications';
import { requestBrowserNotificationPermission } from '../services/notificationService';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  settings: NotificationSettings;
  onUpdateSettings: (newSettings: NotificationSettings) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onSelectSeries: (seriesId: string) => void;
  onSimulateUpdate: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  notifications,
  settings,
  onUpdateSettings,
  onMarkAllAsRead,
  onClearAll,
  onSelectSeries,
  onSimulateUpdate,
}) => {
  const [activeTab, setActiveTab] = useState<'inbox' | 'settings'>('inbox');
  const [browserPermissionStatus, setBrowserPermissionStatus] = useState<string>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleToggleBrowserNotifications = async () => {
    if (!settings.browserNotifications) {
      const granted = await requestBrowserNotificationPermission();
      if (typeof window !== 'undefined' && 'Notification' in window) {
        setBrowserPermissionStatus(Notification.permission);
      }
      onUpdateSettings({ ...settings, browserNotifications: granted });
    } else {
      onUpdateSettings({ ...settings, browserNotifications: false });
    }
  };

  const formatTimestamp = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return 'Gerade eben';
    if (mins < 60) return `vor ${mins} Min.`;
    if (hours < 24) return `vor ${hours} Std.`;
    return `vor ${days} Tag(en)`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-hidden"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#090d16] border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden text-slate-100 min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0 bg-[#0c111d]">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 font-bold shadow-sm">
              <Bell className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-white leading-tight truncate">
                Benachrichtigungen & Alarme
              </h3>
              <p className="text-[11px] text-slate-400 truncate">
                Status-Updates deiner Watchlist-Serien
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-4 pt-2 pb-1 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/60 shrink-0 text-xs">
          <div className="flex items-center gap-1 p-0.5 bg-slate-900 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('inbox')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors flex items-center gap-1.5 text-[11px] ${
                activeTab === 'inbox'
                  ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Eingang</span>
              {unreadCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 bg-rose-500 text-white rounded-full font-mono-numbers">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 text-[11px] ${
                activeTab === 'settings'
                  ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Settings className="w-3 h-3" />
              <span>Einstellungen</span>
            </button>
          </div>

          {activeTab === 'inbox' && notifications.length > 0 && (
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className="text-[10px] text-amber-400 hover:text-amber-300 font-medium"
                >
                  Alle gelesen
                </button>
              )}
              <button
                onClick={onClearAll}
                className="text-[10px] text-slate-500 hover:text-rose-400 transition-colors"
                title="Alle löschen"
              >
                Leeren
              </button>
            </div>
          )}
        </div>

        {/* Content: INBOX */}
        {activeTab === 'inbox' && (
          <div className="flex-1 overflow-y-auto p-3 space-y-2 min-w-0">
            {notifications.length === 0 ? (
              <div className="text-center py-10 px-4 space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-slate-800/80 text-slate-500 flex items-center justify-center mx-auto">
                  <Bell className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-slate-300">Keine neuen Meldungen</h4>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  Sobald eine Serie auf deiner Merkliste die Drehphase wechselt oder ein Starttermin bestätigt wird, erscheint hier ein Alarm.
                </p>
                <div className="pt-2">
                  <button
                    onClick={onSimulateUpdate}
                    className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs inline-flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Status-Änderung jetzt testen</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectSeries(item.seriesId);
                      onClose();
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer relative ${
                      item.read
                        ? 'bg-slate-950/60 border-slate-800/70 hover:border-slate-700'
                        : 'bg-slate-900/90 border-amber-500/40 hover:border-amber-400 ring-1 ring-amber-400/20 shadow-md'
                    }`}
                  >
                    {/* Unread dot */}
                    {!item.read && (
                      <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    )}

                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 pr-3">
                      <span className="font-semibold text-amber-400 flex items-center gap-1 truncate">
                        <Film className="w-3 h-3 shrink-0" />
                        <span className="truncate">{item.seriesTitle}</span>
                      </span>
                      <span className="font-mono-numbers shrink-0">{formatTimestamp(item.timestamp)}</span>
                    </div>

                    <h4 className="text-xs font-bold text-white leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                      {item.message}
                    </p>

                    {item.oldValue && item.newValue && (
                      <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-[10px]">
                        <span className="text-slate-500 line-through truncate max-w-[120px]">{item.oldValue}</span>
                        <span className="text-slate-500">➔</span>
                        <span className="text-emerald-400 font-semibold truncate max-w-[150px]">{item.newValue}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Content: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs min-w-0">
            {/* Master Toggle */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <span className="font-bold text-white block text-xs">Lokale Benachrichtigungen</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Erinnert dich bei Änderungen an Serien in deiner Watchlist
                </span>
              </div>
              <button
                onClick={() => onUpdateSettings({ ...settings, enabled: !settings.enabled })}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
                  settings.enabled ? 'bg-amber-400' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                    settings.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Sub-settings */}
            <div className="space-y-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block px-1">
                Ereignis-Filter:
              </span>

              <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
                <div>
                  <span className="font-medium text-slate-200 block text-xs">Produktionsstufen am Set</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    z.B. Wechsel von Casting zu Dreharbeiten oder Post-Produktion
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifyOnStageChange}
                  onChange={(e) => onUpdateSettings({ ...settings, notifyOnStageChange: e.target.checked })}
                  className="w-4 h-4 accent-amber-400 rounded cursor-pointer shrink-0"
                />
              </div>

              <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
                <div>
                  <span className="font-medium text-slate-200 block text-xs">Starttermin-Ankündigungen</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Neue US- oder deutsche Ausstrahlungstermine (Sky/WOW, Netflix, etc.)
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifyOnReleaseDate}
                  onChange={(e) => onUpdateSettings({ ...settings, notifyOnReleaseDate: e.target.checked })}
                  className="w-4 h-4 accent-amber-400 rounded cursor-pointer shrink-0"
                />
              </div>

              <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
                <div>
                  <span className="font-medium text-slate-200 block text-xs">Browser Web-Push Erlaubnis</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Status: {browserPermissionStatus === 'granted' ? 'Erlaubt (Aktiv)' : 'Nicht erlaubt oder blockiert'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleToggleBrowserNotifications}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-colors shrink-0 ${
                    settings.browserNotifications && browserPermissionStatus === 'granted'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  {settings.browserNotifications ? 'Aktiviert' : 'Aktivieren'}
                </button>
              </div>
            </div>

            {/* Test Simulation Button */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-2">
              <span className="font-bold text-amber-300 block text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Benachrichtigungs-System testen:</span>
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Klicke auf den Button, um eine Status-Änderung einer Serie auf deiner Merkliste auszulösen. Du siehst sofort den Heads-Up Android Push-Banner!
              </p>
              <button
                onClick={onSimulateUpdate}
                className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Jetzt Status-Änderung simulieren</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-slate-800 bg-[#0c111d] flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span className="text-[10px]">Lokal im Browser gespeichert (kein Server-Tracking)</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
