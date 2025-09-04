import { useState, useEffect, useCallback } from 'react'
import { 
  WorkloadDistribution, 
  WorkloadAlert, 
  WorkloadTrend,
  WorkloadAlertsResponse,
  WorkloadRefreshResponse
} from '@/types/workload'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'

export function useWorkload(sprintName: string) {
  const [distribution, setDistribution] = useState<WorkloadDistribution | null>(null)
  const [alerts, setAlerts] = useState<WorkloadAlert[]>([])
  const [trend, setTrend] = useState<WorkloadTrend | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 取得工作分配資料
  const fetchWorkloadDistribution = useCallback(async () => {
    if (!sprintName || sprintName === 'All') return

    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`${API_BASE_URL}/api/workload/${encodeURIComponent(sprintName)}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: WorkloadDistribution = await response.json()
      setDistribution(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch workload distribution')
      console.error('Error fetching workload distribution:', err)
    } finally {
      setLoading(false)
    }
  }, [sprintName])

  // 取得工作負載警示
  const fetchWorkloadAlerts = useCallback(async () => {
    if (!sprintName || sprintName === 'All') return

    try {
      setError(null)
      
      const response = await fetch(`${API_BASE_URL}/api/workload/${encodeURIComponent(sprintName)}/alerts`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: WorkloadAlertsResponse = await response.json()
      setAlerts(data.alerts)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch workload alerts')
      console.error('Error fetching workload alerts:', err)
    }
  }, [sprintName])

  // 取得工作負載趨勢
  const fetchWorkloadTrend = useCallback(async () => {
    if (!sprintName || sprintName === 'All') return

    try {
      setError(null)
      
      const response = await fetch(`${API_BASE_URL}/api/workload/${encodeURIComponent(sprintName)}/trend`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: WorkloadTrend = await response.json()
      setTrend(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch workload trend')
      console.error('Error fetching workload trend:', err)
    }
  }, [sprintName])

  // 重新整理工作分配資料
  const refreshWorkload = useCallback(async () => {
    if (!sprintName || sprintName === 'All') return

    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`${API_BASE_URL}/api/workload/${encodeURIComponent(sprintName)}/refresh`, {
        method: 'POST',
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: WorkloadRefreshResponse = await response.json()
      setDistribution(data.distribution)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh workload data')
      console.error('Error refreshing workload data:', err)
    } finally {
      setLoading(false)
    }
  }, [sprintName])

  // 載入所有資料
  const loadAllData = useCallback(async () => {
    await Promise.all([
      fetchWorkloadDistribution(),
      fetchWorkloadAlerts(),
      fetchWorkloadTrend()
    ])
  }, [fetchWorkloadDistribution, fetchWorkloadAlerts, fetchWorkloadTrend])

  // 當 sprintName 改變時重新載入資料
  useEffect(() => {
    loadAllData()
  }, [loadAllData])

  // 計算統計資料
  const stats = {
    totalMembers: distribution?.member_workloads.length || 0,
    totalStoryPoints: distribution?.total_story_points || 0,
    averageStoryPoints: distribution?.average_story_points || 0,
    overloadedMembers: distribution?.member_workloads.filter(m => m.workload_status === 'overloaded').length || 0,
    underloadedMembers: distribution?.member_workloads.filter(m => m.workload_status === 'underloaded').length || 0,
    normalMembers: distribution?.member_workloads.filter(m => m.workload_status === 'normal').length || 0,
    hasImbalance: distribution?.workload_imbalance || false,
    alertCount: alerts.length
  }

  return {
    distribution,
    alerts,
    trend,
    loading,
    error,
    stats,
    fetchWorkloadDistribution,
    fetchWorkloadAlerts,
    fetchWorkloadTrend,
    refreshWorkload,
    loadAllData
  }
}
