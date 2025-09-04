import { useState, useEffect, useCallback } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'

export interface SprintBurndownData {
  sprint_name: string
  total_story_points: number
  completed_story_points: number
  remaining_story_points: number
  completion_rate: number
  status: 'normal' | 'warning' | 'danger'
  total_working_days: number
  days_elapsed: number
  remaining_working_days: number
}

export interface DayProgress {
  day: number
  date: string
  ideal_remaining: number
  actual_remaining: number
  is_working_day: boolean
}

export interface ChartDataPoint {
  day: number
  date: string
  ideal: number
  actual: number
}

export interface SprintBurndownResponse {
  sprint_data: SprintBurndownData
  daily_progress: DayProgress[]
  chart_data: ChartDataPoint[]
}

export interface SprintInfo {
  sprint_name: string
  sprint_id: number
  board_name: string
  state: string
  start_date: string | null
  end_date: string | null
  complete_date: string | null
  goal: string
}

export interface UseSprintBurndownParams {
  sprintName?: string
}

export function useSprintBurndown(params: UseSprintBurndownParams = {}) {
  const [burndownData, setBurndownData] = useState<SprintBurndownResponse | null>(null)
  const [sprintInfo, setSprintInfo] = useState<SprintInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { sprintName } = params

  // Fetch sprint burndown data
  const fetchBurndownData = useCallback(async (sprint: string) => {
    if (!sprint || sprint === 'All') {
      setBurndownData(null)
      setSprintInfo(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const encodedSprintName = encodeURIComponent(sprint)
      
      // Fetch burndown data
      const burndownResponse = await fetch(`${API_BASE_URL}/api/sprint/burndown/${encodedSprintName}`)
      if (!burndownResponse.ok) {
        if (burndownResponse.status === 404) {
          throw new Error(`Sprint "${sprint}" not found`)
        }
        throw new Error('Failed to fetch sprint burndown data')
      }
      const burndownData = await burndownResponse.json()
      setBurndownData(burndownData)

      // Fetch sprint info
      const infoResponse = await fetch(`${API_BASE_URL}/api/sprint/info/${encodedSprintName}`)
      if (infoResponse.ok) {
        const infoData = await infoResponse.json()
        setSprintInfo(infoData)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      setBurndownData(null)
      setSprintInfo(null)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch data when sprint name changes
  useEffect(() => {
    if (sprintName) {
      fetchBurndownData(sprintName)
    } else {
      setBurndownData(null)
      setSprintInfo(null)
      setLoading(false)
    }
  }, [sprintName, fetchBurndownData])

  // Refetch function for manual refresh
  const refetch = useCallback(() => {
    if (sprintName) {
      fetchBurndownData(sprintName)
    }
  }, [sprintName, fetchBurndownData])

  return {
    burndownData,
    sprintInfo,
    loading,
    error,
    refetch
  }
}
