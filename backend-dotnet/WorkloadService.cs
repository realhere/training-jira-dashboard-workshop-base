using JiraDashboard.Models;
using System.Collections.Concurrent;

namespace JiraDashboard.Services;

/// <summary>
/// 工作分配服務 - 處理團隊工作負載分析
/// 對應 US-004: 團隊工作分配視覺化
/// </summary>
public class WorkloadService
{
    private readonly GoogleSheetsService _sheetsService;
    private readonly ConcurrentDictionary<string, WorkloadDistribution> _workloadCache;
    private readonly ConcurrentDictionary<string, List<WorkloadHistory>> _historyCache;
    private readonly double _imbalanceThreshold = 30.0; // 30% 偏差視為工作負載不均

    public WorkloadService(GoogleSheetsService sheetsService)
    {
        _sheetsService = sheetsService;
        _workloadCache = new ConcurrentDictionary<string, WorkloadDistribution>();
        _historyCache = new ConcurrentDictionary<string, List<WorkloadHistory>>();
    }

    /// <summary>
    /// 取得指定 Sprint 的工作分配狀況
    /// 對應 AC-004-01: 團隊成員工作負載概覽
    /// </summary>
    public async Task<WorkloadDistribution> GetWorkloadDistributionAsync(string sprintName)
    {
        try
        {
            // 檢查快取
            if (_workloadCache.TryGetValue(sprintName, out var cachedDistribution))
            {
                return cachedDistribution;
            }

            // 取得 Sprint 資料
            var sprintData = await _sheetsService.GetSprintBurndownDataAsync(sprintName);
            var sprintList = await _sheetsService.GetSprintListAsync();
            var sprintRow = sprintList.FirstOrDefault(s => 
                s.ContainsKey("sprint_name") && 
                s["sprint_name"]?.ToString() == sprintName);

            if (sprintRow == null)
            {
                throw new ArgumentException($"Sprint '{sprintName}' not found");
            }

            // 取得所有任務資料
            var allTasks = await _sheetsService.GetPaginatedDataAsync(1, 1000, "key", "asc", sprintName);
            
            // 分析工作分配
            var memberWorkloads = await AnalyzeMemberWorkloadsAsync(allTasks.Data);
            
            // 計算總體統計
            var totalStoryPoints = memberWorkloads.Sum(m => m.TotalStoryPoints);
            var averageStoryPoints = memberWorkloads.Any() ? totalStoryPoints / memberWorkloads.Count : 0;
            
            // 檢查工作負載不均
            var workloadImbalance = CheckWorkloadImbalance(memberWorkloads, averageStoryPoints);

            var distribution = new WorkloadDistribution(
                SprintName: sprintName,
                TotalStoryPoints: totalStoryPoints,
                AverageStoryPoints: averageStoryPoints,
                MemberWorkloads: memberWorkloads,
                WorkloadImbalance: workloadImbalance,
                ImbalanceThreshold: _imbalanceThreshold,
                LastUpdated: DateTime.UtcNow
            );

            // 快取結果
            _workloadCache[sprintName] = distribution;

            return distribution;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error getting workload distribution for {sprintName}: {ex.Message}");
            throw;
        }
    }

    /// <summary>
    /// 分析團隊成員的工作負載
    /// </summary>
    private async Task<List<MemberWorkload>> AnalyzeMemberWorkloadsAsync(List<Dictionary<string, object?>> tasks)
    {
        var memberGroups = tasks
            .Where(t => t.ContainsKey("assignee") && !string.IsNullOrEmpty(t["assignee"]?.ToString()))
            .GroupBy(t => t["assignee"]?.ToString() ?? "")
            .ToList();

        var memberWorkloads = new List<MemberWorkload>();

        foreach (var group in memberGroups)
        {
            var assigneeName = group.Key;
            var memberTasks = group.ToList();

            // 建立團隊成員資訊
            var member = new TeamMember(
                Id: GenerateMemberId(assigneeName),
                Name: assigneeName,
                Email: $"{assigneeName.ToLower().Replace(" ", ".")}@company.com",
                Role: "Developer", // 預設角色，實際應從使用者管理系統取得
                AvatarUrl: null
            );

            // 計算工作負載統計
            var totalStoryPoints = memberTasks
                .Where(t => t.ContainsKey("story_points") && double.TryParse(t["story_points"]?.ToString(), out _))
                .Sum(t => double.Parse(t["story_points"]?.ToString() ?? "0"));

            var completedStoryPoints = memberTasks
                .Where(t => t.ContainsKey("story_points") && 
                           t.ContainsKey("status") && 
                           t["status"]?.ToString()?.ToLower() == "done" &&
                           double.TryParse(t["story_points"]?.ToString(), out _))
                .Sum(t => double.Parse(t["story_points"]?.ToString() ?? "0"));

            var remainingStoryPoints = totalStoryPoints - completedStoryPoints;

            // 計算任務統計
            var totalTasks = memberTasks.Count;
            var completedTasks = memberTasks.Count(t => t["status"]?.ToString()?.ToLower() == "done");
            var inProgressTasks = memberTasks.Count(t => 
                t["status"]?.ToString()?.ToLower() == "in progress" ||
                t["status"]?.ToString()?.ToLower() == "in_progress");
            var todoTasks = totalTasks - completedTasks - inProgressTasks;

            var completionRate = totalStoryPoints > 0 ? (completedStoryPoints / totalStoryPoints) * 100 : 0;

            // 建立任務分配清單
            var taskAssignments = memberTasks.Select(t => new TaskAssignment(
                TaskId: t.ContainsKey("id") ? t["id"]?.ToString() ?? "" : "",
                TaskKey: t.ContainsKey("key") ? t["key"]?.ToString() ?? "" : "",
                Summary: t.ContainsKey("summary") ? t["summary"]?.ToString() ?? "" : "",
                StoryPoints: t.ContainsKey("story_points") && double.TryParse(t["story_points"]?.ToString(), out var sp) ? sp : 0,
                Status: t.ContainsKey("status") ? t["status"]?.ToString() ?? "" : "",
                Priority: t.ContainsKey("priority") ? t["priority"]?.ToString() ?? "" : "",
                AssigneeId: member.Id,
                AssigneeName: member.Name,
                CreatedDate: t.ContainsKey("created") && DateTime.TryParse(t["created"]?.ToString(), out var created) ? created : DateTime.UtcNow,
                UpdatedDate: t.ContainsKey("updated") && DateTime.TryParse(t["updated"]?.ToString(), out var updated) ? updated : DateTime.UtcNow,
                DueDate: t.ContainsKey("duedate") && DateTime.TryParse(t["duedate"]?.ToString(), out var due) ? due : null
            )).ToList();

            // 判斷工作負載狀態
            var workloadStatus = DetermineWorkloadStatus(totalStoryPoints, 0); // 暫時使用 0 作為平均值，後續會更新

            var memberWorkload = new MemberWorkload(
                Member: member,
                TotalStoryPoints: totalStoryPoints,
                CompletedStoryPoints: completedStoryPoints,
                RemainingStoryPoints: remainingStoryPoints,
                TotalTasks: totalTasks,
                CompletedTasks: completedTasks,
                InProgressTasks: inProgressTasks,
                TodoTasks: todoTasks,
                CompletionRate: completionRate,
                WorkloadStatus: workloadStatus,
                Tasks: taskAssignments
            );

            memberWorkloads.Add(memberWorkload);
        }

        // 更新工作負載狀態（需要先計算平均值）
        var averageStoryPoints = memberWorkloads.Any() ? memberWorkloads.Average(m => m.TotalStoryPoints) : 0;
        for (int i = 0; i < memberWorkloads.Count; i++)
        {
            memberWorkloads[i] = memberWorkloads[i] with { WorkloadStatus = DetermineWorkloadStatus(memberWorkloads[i].TotalStoryPoints, averageStoryPoints) };
        }

        return memberWorkloads;
    }

    /// <summary>
    /// 判斷工作負載狀態
    /// </summary>
    private string DetermineWorkloadStatus(double memberStoryPoints, double averageStoryPoints)
    {
        if (averageStoryPoints == 0) return "normal";

        var deviationPercentage = Math.Abs(memberStoryPoints - averageStoryPoints) / averageStoryPoints * 100;
        
        if (deviationPercentage > _imbalanceThreshold)
        {
            return memberStoryPoints > averageStoryPoints ? "overloaded" : "underloaded";
        }
        
        return "normal";
    }

    /// <summary>
    /// 檢查工作負載不均
    /// </summary>
    private bool CheckWorkloadImbalance(List<MemberWorkload> memberWorkloads, double averageStoryPoints)
    {
        return memberWorkloads.Any(m => 
            Math.Abs(m.TotalStoryPoints - averageStoryPoints) / averageStoryPoints * 100 > _imbalanceThreshold);
    }

    /// <summary>
    /// 取得工作負載警示
    /// 對應 AC-004-03: 工作負載不均警示
    /// </summary>
    public async Task<List<WorkloadAlert>> GetWorkloadAlertsAsync(string sprintName)
    {
        var distribution = await GetWorkloadDistributionAsync(sprintName);
        var alerts = new List<WorkloadAlert>();

        foreach (var memberWorkload in distribution.MemberWorkloads)
        {
            if (memberWorkload.WorkloadStatus == "overloaded" || memberWorkload.WorkloadStatus == "underloaded")
            {
                var deviationPercentage = Math.Abs(memberWorkload.TotalStoryPoints - distribution.AverageStoryPoints) / 
                                        distribution.AverageStoryPoints * 100;

                var suggestedAction = memberWorkload.WorkloadStatus == "overloaded" 
                    ? "考慮重新分配部分任務給其他團隊成員"
                    : "考慮分配更多任務以平衡工作負載";

                var alert = new WorkloadAlert(
                    MemberId: memberWorkload.Member.Id,
                    MemberName: memberWorkload.Member.Name,
                    AlertType: memberWorkload.WorkloadStatus,
                    CurrentLoad: memberWorkload.TotalStoryPoints,
                    AverageLoad: distribution.AverageStoryPoints,
                    DeviationPercentage: deviationPercentage,
                    SuggestedAction: suggestedAction
                );

                alerts.Add(alert);
            }
        }

        return alerts;
    }

    /// <summary>
    /// 取得工作負載歷史趨勢
    /// 對應 AC-004-05: 工作分配歷史追蹤
    /// </summary>
    public async Task<WorkloadTrend> GetWorkloadTrendAsync(string sprintName, int days = 7)
    {
        // 這裡應該從歷史資料中取得，暫時返回模擬資料
        var dates = Enumerable.Range(0, days)
            .Select(i => DateTime.UtcNow.AddDays(-i).ToString("yyyy-MM-dd"))
            .Reverse()
            .ToList();

        var memberTrends = new List<MemberTrend>();
        var averageTrend = new List<double>();

        // 模擬資料 - 實際應從歷史記錄中取得
        for (int i = 0; i < days; i++)
        {
            averageTrend.Add(20.0 + i * 2.0); // 模擬平均趨勢
        }

        return new WorkloadTrend(
            Dates: dates,
            MemberTrends: memberTrends,
            AverageTrend: averageTrend
        );
    }

    /// <summary>
    /// 生成成員 ID
    /// </summary>
    private string GenerateMemberId(string name)
    {
        return $"member_{name.ToLower().Replace(" ", "_")}_{Guid.NewGuid().ToString("N")[..8]}";
    }

    /// <summary>
    /// 清除快取
    /// </summary>
    public void ClearCache(string? sprintName = null)
    {
        if (sprintName == null)
        {
            _workloadCache.Clear();
            _historyCache.Clear();
        }
        else
        {
            _workloadCache.TryRemove(sprintName, out _);
            _historyCache.TryRemove(sprintName, out _);
        }
    }
}
