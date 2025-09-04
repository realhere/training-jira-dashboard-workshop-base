// Workload Types for US-004: 團隊工作分配視覺化

export interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  avatar_url?: string
}

export interface TaskAssignment {
  task_id: string
  task_key: string
  summary: string
  story_points: number
  status: string
  priority: string
  assignee_id: string
  assignee_name: string
  created_date: string
  updated_date: string
  due_date?: string
}

export interface MemberWorkload {
  member: TeamMember
  total_story_points: number
  completed_story_points: number
  remaining_story_points: number
  total_tasks: number
  completed_tasks: number
  in_progress_tasks: number
  todo_tasks: number
  completion_rate: number
  workload_status: 'normal' | 'overloaded' | 'underloaded'
  tasks: TaskAssignment[]
}

export interface WorkloadDistribution {
  sprint_name: string
  total_story_points: number
  average_story_points: number
  member_workloads: MemberWorkload[]
  workload_imbalance: boolean
  imbalance_threshold: number
  last_updated: string
}

export interface WorkloadAlert {
  member_id: string
  member_name: string
  alert_type: 'overloaded' | 'underloaded'
  current_load: number
  average_load: number
  deviation_percentage: number
  suggested_action: string
}

export interface WorkloadHistory {
  date: string
  member_workloads: MemberWorkload[]
  total_story_points: number
  average_story_points: number
}

export interface WorkloadTrend {
  dates: string[]
  member_trends: MemberTrend[]
  average_trend: number[]
}

export interface MemberTrend {
  member_id: string
  member_name: string
  story_points: number[]
}

export interface WorkloadAlertsResponse {
  alerts: WorkloadAlert[]
}

export interface WorkloadRefreshResponse {
  success: boolean
  distribution: WorkloadDistribution
}
