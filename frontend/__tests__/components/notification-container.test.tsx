import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { NotificationContainer } from '@/components/notification-container'

// Mock the useNotifications hook
const mockUseNotifications = jest.fn()

jest.mock('@/hooks/use-notifications', () => ({
  useNotifications: () => mockUseNotifications()
}))

describe('NotificationContainer', () => {
  beforeEach(() => {
    mockUseNotifications.mockReturnValue({
      notifications: [
        {
          id: 'alert_1',
          sprint_name: 'Sprint 1',
          alert_type: 'warning',
          title: '⚠️ Sprint 1 進度稍微落後',
          message: 'Sprint 1 的進度落後 15.0%，當前完成率 50.0%，理想進度應為 65.0%。',
          current_completion_rate: 50.0,
          ideal_completion_rate: 65.0,
          lag_percentage: 15.0,
          suggested_actions: [
            '檢視剩餘工作並重新排定優先順序',
            '與團隊討論可能的阻礙因素'
          ],
          created_at: '2025-01-18T10:00:00Z',
          is_acknowledged: false,
          acknowledged_at: null
        },
        {
          id: 'alert_2',
          sprint_name: 'Sprint 2',
          alert_type: 'danger',
          title: '🚨 Sprint 2 進度嚴重落後',
          message: 'Sprint 2 的進度已落後 30.0%，當前完成率 30.0%，理想進度應為 60.0%。',
          current_completion_rate: 30.0,
          ideal_completion_rate: 60.0,
          lag_percentage: 30.0,
          suggested_actions: [
            '立即召開緊急會議檢討 Sprint 範圍',
            '與利害關係人溝通調整期望'
          ],
          created_at: '2025-01-18T09:30:00Z',
          is_acknowledged: false,
          acknowledged_at: null
        }
      ],
      settings: {
        warning_threshold: 10.0,
        danger_threshold: 20.0,
        email_notifications: true,
        dashboard_notifications: true,
        cooldown_minutes: 30
      },
      loading: false,
      error: null,
      lastChecked: new Date('2025-01-18T10:00:00Z'),
      stats: {
        total: 2,
        unacknowledged: 2,
        warning: 1,
        danger: 1
      },
      fetchNotifications: jest.fn(),
      checkSprintProgress: jest.fn(),
      acknowledgeNotification: jest.fn(),
      updateSettings: jest.fn(),
      cleanupNotifications: jest.fn()
    })
  })

  it('renders notification container with title and stats', () => {
    render(<NotificationContainer />)
    
    expect(screen.getByText('預警通知')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument() // unacknowledged count badge
    expect(screen.getByText('預警: 1')).toBeInTheDocument()
    expect(screen.getByText('危險: 1')).toBeInTheDocument()
    expect(screen.getByText('已確認: 0')).toBeInTheDocument()
  })

  it('renders notification alerts', () => {
    render(<NotificationContainer />)
    
    expect(screen.getByText('⚠️ Sprint 1 進度稍微落後')).toBeInTheDocument()
    expect(screen.getByText('🚨 Sprint 2 進度嚴重落後')).toBeInTheDocument()
  })

  it('shows alert details when expanded', async () => {
    render(<NotificationContainer />)
    
    // Find and click the expand button for the first alert
    const expandButtons = screen.getAllByRole('button')
    const chevronButton = expandButtons.find(button => 
      button.querySelector('svg[class*="chevron"]')
    )
    if (chevronButton) {
      fireEvent.click(chevronButton)
    }
    
    await waitFor(() => {
      expect(screen.getByText('當前完成率')).toBeInTheDocument()
      expect(screen.getByText('50.0%')).toBeInTheDocument()
      expect(screen.getByText('理想進度')).toBeInTheDocument()
      expect(screen.getByText('65.0%')).toBeInTheDocument()
      expect(screen.getByText('建議行動：')).toBeInTheDocument()
    })
  })

  it('shows acknowledge button for unacknowledged alerts', () => {
    render(<NotificationContainer />)
    
    const acknowledgeButtons = screen.getAllByText('確認')
    expect(acknowledgeButtons).toHaveLength(2)
  })

  it('shows correct lag percentage', () => {
    render(<NotificationContainer />)
    
    expect(screen.getByText('落後 15.0%')).toBeInTheDocument()
    expect(screen.getByText('落後 30.0%')).toBeInTheDocument()
  })

  it('shows settings information', () => {
    render(<NotificationContainer />)
    
    expect(screen.getByText('預警閾值: 10% | 危險閾值: 20%')).toBeInTheDocument()
    expect(screen.getByText('冷卻時間: 30 分鐘')).toBeInTheDocument()
  })
})

describe('NotificationContainer - Empty State', () => {
  beforeEach(() => {
    mockUseNotifications.mockReturnValue({
      notifications: [],
      settings: {
        warning_threshold: 10.0,
        danger_threshold: 20.0,
        email_notifications: true,
        dashboard_notifications: true,
        cooldown_minutes: 30
      },
      loading: false,
      error: null,
      lastChecked: new Date('2025-01-18T10:00:00Z'),
      stats: {
        total: 0,
        unacknowledged: 0,
        warning: 0,
        danger: 0
      },
      fetchNotifications: jest.fn(),
      checkSprintProgress: jest.fn(),
      acknowledgeNotification: jest.fn(),
      updateSettings: jest.fn(),
      cleanupNotifications: jest.fn()
    })
  })

  it('shows empty state when no notifications', () => {
    render(<NotificationContainer />)
    
    expect(screen.getByText('目前沒有預警通知')).toBeInTheDocument()
    expect(screen.getByText('所有 Sprint 進度正常')).toBeInTheDocument()
  })
})

describe('NotificationContainer - Error State', () => {
  beforeEach(() => {
    mockUseNotifications.mockReturnValue({
      notifications: [],
      settings: null,
      loading: false,
      error: 'Failed to fetch notifications',
      lastChecked: null,
      stats: {
        total: 0,
        unacknowledged: 0,
        warning: 0,
        danger: 0
      },
      fetchNotifications: jest.fn(),
      checkSprintProgress: jest.fn(),
      acknowledgeNotification: jest.fn(),
      updateSettings: jest.fn(),
      cleanupNotifications: jest.fn()
    })
  })

  it('shows error message when there is an error', () => {
    render(<NotificationContainer />)
    
    expect(screen.getByText('載入通知時發生錯誤：Failed to fetch notifications')).toBeInTheDocument()
    expect(screen.getByText('重新載入')).toBeInTheDocument()
  })
})
