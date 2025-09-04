import { useState, useEffect, useCallback } from 'react'
import { 
  NotificationAlert, 
  NotificationResponse, 
  NotificationSettings,
  AcknowledgeNotificationRequest,
  UpdateNotificationSettingsRequest,
  NotificationCheckResponse
} from '@/types/notification'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationAlert[]>([])
  const [settings, setSettings] = useState<NotificationSettings | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  // 取得所有通知
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`${API_BASE_URL}/api/notifications`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: NotificationResponse = await response.json()
      setNotifications(data.alerts)
      setSettings(data.settings)
      setLastChecked(new Date(data.last_checked))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications')
      console.error('Error fetching notifications:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // 檢查 Sprint 進度並生成新通知
  const checkSprintProgress = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`${API_BASE_URL}/api/notifications/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: NotificationCheckResponse = await response.json()
      
      // 重新取得所有通知以包含新產生的通知
      await fetchNotifications()
      
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check sprint progress')
      console.error('Error checking sprint progress:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchNotifications])

  // 檢查特定 Sprint 的進度（用於重新檢查已確認的預警）
  const checkSpecificSprint = useCallback(async (sprintName: string) => {
    try {
      setError(null)
      
      const response = await fetch(`${API_BASE_URL}/api/notifications/check-sprint/${encodeURIComponent(sprintName)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: NotificationCheckResponse = await response.json()
      
      // 重新取得所有通知以包含新產生的通知
      await fetchNotifications()
      
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check specific sprint progress')
      console.error('Error checking specific sprint progress:', err)
      throw err
    }
  }, [fetchNotifications])

  // 確認通知
  const acknowledgeNotification = useCallback(async (alertId: string) => {
    try {
      setError(null)
      
      const request: AcknowledgeNotificationRequest = { alert_id: alertId }
      
      const response = await fetch(`${API_BASE_URL}/api/notifications/acknowledge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      // 更新本地狀態
      setNotifications(prev => 
        prev.map(alert => 
          alert.id === alertId 
            ? { ...alert, is_acknowledged: true, acknowledged_at: new Date().toISOString() }
            : alert
        )
      )
      
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to acknowledge notification')
      console.error('Error acknowledging notification:', err)
      return false
    }
  }, [])

  // 更新通知設定
  const updateSettings = useCallback(async (newSettings: UpdateNotificationSettingsRequest) => {
    try {
      setError(null)
      
      const response = await fetch(`${API_BASE_URL}/api/notifications/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      // 重新取得設定
      await fetchNotifications()
      
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings')
      console.error('Error updating settings:', err)
      return false
    }
  }, [fetchNotifications])

  // 清理已確認的通知
  const cleanupNotifications = useCallback(async () => {
    try {
      setError(null)
      
      const response = await fetch(`${API_BASE_URL}/api/notifications/cleanup`, {
        method: 'POST',
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      // 重新取得通知
      await fetchNotifications()
      
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cleanup notifications')
      console.error('Error cleaning up notifications:', err)
      return false
    }
  }, [fetchNotifications])

  // 自動重新整理通知
  useEffect(() => {
    fetchNotifications()
    
    // 每 5 分鐘檢查一次
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [fetchNotifications])

  // 計算統計資料
  const stats = {
    total: notifications.length,
    unacknowledged: notifications.filter(alert => !alert.is_acknowledged).length,
    warning: notifications.filter(alert => alert.alert_type === 'warning').length,
    danger: notifications.filter(alert => alert.alert_type === 'danger').length,
  }

  return {
    notifications,
    settings,
    loading,
    error,
    lastChecked,
    stats,
    fetchNotifications,
    checkSprintProgress,
    checkSpecificSprint,
    acknowledgeNotification,
    updateSettings,
    cleanupNotifications,
  }
}
