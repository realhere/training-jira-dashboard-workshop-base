import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock JiraDashboard 組件來避免複雜的 API 請求
jest.mock('@/components/jira-dashboard', () => {
  return function MockJiraDashboard() {
    return <div data-testid="jira-dashboard">Mocked Jira Dashboard</div>
  }
})

import Home from '@/app/page'

describe('Home Page', () => {
  it('renders the environment test message', () => {
    render(<Home />)
    
    // 測試是否顯示測試訊息
    const testMessage = screen.getByText(/請修改這行文字並 commit 到 GitHub 確認是否能修改！/)
    expect(testMessage).toBeInTheDocument()
  })

  it('renders with green success banner', () => {
    const { container } = render(<Home />)
    
    // 測試是否有綠色背景的橫幅
    const banner = container.querySelector('.bg-green-100')
    expect(banner).toBeInTheDocument()
    expect(banner).toHaveClass('bg-green-100')
  })

  it('renders the Jira Dashboard component', () => {
    render(<Home />)
    
    // 測試是否渲染 JiraDashboard 組件
    const dashboard = screen.getByTestId('jira-dashboard')
    expect(dashboard).toBeInTheDocument()
  })
})