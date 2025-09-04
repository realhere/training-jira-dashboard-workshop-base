'use client'

import { useState } from 'react'
import { useNotifications } from '@/hooks/use-notifications'
import { NotificationAlert } from './notification-alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Bell, 
  RefreshCw, 
  Settings, 
  AlertTriangle, 
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NotificationContainerProps {
  className?: string
}

export function NotificationContainer({ className }: NotificationContainerProps) {
  const {
    notifications,
    settings,
    loading,
    error,
    stats,
    fetchNotifications,
    checkSprintProgress,
    checkSpecificSprint,
    acknowledgeNotification,
    cleanupNotifications,
  } = useNotifications()

  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())

  const handleDismiss = (alertId: string) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]))
  }

  const handleRefresh = async () => {
    await fetchNotifications()
  }

  const handleCheckProgress = async () => {
    try {
      await checkSprintProgress()
    } catch (error) {
      console.error('Failed to check progress:', error)
    }
  }

  const handleCleanup = async () => {
    await cleanupNotifications()
    setDismissedAlerts(new Set())
  }

  const handleRecheckSprint = async (sprintName: string) => {
    try {
      await checkSpecificSprint(sprintName)
    } catch (error) {
      console.error('Failed to recheck sprint:', error)
    }
  }

  // 過濾掉已關閉的通知
  const visibleNotifications = notifications.filter(
    alert => !dismissedAlerts.has(alert.id)
  )

  const unacknowledgedCount = visibleNotifications.filter(
    alert => !alert.is_acknowledged
  ).length

  if (error) {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>預警通知</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              載入通知時發生錯誤：{error}
            </AlertDescription>
          </Alert>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            className="mt-3"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            重新載入
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>預警通知</span>
            {unacknowledgedCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unacknowledgedCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCheckProgress}
              disabled={loading}
            >
              <RefreshCw className={cn('h-4 w-4 mr-2', loading && 'animate-spin')} />
              檢查進度
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCleanup}
              disabled={loading}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* 統計資訊 */}
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span>預警: {stats.warning}</span>
          </div>
          <div className="flex items-center space-x-1">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span>危險: {stats.danger}</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span>已確認: {stats.total - unacknowledgedCount}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading && visibleNotifications.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">載入中...</span>
          </div>
        ) : visibleNotifications.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-500">目前沒有預警通知</p>
            <p className="text-sm text-gray-400 mt-1">
              所有 Sprint 進度正常
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleNotifications.map((alert) => (
              <NotificationAlert
                key={alert.id}
                alert={alert}
                onAcknowledge={acknowledgeNotification}
                onDismiss={handleDismiss}
                onRecheckSprint={handleRecheckSprint}
              />
            ))}
          </div>
        )}

        {/* 設定資訊 */}
        {settings && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <p>預警閾值: {settings.warning_threshold}% | 危險閾值: {settings.danger_threshold}%</p>
              <p>冷卻時間: {settings.cooldown_minutes} 分鐘</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
