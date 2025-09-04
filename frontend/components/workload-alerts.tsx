'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Users, TrendingUp, TrendingDown } from 'lucide-react'
import { WorkloadAlert } from '@/types/workload'

interface WorkloadAlertsProps {
  alerts: WorkloadAlert[]
  onDismiss?: (alertId: string) => void
}

export function WorkloadAlerts({ alerts, onDismiss }: WorkloadAlertsProps) {
  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
            工作負載警示
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              目前沒有工作負載不均的警示，團隊工作分配良好！
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const getAlertConfig = (alertType: string) => {
    switch (alertType) {
      case 'overloaded':
        return {
          icon: TrendingUp,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          badgeVariant: 'destructive' as const,
          label: '工作過載'
        }
      case 'underloaded':
        return {
          icon: TrendingDown,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          badgeVariant: 'secondary' as const,
          label: '工作不足'
        }
      default:
        return {
          icon: AlertTriangle,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          badgeVariant: 'default' as const,
          label: '未知狀態'
        }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
          工作負載警示
          <Badge variant="destructive" className="ml-2">
            {alerts.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert, index) => {
          const config = getAlertConfig(alert.alert_type)
          const AlertIcon = config.icon

          return (
            <Alert 
              key={`${alert.member_id}-${index}`}
              className={`${config.bgColor} ${config.borderColor}`}
            >
              <AlertIcon className={`h-4 w-4 ${config.color}`} />
              <AlertDescription className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{alert.member_name}</span>
                    <Badge variant={config.badgeVariant}>
                      {config.label}
                    </Badge>
                  </div>
                  <span className={`text-sm font-medium ${config.color}`}>
                    {alert.deviation_percentage.toFixed(1)}%
                  </span>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>目前負載: {alert.current_load.toFixed(1)} 故事點數</p>
                  <p>團隊平均: {alert.average_load.toFixed(1)} 故事點數</p>
                  <p className="mt-1 font-medium text-foreground">
                    建議: {alert.suggested_action}
                  </p>
                </div>

                {onDismiss && (
                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onDismiss(`${alert.member_id}-${index}`)}
                    >
                      確認處理
                    </Button>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )
        })}
      </CardContent>
    </Card>
  )
}
