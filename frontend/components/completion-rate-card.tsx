"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingUp, AlertCircle } from "lucide-react"
import type { SprintBurndownData } from "@/hooks/use-sprint-burndown"

interface CompletionRateCardProps {
  sprintData: SprintBurndownData
  className?: string
}

const getStatusConfig = (status: SprintBurndownData['status']) => {
  switch (status) {
    case 'normal':
      return {
        color: 'bg-green-500',
        badgeVariant: 'default' as const,
        badgeClassName: 'bg-green-100 text-green-800 hover:bg-green-100',
        icon: TrendingUp,
        iconColor: 'text-green-600',
        label: '正常進度'
      }
    case 'warning':
      return {
        color: 'bg-yellow-500',
        badgeVariant: 'secondary' as const,
        badgeClassName: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
        icon: AlertTriangle,
        iconColor: 'text-yellow-600',
        label: '稍微落後'
      }
    case 'danger':
      return {
        color: 'bg-red-500',
        badgeVariant: 'destructive' as const,
        badgeClassName: 'bg-red-100 text-red-800 hover:bg-red-100',
        icon: AlertCircle,
        iconColor: 'text-red-600',
        label: '嚴重落後'
      }
  }
}

export function CompletionRateCard({ sprintData, className }: CompletionRateCardProps) {
  const statusConfig = getStatusConfig(sprintData.status)
  const StatusIcon = statusConfig.icon

  const formatStoryPoints = (points: number) => {
    return Number.isInteger(points) ? points.toString() : points.toFixed(1)
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Sprint 完成率</CardTitle>
          <Badge 
            variant={statusConfig.badgeVariant}
            className={statusConfig.badgeClassName}
          >
            <StatusIcon className={`w-3 h-3 mr-1 ${statusConfig.iconColor}`} />
            {statusConfig.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sprint 名稱 */}
        <div>
          <p className="text-sm text-muted-foreground mb-1">目前 Sprint</p>
          <p className="font-medium">{sprintData.sprint_name}</p>
        </div>

        {/* 完成率進度條 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-muted-foreground">整體進度</p>
            <p className="text-lg font-bold">{sprintData.completion_rate}%</p>
          </div>
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary">
            <div 
              className="h-full transition-all rounded-full"
              style={{ 
                width: `${sprintData.completion_rate}%`,
                backgroundColor: statusConfig.color.includes('green') ? '#22c55e' :
                                 statusConfig.color.includes('yellow') ? '#eab308' : '#ef4444'
              }}
            />
          </div>
        </div>

        {/* 故事點數分解 */}
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {formatStoryPoints(sprintData.completed_story_points)}
            </p>
            <p className="text-xs text-muted-foreground">已完成</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              {formatStoryPoints(sprintData.remaining_story_points)}
            </p>
            <p className="text-xs text-muted-foreground">剩餘</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {formatStoryPoints(sprintData.total_story_points)}
            </p>
            <p className="text-xs text-muted-foreground">總計</p>
          </div>
        </div>

        {/* 時間資訊 */}
        <div className="flex justify-between text-sm pt-2 border-t">
          <div>
            <p className="text-muted-foreground">已過天數</p>
            <p className="font-medium">{sprintData.days_elapsed} 天</p>
          </div>
          <div>
            <p className="text-muted-foreground">剩餘天數</p>
            <p className="font-medium">{sprintData.remaining_working_days} 天</p>
          </div>
          <div>
            <p className="text-muted-foreground">總工作日</p>
            <p className="font-medium">{sprintData.total_working_days} 天</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
