export interface AppNotification {
  id: string;
  seriesId: string;
  seriesTitle: string;
  type: 'stage_change' | 'release_date' | 'progress_update' | 'custom_update';
  title: string;
  message: string;
  oldValue?: string;
  newValue?: string;
  timestamp: number;
  read: boolean;
}

export interface NotificationSettings {
  enabled: boolean;
  notifyOnStageChange: boolean;
  notifyOnReleaseDate: boolean;
  browserNotifications: boolean;
}
