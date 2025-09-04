'use client'

import { useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  AlertTriangle, 
  AlertCircle, 
  Check, 
  X, 
  ChevronDown, 
  ChevronUp,
  Clock,
  Target
} from 'lucide-react'
import { NotificationAlert as NotificationAlertType } from '@/types/notification'
import { cn } from '@/lib/utils'

interface NotificationAlertProps {
  alert: NotificationAlertType
  onAcknowledge: (alertId: string) => Promise<boolean>
  onDismiss?: (alertId: string) => void
  onRecheckSprint?: (sprintName: string) => Promise<void>
}

export function NotificationAlert({ alert, onAcknowledge, onDismiss, onRecheckSprint }: NotificationAlertProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isAcknowledging, setIsAcknowledging] = useState(false)

  const handleAcknowledge = async () => {
    setIsAcknowledging(true)
    try {
      const success = await onAcknowledge(alert.id)
      if (success) {
        // 成功確認後重新檢查該 Sprint 的進度
        if (onRecheckSprint) {
          await onRecheckSprint(alert.sprint_name)
        }
        // 然後關閉通知
        onDismiss?.(alert.id)
      }
    } catch (error) {
      console.error('Failed to acknowledge notification:', error)
    } finally {
      setIsAcknowledging(false)
    }
  }

  const getAlertConfig = (alertType: string) => {
    switch (alertType) {
      case 'danger':
        return {
          icon: AlertCircle,
          iconColor: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          badgeVariant: 'destructive' as const,
          badgeText: '嚴重落後',
          titleColor: 'text-red-800'
        }
      case 'warning':
        return {
          icon: AlertTriangle,
          iconColor: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          badgeVariant: 'secondary' as const,
          badgeText: '稍微落後',
          titleColor: 'text-yellow-800'
        }
      default:
        return {
          icon: AlertTriangle,
          iconColor: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          badgeVariant: 'secondary' as const,
          badgeText: '通知',
          titleColor: 'text-gray-800'
        }
    }
  }

  const config = getAlertConfig(alert.alert_type)
  const Icon = config.icon

  return (
    <Card className={cn(
      'w-full transition-all duration-200 hover:shadow-md',
      config.bgColor,
      config.borderColor,
      'border-l-4'
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Icon className={cn('h-5 w-5 mt-0.5', config.iconColor)} />
            <div className="flex-1 min-w-0">
              <CardTitle className={cn('text-sm font-semibold', config.titleColor)}>
                {alert.title}
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant={config.badgeVariant} className="text-xs">
                  {config.badgeText}
                </Badge>
                <span className="text-xs text-gray-500">
                  {new Date(alert.created_at).toLocaleString('zh-TW')}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDismiss(alert.id)}
                className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-gray-700 mb-3">{alert.message}</p>

        {isExpanded && (
          <div className="space-y-4">
            {/* 進度資訊 */}
            <div className="grid grid-cols-2 gap-4 p-3 bg-white rounded-lg border">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500">當前完成率</p>
                  <p className="text-sm font-semibold">{alert.current_completion_rate.toFixed(1)}%</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-xs text-gray-500">理想進度</p>
                  <p className="text-sm font-semibold">{alert.ideal_completion_rate.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            {/* 建議行動 */}
            <div>
              <h4 className="text-sm font-medium text-gray-800 mb-2">建議行動：</h4>
              <ul className="space-y-1">
                {alert.suggested_actions.map((action, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 操作按鈕 */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            落後 {alert.lag_percentage.toFixed(1)}%
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAcknowledge}
              disabled={isAcknowledging || alert.is_acknowledged}
              className="text-xs"
            >
              <Check className="h-3 w-3 mr-1" />
              {isAcknowledging ? '確認中...' : '確認'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
