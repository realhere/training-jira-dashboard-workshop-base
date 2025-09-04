using JiraDashboard.Models;
using System.Collections.Concurrent;

namespace JiraDashboard.Services;

/// <summary>
/// 通知服務 - 處理 Sprint 進度預警通知
/// 對應 US-003: 風險預警功能
/// </summary>
public class NotificationService
{
    private readonly GoogleSheetsService _sheetsService;
    private readonly ConcurrentDictionary<string, NotificationAlert> _activeAlerts;
    private readonly ConcurrentDictionary<string, DateTime> _lastNotificationTime;
    private NotificationSettings _settings;

    public NotificationService(GoogleSheetsService sheetsService)
    {
        _sheetsService = sheetsService;
        _activeAlerts = new ConcurrentDictionary<string, NotificationAlert>();
        _lastNotificationTime = new ConcurrentDictionary<string, DateTime>();
        
        // 預設設定
        _settings = new NotificationSettings(
            WarningThreshold: 10.0,  // 10% 落後觸發預警
            DangerThreshold: 20.0,   // 20% 落後觸發危險
            EmailNotifications: true,
            DashboardNotifications: true,
            CooldownMinutes: 30      // 30 分鐘冷卻時間
        );
    }

    /// <summary>
    /// 檢查所有 Sprint 的進度並生成預警通知
    /// 對應 AC-003-01: 進度落後預警觸發
    /// </summary>
    public async Task<List<NotificationAlert>> CheckSprintProgressAsync()
    {
        var newAlerts = new List<NotificationAlert>();
        
        try
        {
            // 取得所有 Sprint 列表
            var sprintList = await _sheetsService.GetSprintListAsync();
            var activeSprints = sprintList.Where(s => 
                s.ContainsKey("state") && 
                s["state"]?.ToString()?.ToLower() == "active")
                .ToList();

            foreach (var sprintRow in activeSprints)
            {
                var sprintName = sprintRow.ContainsKey("sprint_name") ? 
                    sprintRow["sprint_name"]?.ToString() : "";
                
                if (string.IsNullOrEmpty(sprintName)) continue;

                // 檢查是否在冷卻時間內
                if (IsInCooldownPeriod(sprintName)) continue;

                // 取得 Sprint 燃盡圖資料
                var burndownData = await _sheetsService.GetSprintBurndownDataAsync(sprintName);
                var sprintData = burndownData.SprintData;

                // 檢查是否需要生成預警
                var alert = await CheckSprintForAlertsAsync(sprintName, sprintData);
                if (alert != null)
                {
                    newAlerts.Add(alert);
                    _activeAlerts[alert.Id] = alert;
                    _lastNotificationTime[sprintName] = DateTime.UtcNow;
                }
            }
        }
        catch (Exception ex)
        {
            // 記錄錯誤但不中斷流程
            Console.WriteLine($"Error checking sprint progress: {ex.Message}");
        }

        return newAlerts;
    }

    /// <summary>
    /// 檢查特定 Sprint 的進度並生成預警通知
    /// 用於重新檢查已確認的預警
    /// </summary>
    public async Task<List<NotificationAlert>> CheckSpecificSprintAsync(string sprintName)
    {
        var newAlerts = new List<NotificationAlert>();
        
        try
        {
            // 取得 Sprint 燃盡圖資料
            var burndownData = await _sheetsService.GetSprintBurndownDataAsync(sprintName);
            var sprintData = burndownData.SprintData;

            // 檢查是否需要生成預警（忽略冷卻時間限制）
            var alert = await CheckSprintForAlertsAsync(sprintName, sprintData);
            if (alert != null)
            {
                newAlerts.Add(alert);
                _activeAlerts[alert.Id] = alert;
                _lastNotificationTime[sprintName] = DateTime.UtcNow;
            }
        }
        catch (Exception ex)
        {
            // 記錄錯誤但不中斷流程
            Console.WriteLine($"Error checking sprint progress for {sprintName}: {ex.Message}");
        }

        return newAlerts;
    }

    /// <summary>
    /// 檢查單一 Sprint 是否需要預警
    /// 對應 AC-003-02: 預警通知內容完整性
    /// 如果進度落後狀況仍然存在，即使之前已確認也會重新創建預警
    /// </summary>
    private async Task<NotificationAlert?> CheckSprintForAlertsAsync(string sprintName, SprintBurndownData sprintData)
    {
        // 計算理想進度
        var timeProgress = (double)sprintData.DaysElapsed / sprintData.TotalWorkingDays * 100;
        var actualProgress = sprintData.CompletionRate;
        var lagPercentage = timeProgress - actualProgress;

        // 檢查是否超過危險閾值
        if (lagPercentage >= _settings.DangerThreshold)
        {
            // 檢查是否已有相同 Sprint 的危險預警且未確認
            var existingAlert = _activeAlerts.Values
                .FirstOrDefault(a => a.SprintName == sprintName && 
                               a.AlertType == "danger" && 
                               !a.IsAcknowledged);
            
            if (existingAlert == null)
            {
                return CreateAlert(sprintName, "danger", actualProgress, timeProgress, lagPercentage);
            }
        }
        // 檢查是否超過預警閾值
        else if (lagPercentage >= _settings.WarningThreshold)
        {
            // 檢查是否已有相同 Sprint 的預警且未確認
            var existingAlert = _activeAlerts.Values
                .FirstOrDefault(a => a.SprintName == sprintName && 
                               a.AlertType == "warning" && 
                               !a.IsAcknowledged);
            
            if (existingAlert == null)
            {
                return CreateAlert(sprintName, "warning", actualProgress, timeProgress, lagPercentage);
            }
        }
        else
        {
            // 如果進度正常，清除該 Sprint 的所有未確認預警
            var alertsToRemove = _activeAlerts.Values
                .Where(a => a.SprintName == sprintName && !a.IsAcknowledged)
                .ToList();
            
            foreach (var alert in alertsToRemove)
            {
                _activeAlerts.TryRemove(alert.Id, out _);
            }
        }

        return null;
    }

    /// <summary>
    /// 創建預警通知
    /// 對應 AC-003-02: 預警通知內容完整性
    /// </summary>
    private NotificationAlert CreateAlert(string sprintName, string alertType, 
        double currentProgress, double idealProgress, double lagPercentage)
    {
        var alertId = $"{sprintName}_{alertType}_{DateTime.UtcNow:yyyyMMddHHmmss}";
        
        var (title, message, suggestedActions) = alertType switch
        {
            "danger" => (
                $"🚨 {sprintName} 進度嚴重落後",
                $"{sprintName} 的進度已落後 {lagPercentage:F1}%，當前完成率 {currentProgress:F1}%，理想進度應為 {idealProgress:F1}%。",
                new List<string>
                {
                    "立即召開緊急會議檢討 Sprint 範圍",
                    "與利害關係人溝通調整期望",
                    "考慮延長 Sprint 或移除部分功能",
                    "重新評估團隊能力與工作量"
                }
            ),
            "warning" => (
                $"⚠️ {sprintName} 進度稍微落後",
                $"{sprintName} 的進度落後 {lagPercentage:F1}%，當前完成率 {currentProgress:F1}%，理想進度應為 {idealProgress:F1}%。",
                new List<string>
                {
                    "檢視剩餘工作並重新排定優先順序",
                    "與團隊討論可能的阻礙因素",
                    "考慮增加資源或調整工作分配",
                    "準備與利害關係人溝通進度狀況"
                }
            ),
            _ => (string.Empty, string.Empty, new List<string>())
        };

        return new NotificationAlert(
            Id: alertId,
            SprintName: sprintName,
            AlertType: alertType,
            Title: title,
            Message: message,
            CurrentCompletionRate: currentProgress,
            IdealCompletionRate: idealProgress,
            LagPercentage: lagPercentage,
            SuggestedActions: suggestedActions,
            CreatedAt: DateTime.UtcNow,
            IsAcknowledged: false,
            AcknowledgedAt: null
        );
    }

    /// <summary>
    /// 取得所有活躍的預警通知
    /// 對應 AC-003-03: 預警通知發送機制
    /// </summary>
    public NotificationResponse GetActiveNotifications()
    {
        var activeAlerts = _activeAlerts.Values
            .Where(alert => !alert.IsAcknowledged)
            .OrderByDescending(alert => alert.CreatedAt)
            .ToList();

        return new NotificationResponse(
            Alerts: activeAlerts,
            Settings: _settings,
            LastChecked: DateTime.UtcNow
        );
    }

    /// <summary>
    /// 確認預警通知
    /// 對應 AC-003-05: 預警通知關閉與確認
    /// </summary>
    public bool AcknowledgeNotification(string alertId)
    {
        if (_activeAlerts.TryGetValue(alertId, out var alert))
        {
            var updatedAlert = alert with 
            { 
                IsAcknowledged = true, 
                AcknowledgedAt = DateTime.UtcNow 
            };
            _activeAlerts[alertId] = updatedAlert;
            return true;
        }
        return false;
    }

    /// <summary>
    /// 更新通知設定
    /// 對應 AC-003-04: 預警閾值設定
    /// </summary>
    public void UpdateSettings(UpdateNotificationSettingsRequest request)
    {
        _settings = _settings with
        {
            WarningThreshold = request.WarningThreshold ?? _settings.WarningThreshold,
            DangerThreshold = request.DangerThreshold ?? _settings.DangerThreshold,
            EmailNotifications = request.EmailNotifications ?? _settings.EmailNotifications,
            DashboardNotifications = request.DashboardNotifications ?? _settings.DashboardNotifications,
            CooldownMinutes = request.CooldownMinutes ?? _settings.CooldownMinutes
        };
    }

    /// <summary>
    /// 檢查是否在冷卻時間內
    /// </summary>
    private bool IsInCooldownPeriod(string sprintName)
    {
        if (!_lastNotificationTime.TryGetValue(sprintName, out var lastTime))
            return false;

        var cooldownPeriod = TimeSpan.FromMinutes(_settings.CooldownMinutes);
        return DateTime.UtcNow - lastTime < cooldownPeriod;
    }

    /// <summary>
    /// 清除已確認的通知
    /// </summary>
    public void CleanupAcknowledgedNotifications()
    {
        var acknowledgedKeys = _activeAlerts
            .Where(kvp => kvp.Value.IsAcknowledged)
            .Select(kvp => kvp.Key)
            .ToList();

        foreach (var key in acknowledgedKeys)
        {
            _activeAlerts.TryRemove(key, out _);
        }
    }
}
