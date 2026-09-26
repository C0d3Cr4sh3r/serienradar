import { AppNotification, NotificationSettings } from '../types/notifications';
import { SeriesItem, ProductionStage } from '../types/series';
import { STAGE_CONFIG } from '../data/mockSeries';

const STORAGE_KEY_NOTIFICATIONS = 'series_radar_notifications';
const STORAGE_KEY_SETTINGS = 'series_radar_notification_settings';
const STORAGE_KEY_SNAPSHOTS = 'series_radar_series_snapshots';

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: true,
  notifyOnStageChange: true,
  notifyOnReleaseDate: true,
  browserNotifications: false,
};

// Load saved notifications
export function getStoredNotifications(): AppNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return [
    {
      id: 'notif-welcome',
      seriesId: 'knight-seven-kingdoms',
      seriesTitle: 'A Knight of the Seven Kingdoms',
      type: 'stage_change',
      title: 'Status-Update am Set',
      message: 'Dreharbeiten in Belfast abgeschlossen. Die Serie befindet sich jetzt in der Post-Produktion.',
      oldValue: 'Dreharbeiten laufen',
      newValue: 'Post-Produktion',
      timestamp: Date.now() - 3600 * 1000 * 4,
      read: false,
    },
    {
      id: 'notif-date',
      seriesId: 'alien-earth',
      seriesTitle: 'Alien: Earth',
      type: 'release_date',
      title: 'Starttermin bestätigt',
      message: 'Offizieller Veröffentlichungstermin auf August 2025 (Disney+ Star) terminiert.',
      oldValue: 'Sommer 2025',
      newValue: 'August 2025',
      timestamp: Date.now() - 3600 * 1000 * 24,
      read: true,
    }
  ];
}

// Save notifications
export function saveNotifications(notifications: AppNotification[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(notifications));
  } catch {
    // ignore
  }
}

// Load notification settings
export function getNotificationSettings(): NotificationSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return DEFAULT_NOTIFICATION_SETTINGS;
}

// Save notification settings
export function saveNotificationSettings(settings: NotificationSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

// Request Browser Web Notification Permission
export async function requestBrowserNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
}

// Trigger a browser notification if permitted
export function triggerBrowserNotification(title: string, body: string): void {
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
      });
    } catch {
      // Fallback for some mobile browsers
    }
  }
}

// Snapshot interface for comparison
interface SeriesSnapshot {
  stage: ProductionStage;
  stageProgress: number;
  stageDetail: string;
  usDate: string;
  deDate: string;
}

// Check for status changes on watched series
export function checkForSeriesUpdates(
  seriesList: SeriesItem[],
  bookmarkedIds: string[]
): AppNotification[] {
  const settings = getNotificationSettings();
  if (!settings.enabled) return [];

  let snapshots: Record<string, SeriesSnapshot> = {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SNAPSHOTS);
    if (raw) snapshots = JSON.parse(raw);
  } catch {
    snapshots = {};
  }

  const newNotifications: AppNotification[] = [];
  const updatedSnapshots: Record<string, SeriesSnapshot> = { ...snapshots };

  // Only check series that are on the watchlist
  for (const series of seriesList) {
    if (!bookmarkedIds.includes(series.id)) {
      continue;
    }

    const prev = snapshots[series.id];
    if (prev) {
      // 1. Stage Change
      if (settings.notifyOnStageChange && prev.stage !== series.stage) {
        const oldLabel = STAGE_CONFIG[prev.stage]?.label || prev.stage;
        const newLabel = STAGE_CONFIG[series.stage]?.label || series.stage;

        newNotifications.push({
          id: `stage-${series.id}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          seriesId: series.id,
          seriesTitle: series.title,
          type: 'stage_change',
          title: `Status-Änderung: ${series.title}`,
          message: `Neuer Produktionsstatus: von "${oldLabel}" zu "${newLabel}" gewechselt.`,
          oldValue: oldLabel,
          newValue: newLabel,
          timestamp: Date.now(),
          read: false,
        });
      }

      // 2. Release Date Change
      if (settings.notifyOnReleaseDate && (prev.usDate !== series.release.usDate || prev.deDate !== series.release.deDate)) {
        newNotifications.push({
          id: `date-${series.id}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          seriesId: series.id,
          seriesTitle: series.title,
          type: 'release_date',
          title: `Termin-Update: ${series.title}`,
          message: `Neuer Starttermin: 🇺🇸 ${series.release.usDate} | 🇩🇪 ${series.release.deDate}`,
          oldValue: prev.deDate,
          newValue: series.release.deDate,
          timestamp: Date.now(),
          read: false,
        });
      }
    }

    // Update snapshot for this watched series
    updatedSnapshots[series.id] = {
      stage: series.stage,
      stageProgress: series.stageProgress,
      stageDetail: series.stageDetail,
      usDate: series.release.usDate,
      deDate: series.release.deDate,
    };
  }

  // Save updated snapshots
  try {
    localStorage.setItem(STORAGE_KEY_SNAPSHOTS, JSON.stringify(updatedSnapshots));
  } catch {
    // ignore
  }

  return newNotifications;
}

// Simulate a realistic status update for testing notifications
export function simulateSeriesStatusChange(
  series: SeriesItem
): { updatedSeries: SeriesItem; notification: AppNotification } {
  const stages: ProductionStage[] = ['development', 'pre_production', 'filming', 'post_production', 'scheduled'];
  const currentIndex = stages.indexOf(series.stage);
  const nextIndex = (currentIndex + 1) % stages.length;
  const nextStage = stages[nextIndex];

  const oldLabel = STAGE_CONFIG[series.stage]?.label || series.stage;
  const newLabel = STAGE_CONFIG[nextStage]?.label || nextStage;

  const progressMap: Record<ProductionStage, number> = {
    development: 25,
    pre_production: 40,
    filming: 65,
    post_production: 85,
    scheduled: 95,
  };

  const detailMap: Record<ProductionStage, string> = {
    development: 'Writers Room arbeitet an neuen Skripten und Storyboards.',
    pre_production: 'Regisseure und Hauptdarsteller wurden offiziell unter Vertrag genommen.',
    filming: 'Kameras rollen aktuell am Hauptdrehort!',
    post_production: 'Dreharbeiten erfolgreich beendet. Aktuell im Videoschnitt und Sounddesign.',
    scheduled: 'Offizieller Startmonat von Studio & Sender bestätigt!',
  };

  const updatedSeries: SeriesItem = {
    ...series,
    stage: nextStage,
    stageProgress: progressMap[nextStage],
    stageDetail: detailMap[nextStage],
  };

  const notification: AppNotification = {
    id: `sim-${Date.now()}`,
    seriesId: series.id,
    seriesTitle: series.title,
    type: 'stage_change',
    title: `Status-Änderung: ${series.title}`,
    message: `Die Serie ist vorangeschritten: von "${oldLabel}" auf "${newLabel}" (${progressMap[nextStage]}%).`,
    oldValue: oldLabel,
    newValue: newLabel,
    timestamp: Date.now(),
    read: false,
  };

  return { updatedSeries, notification };
}
