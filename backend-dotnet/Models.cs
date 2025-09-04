using System.Text.Json.Serialization;

namespace JiraDashboard.Models;

// Represents information about a single column in the table
public record ColumnInfo(string Name, string Type);

// Represents the response for the /api/table/summary endpoint
public record TableSummary(
    string SheetId,
    string SheetName,
    int TotalRows,
    int TotalColumns,
    List<ColumnInfo> Columns,
    DateTime LastUpdated
);

// Represents pagination information for the data table
public record PaginationInfo(
    int CurrentPage,
    int PageSize,
    int TotalPages,
    int TotalRecords,
    bool HasNext,
    bool HasPrev
);

// Represents the main response for the /api/table/data endpoint
public record TableDataResponse(
    [property: JsonPropertyName("data")] List<Dictionary<string, object?>> Data,
    [property: JsonPropertyName("pagination")] PaginationInfo Pagination
);

// Dashboard MVP Models
public record DashboardStats(
    [property: JsonPropertyName("total_issues")] int TotalIssues,
    [property: JsonPropertyName("total_story_points")] double TotalStoryPoints,
    [property: JsonPropertyName("done_issues")] int DoneIssues,
    [property: JsonPropertyName("done_story_points")] double DoneStoryPoints,
    [property: JsonPropertyName("last_updated")] DateTime LastUpdated
);

public record StatusDistributionItem(
    [property: JsonPropertyName("status")] string Status,
    [property: JsonPropertyName("count")] int Count,
    [property: JsonPropertyName("percentage")] double Percentage
);

public record StatusDistribution(
    [property: JsonPropertyName("distribution")] List<StatusDistributionItem> Distribution,
    [property: JsonPropertyName("total_count")] int TotalCount,
    [property: JsonPropertyName("last_updated")] DateTime LastUpdated
);

// Configuration Models
public record UpdateSheetConfigRequest(
    [property: JsonPropertyName("google_sheet_url")] string GoogleSheetUrl
);

public record UpdateSheetConfigResponse(
    [property: JsonPropertyName("success")] bool Success,
    [property: JsonPropertyName("message")] string Message,
    [property: JsonPropertyName("sheet_id")] string? SheetId
);

public record SheetConfigInfo(
    [property: JsonPropertyName("sheet_id")] string SheetId,
    [property: JsonPropertyName("sheet_url")] string SheetUrl
);

// Sprint Burndown Models
public record SprintBurndownData(
    [property: JsonPropertyName("sprint_name")] string SprintName,
    [property: JsonPropertyName("total_story_points")] double TotalStoryPoints,
    [property: JsonPropertyName("completed_story_points")] double CompletedStoryPoints,
    [property: JsonPropertyName("remaining_story_points")] double RemainingStoryPoints,
    [property: JsonPropertyName("completion_rate")] double CompletionRate,
    [property: JsonPropertyName("status")] string Status, // 'normal', 'warning', 'danger'
    [property: JsonPropertyName("total_working_days")] int TotalWorkingDays,
    [property: JsonPropertyName("days_elapsed")] int DaysElapsed,
    [property: JsonPropertyName("remaining_working_days")] int RemainingWorkingDays
);

public record DayProgress(
    [property: JsonPropertyName("day")] int Day,
    [property: JsonPropertyName("date")] string Date,
    [property: JsonPropertyName("ideal_remaining")] double IdealRemaining,
    [property: JsonPropertyName("actual_remaining")] double? ActualRemaining,
    [property: JsonPropertyName("is_working_day")] bool IsWorkingDay
);

public record SprintBurndownResponse(
    [property: JsonPropertyName("sprint_data")] SprintBurndownData SprintData,
    [property: JsonPropertyName("daily_progress")] List<DayProgress> DailyProgress,
    [property: JsonPropertyName("chart_data")] List<Dictionary<string, object>> ChartData
);

public record SprintInfo(
    [property: JsonPropertyName("sprint_name")] string SprintName,
    [property: JsonPropertyName("sprint_id")] int SprintId,
    [property: JsonPropertyName("board_name")] string BoardName,
    [property: JsonPropertyName("state")] string State,
    [property: JsonPropertyName("start_date")] DateTime? StartDate,
    [property: JsonPropertyName("end_date")] DateTime? EndDate,
    [property: JsonPropertyName("complete_date")] DateTime? CompleteDate,
    [property: JsonPropertyName("goal")] string Goal
);

// Notification Models for US-003
public record NotificationAlert(
    [property: JsonPropertyName("id")] string Id,
    [property: JsonPropertyName("sprint_name")] string SprintName,
    [property: JsonPropertyName("alert_type")] string AlertType, // 'warning', 'danger'
    [property: JsonPropertyName("title")] string Title,
    [property: JsonPropertyName("message")] string Message,
    [property: JsonPropertyName("current_completion_rate")] double CurrentCompletionRate,
    [property: JsonPropertyName("ideal_completion_rate")] double IdealCompletionRate,
    [property: JsonPropertyName("lag_percentage")] double LagPercentage,
    [property: JsonPropertyName("suggested_actions")] List<string> SuggestedActions,
    [property: JsonPropertyName("created_at")] DateTime CreatedAt,
    [property: JsonPropertyName("is_acknowledged")] bool IsAcknowledged,
    [property: JsonPropertyName("acknowledged_at")] DateTime? AcknowledgedAt
);

public record NotificationSettings(
    [property: JsonPropertyName("warning_threshold")] double WarningThreshold, // 預警閾值 (預設 10%)
    [property: JsonPropertyName("danger_threshold")] double DangerThreshold,   // 危險閾值 (預設 20%)
    [property: JsonPropertyName("email_notifications")] bool EmailNotifications,
    [property: JsonPropertyName("dashboard_notifications")] bool DashboardNotifications,
    [property: JsonPropertyName("cooldown_minutes")] int CooldownMinutes // 冷卻時間 (預設 30 分鐘)
);

public record NotificationResponse(
    [property: JsonPropertyName("alerts")] List<NotificationAlert> Alerts,
    [property: JsonPropertyName("settings")] NotificationSettings Settings,
    [property: JsonPropertyName("last_checked")] DateTime LastChecked
);

public record AcknowledgeNotificationRequest(
    [property: JsonPropertyName("alert_id")] string AlertId
);

public record UpdateNotificationSettingsRequest(
    [property: JsonPropertyName("warning_threshold")] double? WarningThreshold,
    [property: JsonPropertyName("danger_threshold")] double? DangerThreshold,
    [property: JsonPropertyName("email_notifications")] bool? EmailNotifications,
    [property: JsonPropertyName("dashboard_notifications")] bool? DashboardNotifications,
    [property: JsonPropertyName("cooldown_minutes")] int? CooldownMinutes
);

// Work Assignment Models for US-004
public record TeamMember(
    [property: JsonPropertyName("id")] string Id,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("email")] string Email,
    [property: JsonPropertyName("role")] string Role,
    [property: JsonPropertyName("avatar_url")] string? AvatarUrl
);

public record TaskAssignment(
    [property: JsonPropertyName("task_id")] string TaskId,
    [property: JsonPropertyName("task_key")] string TaskKey,
    [property: JsonPropertyName("summary")] string Summary,
    [property: JsonPropertyName("story_points")] double StoryPoints,
    [property: JsonPropertyName("status")] string Status,
    [property: JsonPropertyName("priority")] string Priority,
    [property: JsonPropertyName("assignee_id")] string AssigneeId,
    [property: JsonPropertyName("assignee_name")] string AssigneeName,
    [property: JsonPropertyName("created_date")] DateTime CreatedDate,
    [property: JsonPropertyName("updated_date")] DateTime UpdatedDate,
    [property: JsonPropertyName("due_date")] DateTime? DueDate
);

public record MemberWorkload(
    [property: JsonPropertyName("member")] TeamMember Member,
    [property: JsonPropertyName("total_story_points")] double TotalStoryPoints,
    [property: JsonPropertyName("completed_story_points")] double CompletedStoryPoints,
    [property: JsonPropertyName("remaining_story_points")] double RemainingStoryPoints,
    [property: JsonPropertyName("total_tasks")] int TotalTasks,
    [property: JsonPropertyName("completed_tasks")] int CompletedTasks,
    [property: JsonPropertyName("in_progress_tasks")] int InProgressTasks,
    [property: JsonPropertyName("todo_tasks")] int TodoTasks,
    [property: JsonPropertyName("completion_rate")] double CompletionRate,
    [property: JsonPropertyName("workload_status")] string WorkloadStatus, // 'normal', 'overloaded', 'underloaded'
    [property: JsonPropertyName("tasks")] List<TaskAssignment> Tasks
);

public record WorkloadDistribution(
    [property: JsonPropertyName("sprint_name")] string SprintName,
    [property: JsonPropertyName("total_story_points")] double TotalStoryPoints,
    [property: JsonPropertyName("average_story_points")] double AverageStoryPoints,
    [property: JsonPropertyName("member_workloads")] List<MemberWorkload> MemberWorkloads,
    [property: JsonPropertyName("workload_imbalance")] bool WorkloadImbalance,
    [property: JsonPropertyName("imbalance_threshold")] double ImbalanceThreshold,
    [property: JsonPropertyName("last_updated")] DateTime LastUpdated
);

public record WorkloadAlert(
    [property: JsonPropertyName("member_id")] string MemberId,
    [property: JsonPropertyName("member_name")] string MemberName,
    [property: JsonPropertyName("alert_type")] string AlertType, // 'overloaded', 'underloaded'
    [property: JsonPropertyName("current_load")] double CurrentLoad,
    [property: JsonPropertyName("average_load")] double AverageLoad,
    [property: JsonPropertyName("deviation_percentage")] double DeviationPercentage,
    [property: JsonPropertyName("suggested_action")] string SuggestedAction
);

public record WorkloadHistory(
    [property: JsonPropertyName("date")] DateTime Date,
    [property: JsonPropertyName("member_workloads")] List<MemberWorkload> MemberWorkloads,
    [property: JsonPropertyName("total_story_points")] double TotalStoryPoints,
    [property: JsonPropertyName("average_story_points")] double AverageStoryPoints
);

public record WorkloadTrend(
    [property: JsonPropertyName("dates")] List<string> Dates,
    [property: JsonPropertyName("member_trends")] List<MemberTrend> MemberTrends,
    [property: JsonPropertyName("average_trend")] List<double> AverageTrend
);

public record MemberTrend(
    [property: JsonPropertyName("member_id")] string MemberId,
    [property: JsonPropertyName("member_name")] string MemberName,
    [property: JsonPropertyName("story_points")] List<double> StoryPoints
);
