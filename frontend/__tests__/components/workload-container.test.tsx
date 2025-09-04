import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { WorkloadContainer } from '@/components/workload-container'
import { useWorkload } from '@/hooks/use-workload'

// Mock the useWorkload hook
jest.mock('@/hooks/use-workload')
const mockUseWorkload = useWorkload as jest.MockedFunction<typeof useWorkload>

// Mock data
const mockDistribution = {
  sprint_name: 'Sprint 1',
  total_story_points: 100,
  average_story_points: 25,
  member_workloads: [
    {
      member: {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Developer',
        avatar_url: null
      },
      total_story_points: 30,
      completed_story_points: 15,
      remaining_story_points: 15,
      total_tasks: 5,
      completed_tasks: 2,
      in_progress_tasks: 2,
      todo_tasks: 1,
      completion_rate: 50,
      workload_status: 'overloaded' as const,
      tasks: []
    },
    {
      member: {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'Developer',
        avatar_url: null
      },
      total_story_points: 20,
      completed_story_points: 10,
      remaining_story_points: 10,
      total_tasks: 3,
      completed_tasks: 1,
      in_progress_tasks: 1,
      todo_tasks: 1,
      completion_rate: 50,
      workload_status: 'normal' as const,
      tasks: []
    }
  ],
  workload_imbalance: true,
  imbalance_threshold: 30,
  last_updated: '2024-01-01T00:00:00Z'
}

const mockAlerts = [
  {
    member_id: '1',
    member_name: 'John Doe',
    alert_type: 'overloaded' as const,
    current_load: 30,
    average_load: 25,
    deviation_percentage: 20,
    suggested_action: '考慮重新分配部分任務給其他團隊成員'
  }
]

const mockStats = {
  totalMembers: 2,
  totalStoryPoints: 100,
  averageStoryPoints: 25,
  overloadedMembers: 1,
  underloadedMembers: 0,
  normalMembers: 1,
  hasImbalance: true,
  alertCount: 1
}

describe('WorkloadContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state', () => {
    mockUseWorkload.mockReturnValue({
      distribution: null,
      alerts: [],
      trend: null,
      loading: true,
      error: null,
      stats: mockStats,
      fetchWorkloadDistribution: jest.fn(),
      fetchWorkloadAlerts: jest.fn(),
      fetchWorkloadTrend: jest.fn(),
      refreshWorkload: jest.fn(),
      loadAllData: jest.fn()
    })

    render(<WorkloadContainer sprintName="Sprint 1" />)
    
    expect(screen.getByText('載入工作分配資料中...')).toBeInTheDocument()
  })

  it('renders error state', () => {
    mockUseWorkload.mockReturnValue({
      distribution: null,
      alerts: [],
      trend: null,
      loading: false,
      error: 'Failed to fetch data',
      stats: mockStats,
      fetchWorkloadDistribution: jest.fn(),
      fetchWorkloadAlerts: jest.fn(),
      fetchWorkloadTrend: jest.fn(),
      refreshWorkload: jest.fn(),
      loadAllData: jest.fn()
    })

    render(<WorkloadContainer sprintName="Sprint 1" />)
    
    expect(screen.getByText('載入工作分配資料時發生錯誤')).toBeInTheDocument()
    expect(screen.getByText('Failed to fetch data')).toBeInTheDocument()
    expect(screen.getByText('重新載入')).toBeInTheDocument()
  })

  it('renders no data state', () => {
    mockUseWorkload.mockReturnValue({
      distribution: null,
      alerts: [],
      trend: null,
      loading: false,
      error: null,
      stats: mockStats,
      fetchWorkloadDistribution: jest.fn(),
      fetchWorkloadAlerts: jest.fn(),
      fetchWorkloadTrend: jest.fn(),
      refreshWorkload: jest.fn(),
      loadAllData: jest.fn()
    })

    render(<WorkloadContainer sprintName="Sprint 1" />)
    
    expect(screen.getByText('沒有可用的工作分配資料')).toBeInTheDocument()
  })

  it('renders workload data successfully', () => {
    mockUseWorkload.mockReturnValue({
      distribution: mockDistribution,
      alerts: mockAlerts,
      trend: null,
      loading: false,
      error: null,
      stats: mockStats,
      fetchWorkloadDistribution: jest.fn(),
      fetchWorkloadAlerts: jest.fn(),
      fetchWorkloadTrend: jest.fn(),
      refreshWorkload: jest.fn(),
      loadAllData: jest.fn()
    })

    render(<WorkloadContainer sprintName="Sprint 1" />)
    
    // Check statistics cards
    expect(screen.getByText('團隊成員')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument() // totalMembers
    expect(screen.getByText('總故事點數')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument() // totalStoryPoints
    expect(screen.getByText('工作負載警示')).toBeInTheDocument()
    expect(screen.getAllByText('1')).toHaveLength(4) // alertCount and other 1s

    // Check tabs
    expect(screen.getByText('概覽')).toBeInTheDocument()
    expect(screen.getByText('成員詳情')).toBeInTheDocument()
    expect(screen.getByText('圖表分析')).toBeInTheDocument()
    expect(screen.getByText('警示')).toBeInTheDocument()
  })

  it('displays member workload cards', async () => {
    mockUseWorkload.mockReturnValue({
      distribution: mockDistribution,
      alerts: mockAlerts,
      trend: null,
      loading: false,
      error: null,
      stats: mockStats,
      fetchWorkloadDistribution: jest.fn(),
      fetchWorkloadAlerts: jest.fn(),
      fetchWorkloadTrend: jest.fn(),
      refreshWorkload: jest.fn(),
      loadAllData: jest.fn()
    })

    render(<WorkloadContainer sprintName="Sprint 1" />)
    
    // Check that tabs are present
    expect(screen.getByText('概覽')).toBeInTheDocument()
    expect(screen.getByText('成員詳情')).toBeInTheDocument()
    expect(screen.getByText('圖表分析')).toBeInTheDocument()
    expect(screen.getByText('警示')).toBeInTheDocument()
  })

  it('displays workload alerts', async () => {
    mockUseWorkload.mockReturnValue({
      distribution: mockDistribution,
      alerts: mockAlerts,
      trend: null,
      loading: false,
      error: null,
      stats: mockStats,
      fetchWorkloadDistribution: jest.fn(),
      fetchWorkloadAlerts: jest.fn(),
      fetchWorkloadTrend: jest.fn(),
      refreshWorkload: jest.fn(),
      loadAllData: jest.fn()
    })

    render(<WorkloadContainer sprintName="Sprint 1" />)
    
    // Check that alert count is displayed in the stats
    expect(screen.getByText('工作負載警示')).toBeInTheDocument()
    expect(screen.getByText('重新整理')).toBeInTheDocument()
  })

  it('calls refreshWorkload when refresh button is clicked', async () => {
    const mockRefreshWorkload = jest.fn()
    mockUseWorkload.mockReturnValue({
      distribution: mockDistribution,
      alerts: mockAlerts,
      trend: null,
      loading: false,
      error: null,
      stats: mockStats,
      fetchWorkloadDistribution: jest.fn(),
      fetchWorkloadAlerts: jest.fn(),
      fetchWorkloadTrend: jest.fn(),
      refreshWorkload: mockRefreshWorkload,
      loadAllData: jest.fn()
    })

    render(<WorkloadContainer sprintName="Sprint 1" />)
    
    const refreshButton = screen.getByText('重新整理')
    refreshButton.click()

    await waitFor(() => {
      expect(mockRefreshWorkload).toHaveBeenCalledTimes(1)
    })
  })
})
