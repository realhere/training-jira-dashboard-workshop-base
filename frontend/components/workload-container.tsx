'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RefreshCw, Users, AlertTriangle, BarChart3, PieChart } from 'lucide-react'
import { useWorkload } from '@/hooks/use-workload'
import { WorkloadCard } from './workload-card'
import { WorkloadChart } from './workload-chart'
import { WorkloadAlerts } from './workload-alerts'

interface WorkloadContainerProps {
  sprintName: string
}

export function WorkloadContainer({ sprintName }: WorkloadContainerProps) {
  const {
    distribution,
    alerts,
    trend,
    loading,
    error,
    stats,
    refreshWorkload
  } = useWorkload(sprintName)

  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar')

  const handleMemberClick = (memberId: string) => {
    setSelectedMemberId(selectedMemberId === memberId ? null : memberId)
  }

  const handleDismissAlert = (alertId: string) => {
    // 這裡可以實作警示確認邏輯
    console.log('Dismissed alert:', alertId)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>載入工作分配資料中...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center space-y-2">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto" />
            <p className="text-red-600">載入工作分配資料時發生錯誤</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={refreshWorkload} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              重新載入
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!distribution) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center space-y-2">
            <Users className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">沒有可用的工作分配資料</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* 統計概覽 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">團隊成員</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              總共 {stats.totalMembers} 人
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">總故事點數</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStoryPoints}</div>
            <p className="text-xs text-muted-foreground">
              平均 {stats.averageStoryPoints.toFixed(1)} 點/人
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">工作負載狀態</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600">正常</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  {stats.normalMembers}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-red-600">過載</span>
                <Badge variant="destructive">
                  {stats.overloadedMembers}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-yellow-600">不足</span>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  {stats.underloadedMembers}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">警示數量</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.alertCount}</div>
            <p className="text-xs text-muted-foreground">
              {stats.hasImbalance ? '需要關注' : '狀態良好'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 主要內容區域 */}
      <Tabs defaultValue="overview" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">概覽</TabsTrigger>
            <TabsTrigger value="members">成員詳情</TabsTrigger>
            <TabsTrigger value="charts">圖表分析</TabsTrigger>
            <TabsTrigger value="alerts">警示</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <Button onClick={refreshWorkload} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              重新整理
            </Button>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WorkloadChart 
              memberWorkloads={distribution.member_workloads}
              averageStoryPoints={distribution.average_story_points}
              chartType="bar"
            />
            <WorkloadAlerts alerts={alerts} onDismiss={handleDismissAlert} />
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {distribution.member_workloads.map((memberWorkload) => (
              <WorkloadCard
                key={memberWorkload.member.id}
                memberWorkload={memberWorkload}
                averageStoryPoints={distribution.average_story_points}
                showDetails={selectedMemberId === memberWorkload.member.id}
                onMemberClick={handleMemberClick}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">圖表分析</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant={chartType === 'bar' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setChartType('bar')}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  長條圖
                </Button>
                <Button
                  variant={chartType === 'pie' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setChartType('pie')}
                >
                  <PieChart className="h-4 w-4 mr-2" />
                  圓餅圖
                </Button>
              </div>
            </div>
            
            <WorkloadChart 
              memberWorkloads={distribution.member_workloads}
              averageStoryPoints={distribution.average_story_points}
              chartType={chartType}
            />
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <WorkloadAlerts alerts={alerts} onDismiss={handleDismissAlert} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
