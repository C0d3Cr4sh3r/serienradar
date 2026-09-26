import React, { useState, useEffect } from 'react';
import { AndroidFrame } from './components/AndroidFrame';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { SeriesCard } from './components/SeriesCard';
import { SeriesDetailModal } from './components/SeriesDetailModal';
import { ReleaseTimelineView } from './components/ReleaseTimelineView';
import { WatchlistView } from './components/WatchlistView';
import { SourcesGuideView } from './components/SourcesGuideView';
import { AddCustomSeriesModal } from './components/AddCustomSeriesModal';
import { ScreenshotStudioModal } from './components/ScreenshotStudioModal';
import { AndroidPushBanner } from './components/AndroidPushBanner';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { INITIAL_SERIES_DATA } from './data/mockSeries';
import { SeriesItem, ProductionStage } from './types/series';
import { AppNotification, NotificationSettings } from './types/notifications';
import {
  getStoredNotifications,
  saveNotifications,
  getNotificationSettings,
  saveNotificationSettings,
  checkForSeriesUpdates,
  simulateSeriesStatusChange,
  triggerBrowserNotification,
} from './services/notificationService';
import { fetchLiveUpcomingShows } from './services/tvmazeApi';
import { Search, Film, X, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [seriesList, setSeriesList] = useState<SeriesItem[]>(() => {
    try {
      const saved = localStorage.getItem('series_radar_custom_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_SERIES_DATA;
  });

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('series_radar_bookmarks');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return ['hp-hbo', 'blade-runner-2099', 'alien-earth'];
  });

  // Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>(() => getStoredNotifications());
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => getNotificationSettings());
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [activePushNotification, setActivePushNotification] = useState<AppNotification | null>(null);

  const [currentTab, setCurrentTab] = useState<'feed' | 'timeline' | 'watchlist' | 'sources'>('feed');
  const [isMobileMode, setIsMobileMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [dataSourceFilter, setDataSourceFilter] = useState<'all' | 'verified' | 'live_api'>('all');
  const [activeModalSeries, setActiveModalSeries] = useState<SeriesItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isScreenshotModalOpen, setIsScreenshotModalOpen] = useState(false);
  
  // Live API Sync State
  const [isSyncingApi, setIsSyncingApi] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Sync bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('series_radar_bookmarks', JSON.stringify(bookmarkedIds));
    } catch {
      // Ignore
    }
  }, [bookmarkedIds]);

  // Sync custom series to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('series_radar_custom_data', JSON.stringify(seriesList));
    } catch {
      // Ignore
    }
  }, [seriesList]);

  // Sync notifications to localStorage
  useEffect(() => {
    saveNotifications(notifications);
  }, [notifications]);

  // Sync notification settings to localStorage
  useEffect(() => {
    saveNotificationSettings(notificationSettings);
  }, [notificationSettings]);

  // Automatic change detection on watched series
  useEffect(() => {
    const newAlerts = checkForSeriesUpdates(seriesList, bookmarkedIds);
    if (newAlerts.length > 0) {
      setNotifications((prev) => [...newAlerts, ...prev]);
      setActivePushNotification(newAlerts[0]);
      if (notificationSettings.browserNotifications) {
        triggerBrowserNotification(newAlerts[0].title, newAlerts[0].message);
      }
    }
  }, [seriesList, bookmarkedIds]);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddSeries = (newSeries: SeriesItem) => {
    setSeriesList((prev) => [newSeries, ...prev]);
    setActiveModalSeries(newSeries);
  };

  const handleSyncLiveApi = async () => {
    setIsSyncingApi(true);
    setSyncMessage(null);
    try {
      const liveShows = await fetchLiveUpcomingShows();
      if (liveShows.length > 0) {
        setSeriesList((prev) => {
          const existingIds = new Set(prev.map((s) => s.id));
          const newUnique = liveShows.filter((s) => !existingIds.has(s.id));
          return [...newUnique, ...prev];
        });
        setSyncMessage(`+${liveShows.length} Serien geladen!`);
      } else {
        setSyncMessage('Aktuell');
      }
    } catch {
      setSyncMessage('Offline');
    } finally {
      setIsSyncingApi(false);
      setTimeout(() => setSyncMessage(null), 3000);
    }
  };

  // Simulate a status change for a series on the watchlist
  const handleSimulateUpdate = (targetSeries?: SeriesItem) => {
    const target = targetSeries || seriesList.find((s) => bookmarkedIds.includes(s.id)) || seriesList[0];
    if (!target) return;

    // Ensure it is in watchlist
    if (!bookmarkedIds.includes(target.id)) {
      setBookmarkedIds((prev) => [...prev, target.id]);
    }

    const { updatedSeries, notification } = simulateSeriesStatusChange(target);

    // Update seriesList
    setSeriesList((prev) => prev.map((s) => (s.id === updatedSeries.id ? updatedSeries : s)));

    // Prepend notification
    setNotifications((prev) => [notification, ...prev]);

    // Show heads-up push banner
    setActivePushNotification(notification);

    // Trigger browser notification if allowed
    if (notificationSettings.browserNotifications) {
      triggerBrowserNotification(notification.title, notification.message);
    }
  };

  const handleOpenSeriesFromNotification = (seriesId: string) => {
    const found = seriesList.find((s) => s.id === seriesId);
    if (found) {
      setActiveModalSeries(found);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Filtered series for Feed
  const filteredSeries = seriesList.filter((series) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = series.title.toLowerCase().includes(q);
      const matchTag = series.tagline.toLowerCase().includes(q);
      const matchNetwork = series.release.usNetwork.toLowerCase().includes(q);
      const matchDE = series.release.dePlatform.toLowerCase().includes(q);
      const matchCreator = series.creators.some((c) => c.toLowerCase().includes(q));
      if (!matchTitle && !matchTag && !matchNetwork && !matchDE && !matchCreator) return false;
    }
    if (selectedStage !== 'all' && series.stage !== selectedStage) {
      return false;
    }
    if (dataSourceFilter === 'verified' && series.id.startsWith('tvmaze-')) {
      return false;
    }
    if (dataSourceFilter === 'live_api' && !series.id.startsWith('tvmaze-')) {
      return false;
    }
    return true;
  });

  // Summary counts
  const filmingCount = seriesList.filter((s) => s.stage === 'filming').length;
  const scheduledCount = seriesList.filter((s) => s.stage === 'scheduled').length;
  const devCount = seriesList.filter((s) => s.stage === 'development' || s.stage === 'pre_production').length;

  return (
    <AndroidFrame
      isMobileMode={isMobileMode}
      onToggleMode={setIsMobileMode}
      onOpenScreenshots={() => setIsScreenshotModalOpen(true)}
    >
      {/* Native Heads-up Push Notification Banner */}
      <AndroidPushBanner
        notification={activePushNotification}
        onDismiss={() => setActivePushNotification(null)}
        onOpenSeries={handleOpenSeriesFromNotification}
      />

      {/* Top Header Bar */}
      <TopBar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        watchlistCount={bookmarkedIds.length}
        unreadNotificationsCount={unreadCount}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenNotifications={() => setIsNotificationCenterOpen(true)}
        isMobile={isMobileMode}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 p-3 sm:p-5 space-y-3.5 w-full min-w-0 overflow-x-hidden">
        {/* TAB 1: FEED / RADAR */}
        {currentTab === 'feed' && (
          <div className="space-y-3.5 w-full min-w-0">
            {/* Hero / Quick Status Banner */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-[#0c1220] border border-slate-800 rounded-2xl p-3.5 sm:p-5 shadow-sm min-w-0">
              <div className="flex items-center justify-between text-xs text-amber-400 font-semibold uppercase tracking-wider mb-1 min-w-0">
                <span className="flex items-center gap-1.5 truncate">
                  <Film className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Produktions-Radar</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal shrink-0">2025/2026/2027</span>
              </div>

              <h1 className="text-base sm:text-xl font-bold text-white tracking-tight leading-tight">
                Serien in Planung & Release
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-1 leading-relaxed">
                Produktionsstände am Set, US-Premieren und deutsche Starttermine im Vergleich.
              </p>

              {/* Status summary 4-column micro grid (Never overflows on mobile) */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 grid grid-cols-4 gap-1.5 text-center">
                <div className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800/60">
                  <div className="text-slate-200 font-bold font-mono-numbers text-xs sm:text-sm">
                    {seriesList.length}
                  </div>
                  <div className="text-[9px] text-slate-400 truncate">Gesamt</div>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800/60">
                  <div className="text-rose-400 font-bold font-mono-numbers text-xs sm:text-sm">
                    {filmingCount}
                  </div>
                  <div className="text-[9px] text-slate-400 truncate">Im Dreh</div>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800/60">
                  <div className="text-amber-400 font-bold font-mono-numbers text-xs sm:text-sm">
                    {devCount}
                  </div>
                  <div className="text-[9px] text-slate-400 truncate">In Planung</div>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800/60">
                  <div className="text-emerald-400 font-bold font-mono-numbers text-xs sm:text-sm">
                    {scheduledCount}
                  </div>
                  <div className="text-[9px] text-slate-400 truncate">Start fix</div>
                </div>
              </div>

              {/* Live API Action Button */}
              <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between gap-2 min-w-0">
                <button
                  onClick={handleSyncLiveApi}
                  disabled={isSyncingApi}
                  className="px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-[11px] font-medium flex items-center gap-1.5 transition-colors truncate"
                >
                  <RefreshCw className={`w-3 h-3 shrink-0 ${isSyncingApi ? 'animate-spin' : ''}`} />
                  <span className="truncate">{isSyncingApi ? 'Lade Daten...' : 'Live TVMaze Sync'}</span>
                </button>

                {syncMessage && (
                  <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 truncate shrink-0">
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    <span className="truncate">{syncMessage}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Search & Filter Section */}
            <div className="space-y-2 w-full min-w-0">
              {/* Search Bar */}
              <div className="relative w-full">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Serie oder Sender suchen..."
                  className="w-full bg-slate-900/80 border border-slate-800/90 rounded-xl pl-8 pr-8 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-colors shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Stage Filter (Clean Horizontal Scroll) */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-xs w-full">
                {[
                  { id: 'all', label: 'Alle' },
                  { id: 'development', label: 'In Entwicklung' },
                  { id: 'pre_production', label: 'Casting & Pre' },
                  { id: 'filming', label: 'Im Dreh' },
                  { id: 'post_production', label: 'Post-Produktion' },
                  { id: 'scheduled', label: 'Start fix' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setSelectedStage(st.id)}
                    className={`px-2.5 py-1 rounded-lg whitespace-nowrap text-[11px] font-medium transition-colors shrink-0 ${
                      selectedStage === st.id
                        ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                        : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* Source Filter (Neat segmented pill bar) */}
              <div className="grid grid-cols-3 gap-1 p-0.5 bg-slate-950 rounded-xl border border-slate-800 text-center text-xs">
                <button
                  onClick={() => setDataSourceFilter('all')}
                  className={`py-1 text-[11px] rounded-lg font-medium transition-colors truncate ${
                    dataSourceFilter === 'all' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400'
                  }`}
                >
                  Alle Quellen
                </button>
                <button
                  onClick={() => setDataSourceFilter('verified')}
                  className={`py-1 text-[11px] rounded-lg font-medium transition-colors truncate ${
                    dataSourceFilter === 'verified' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400'
                  }`}
                >
                  Redaktionell
                </button>
                <button
                  onClick={() => setDataSourceFilter('live_api')}
                  className={`py-1 text-[11px] rounded-lg font-medium transition-colors truncate ${
                    dataSourceFilter === 'live_api' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-400'
                  }`}
                >
                  TVMaze Live
                </button>
              </div>
            </div>

            {/* Series Cards Grid */}
            {filteredSeries.length === 0 ? (
              <div className="text-center py-10 bg-slate-900/40 rounded-2xl border border-slate-800/80 p-4">
                <p className="text-slate-400 text-xs">Keine Serien für diese Filter gefunden.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedStage('all');
                    setDataSourceFilter('all');
                  }}
                  className="mt-2.5 px-3 py-1 text-xs text-amber-400 border border-amber-500/30 rounded-lg"
                >
                  Filter zurücksetzen
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full min-w-0">
                {filteredSeries.map((series) => (
                  <SeriesCard
                    key={series.id}
                    series={series}
                    isBookmarked={bookmarkedIds.includes(series.id)}
                    onToggleBookmark={toggleBookmark}
                    onOpenDetails={(s) => setActiveModalSeries(s)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: RELEASE TIMELINE / CALENDAR */}
        {currentTab === 'timeline' && (
          <ReleaseTimelineView
            seriesList={seriesList}
            onSelectSeries={(s) => setActiveModalSeries(s)}
            onToggleBookmark={toggleBookmark}
            bookmarks={bookmarkedIds}
          />
        )}

        {/* TAB 3: WATCHLIST */}
        {currentTab === 'watchlist' && (
          <WatchlistView
            seriesList={seriesList}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={toggleBookmark}
            onSelectSeries={(s) => setActiveModalSeries(s)}
            onExploreMore={() => setCurrentTab('feed')}
            onOpenNotifications={() => setIsNotificationCenterOpen(true)}
            onSimulateUpdate={handleSimulateUpdate}
          />
        )}

        {/* TAB 4: SOURCES & ARCHITECTURE GUIDE */}
        {currentTab === 'sources' && (
          <SourcesGuideView />
        )}
      </main>

      {/* Detail Inspector Modal */}
      <SeriesDetailModal
        series={activeModalSeries}
        onClose={() => setActiveModalSeries(null)}
        isBookmarked={activeModalSeries ? bookmarkedIds.includes(activeModalSeries.id) : false}
        onToggleBookmark={toggleBookmark}
      />

      {/* Add Custom Series Modal */}
      <AddCustomSeriesModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSeries={handleAddSeries}
      />

      {/* Screenshot Studio Modal */}
      <ScreenshotStudioModal
        isOpen={isScreenshotModalOpen}
        onClose={() => setIsScreenshotModalOpen(false)}
      />

      {/* Notification Center Modal */}
      <NotificationCenterModal
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        notifications={notifications}
        settings={notificationSettings}
        onUpdateSettings={setNotificationSettings}
        onMarkAllAsRead={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
        onClearAll={() => setNotifications([])}
        onSelectSeries={handleOpenSeriesFromNotification}
        onSimulateUpdate={() => handleSimulateUpdate()}
      />

      {/* Mobile Fixed Bottom Navigation */}
      {isMobileMode && (
        <BottomNav
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          watchlistCount={bookmarkedIds.length}
        />
      )}
    </AndroidFrame>
  );
}
