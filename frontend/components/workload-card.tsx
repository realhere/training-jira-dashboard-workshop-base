'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AlertTriangle, Users, TrendingUp, Clock, CheckCircle2 } from 'lucide-react'
import { MemberWorkload } from '@/types/workload'

interface WorkloadCardProps {
  memberWorkload: MemberWorkload
  averageStoryPoints: number
  showDetails?: boolean
  onMemberClick?: (memberId: string) => void
}

export function WorkloadCard({ 
  memberWorkload, 
  averageStoryPoints, 
  showDetails = false,
  onMemberClick 
}: WorkloadCardProps) {
  const { member, total_story_points, completed_story_points, completion_rate, workload_status } = memberWorkload

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'overloaded':
        return {
          color: 'bg-red-500',
          badgeVariant: 'destructive' as const,
          badgeClassName: 'bg-red-100 text-red-800 hover:bg-red-100',
          icon: AlertTriangle,
          iconColor: 'text-red-600',
          label: '工作過載'
        }
      case 'underloaded':
        return {
          color: 'bg-yellow-500',
          badgeVariant: 'secondary' as const,
          badgeClassName: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
          icon: AlertTriangle,
          iconColor: 'text-yellow-600',
          label: '工作不足'
        }
      default:
        return {
          color: 'bg-green-500',
          badgeVariant: 'default' as const,
          badgeClassName: 'bg-green-100 text-green-800 hover:bg-green-100',
          icon: TrendingUp,
          iconColor: 'text-green-600',
          label: '正常負載'
        }
    }
  }

  const statusConfig = getStatusConfig(workload_status)
  const deviationPercentage = averageStoryPoints > 0 
    ? Math.abs(total_story_points - averageStoryPoints) / averageStoryPoints * 100 
    : 0

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        workload_status !== 'normal' ? 'ring-2 ring-orange-200' : ''
      }`}
      onClick={() => onMemberClick?.(member.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={member.avatar_url} alt={member.name} />
              <AvatarFallback>{member.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{member.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </div>
          </div>
          <Badge 
            variant={statusConfig.badgeVariant}
            className={statusConfig.badgeClassName}
          >
            <statusConfig.icon className="h-3 w-3 mr-1" />
            {statusConfig.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 故事點數統計 */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>故事點數進度</span>
            <span className="font-medium">{completion_rate.toFixed(1)}%</span>
          </div>
          <Progress value={completion_rate} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{completed_story_points} / {total_story_points}</span>
            <span>已完成 / 總計</span>
          </div>
        </div>

        {/* 工作負載比較 */}
        {averageStoryPoints > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>工作負載比較</span>
              <span className={`font-medium ${
                deviationPercentage > 30 ? 'text-orange-600' : 'text-muted-foreground'
              }`}>
                {deviationPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              相較於團隊平均 {averageStoryPoints.toFixed(1)} 點
            </div>
          </div>
        )}

        {/* 任務統計 */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="space-y-1">
            <div className="text-lg font-semibold text-blue-600">
              {memberWorkload.total_tasks}
            </div>
            <div className="text-xs text-muted-foreground">總任務</div>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-semibold text-green-600">
              {memberWorkload.completed_tasks}
            </div>
            <div className="text-xs text-muted-foreground">已完成</div>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-semibold text-orange-600">
              {memberWorkload.in_progress_tasks}
            </div>
            <div className="text-xs text-muted-foreground">進行中</div>
          </div>
        </div>

        {/* 詳細資訊 */}
        {showDetails && (
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                待辦任務
              </span>
              <span className="font-medium">{memberWorkload.todo_tasks}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                完成率
              </span>
              <span className="font-medium">{completion_rate.toFixed(1)}%</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
