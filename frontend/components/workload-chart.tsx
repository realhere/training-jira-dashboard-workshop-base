'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { MemberWorkload } from '@/types/workload'

interface WorkloadChartProps {
  memberWorkloads: MemberWorkload[]
  averageStoryPoints: number
  chartType?: 'bar' | 'pie'
}

export function WorkloadChart({ 
  memberWorkloads, 
  averageStoryPoints, 
  chartType = 'bar' 
}: WorkloadChartProps) {
  // 準備長條圖資料
  const barChartData = memberWorkloads.map(member => ({
    name: member.member.name,
    total: member.total_story_points,
    completed: member.completed_story_points,
    remaining: member.remaining_story_points,
    average: averageStoryPoints,
    status: member.workload_status
  }))

  // 準備圓餅圖資料
  const pieChartData = [
    {
      name: '正常負載',
      value: memberWorkloads.filter(m => m.workload_status === 'normal').length,
      color: '#10b981'
    },
    {
      name: '工作過載',
      value: memberWorkloads.filter(m => m.workload_status === 'overloaded').length,
      color: '#ef4444'
    },
    {
      name: '工作不足',
      value: memberWorkloads.filter(m => m.workload_status === 'underloaded').length,
      color: '#f59e0b'
    }
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <div className="space-y-1 text-sm">
            <p className="text-blue-600">總故事點數: {data.total}</p>
            <p className="text-green-600">已完成: {data.completed}</p>
            <p className="text-orange-600">剩餘: {data.remaining}</p>
            <p className="text-gray-600">團隊平均: {data.average.toFixed(1)}</p>
            <p className={`font-medium ${
              data.status === 'overloaded' ? 'text-red-600' :
              data.status === 'underloaded' ? 'text-yellow-600' : 'text-green-600'
            }`}>
              狀態: {
                data.status === 'overloaded' ? '工作過載' :
                data.status === 'underloaded' ? '工作不足' : '正常負載'
              }
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  if (chartType === 'pie') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>工作負載分布</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value}人 (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>團隊工作負載比較</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="total" 
                fill="#3b82f6" 
                name="總故事點數"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="completed" 
                fill="#10b981" 
                name="已完成"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="average" 
                fill="#f59e0b" 
                name="團隊平均"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
