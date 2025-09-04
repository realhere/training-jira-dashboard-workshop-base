// Notification Types for US-003: 風險預警功能

export interface NotificationAlert {
  id: string
  sprint_name: string
  alert_type: 'warning' | 'danger'
  title: string
  message: string
  current_completion_rate: number
  ideal_completion_rate: number
  lag_percentage: number
  suggested_actions: string[]
  created_at: string
  is_acknowledged: boolean
  acknowledged_at?: string
}

export interface NotificationSettings {
  warning_threshold: number
  danger_threshold: number
  email_notifications: boolean
  dashboard_notifications: boolean
  cooldown_minutes: number
}

export interface NotificationResponse {
  alerts: NotificationAlert[]
  settings: NotificationSettings
  last_checked: string
}

export interface AcknowledgeNotificationRequest {
  alert_id: string
}

export interface UpdateNotificationSettingsRequest {
  warning_threshold?: number
  danger_threshold?: number
  email_notifications?: boolean
  dashboard_notifications?: boolean
  cooldown_minutes?: number
}

export interface NotificationCheckResponse {
  alerts_created: number
  alerts: NotificationAlert[]
}
