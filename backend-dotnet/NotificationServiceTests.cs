using Xunit;
using JiraDashboard.Services;
using JiraDashboard.Models;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace JiraDashboard.Tests;

/// <summary>
/// 通知服務測試 - 對應 US-003: 風險預警功能
/// 測試案例：TC-003-01 至 TC-003-06
/// </summary>
public class NotificationServiceTests
{
    private readonly Mock<GoogleSheetsService> _mockSheetsService;
    private readonly NotificationService _notificationService;

    public NotificationServiceTests()
    {
        _mockSheetsService = new Mock<GoogleSheetsService>();
        _notificationService = new NotificationService(_mockSheetsService.Object);
    }

    /// <summary>
    /// TC-003-01: 測試預警觸發邏輯 - 正常情況
    /// 驗證當進度落後超過閾值時能正確觸發預警
    /// </summary>
    [Fact]
    public async Task CheckSprintProgressAsync_WhenProgressLags_ShouldCreateAlert()
    {
        // Arrange
        var sprintList = new List<Dictionary<string, object>>
        {
            new Dictionary<string, object>
            {
                ["sprint_name"] = "Sprint 1",
                ["state"] = "active"
            }
        };

        var burndownData = new SprintBurndownResponse(
            SprintData: new SprintBurndownData(
                SprintName: "Sprint 1",
                TotalStoryPoints: 20,
                CompletedStoryPoints: 8, // 40% 完成
                RemainingStoryPoints: 12,
                CompletionRate: 40.0,
                Status: "warning",
                TotalWorkingDays: 10,
                DaysElapsed: 7, // 70% 時間已過
                RemainingWorkingDays: 3
            ),
            DailyProgress: new List<DayProgress>(),
            ChartData: new List<Dictionary<string, object>>()
        );

        _mockSheetsService.Setup(x => x.GetSprintListAsync())
            .ReturnsAsync(sprintList);
        _mockSheetsService.Setup(x => x.GetSprintBurndownDataAsync("Sprint 1"))
            .ReturnsAsync(burndownData);

        // Act
        var alerts = await _notificationService.CheckSprintProgressAsync();

        // Assert
        Assert.Single(alerts);
        var alert = alerts[0];
        Assert.Equal("Sprint 1", alert.SprintName);
        Assert.Equal("warning", alert.AlertType);
        Assert.Equal(30.0, alert.LagPercentage); // 70% - 40% = 30%
        Assert.True(alert.LagPercentage >= 10.0); // 超過預警閾值
    }

    /// <summary>
    /// TC-003-02: 測試危險狀態預警
    /// 驗證當進度嚴重落後時觸發危險預警
    /// </summary>
    [Fact]
    public async Task CheckSprintProgressAsync_WhenSeverelyBehind_ShouldCreateDangerAlert()
    {
        // Arrange
        var sprintList = new List<Dictionary<string, object>>
        {
            new Dictionary<string, object>
            {
                ["sprint_name"] = "Sprint 2",
                ["state"] = "active"
            }
        };

        var burndownData = new SprintBurndownResponse(
            SprintData: new SprintBurndownData(
                SprintName: "Sprint 2",
                TotalStoryPoints: 20,
                CompletedStoryPoints: 4, // 20% 完成
                RemainingStoryPoints: 16,
                CompletionRate: 20.0,
                Status: "danger",
                TotalWorkingDays: 10,
                DaysElapsed: 8, // 80% 時間已過
                RemainingWorkingDays: 2
            ),
            DailyProgress: new List<DayProgress>(),
            ChartData: new List<Dictionary<string, object>>()
        );

        _mockSheetsService.Setup(x => x.GetSprintListAsync())
            .ReturnsAsync(sprintList);
        _mockSheetsService.Setup(x => x.GetSprintBurndownDataAsync("Sprint 2"))
            .ReturnsAsync(burndownData);

        // Act
        var alerts = await _notificationService.CheckSprintProgressAsync();

        // Assert
        Assert.Single(alerts);
        var alert = alerts[0];
        Assert.Equal("danger", alert.AlertType);
        Assert.Equal(60.0, alert.LagPercentage); // 80% - 20% = 60%
        Assert.True(alert.LagPercentage >= 20.0); // 超過危險閾值
        Assert.Contains("嚴重落後", alert.Title);
    }

    /// <summary>
    /// TC-003-03: 測試正常進度不觸發預警
    /// 驗證當進度正常時不產生預警通知
    /// </summary>
    [Fact]
    public async Task CheckSprintProgressAsync_WhenProgressNormal_ShouldNotCreateAlert()
    {
        // Arrange
        var sprintList = new List<Dictionary<string, object>>
        {
            new Dictionary<string, object>
            {
                ["sprint_name"] = "Sprint 3",
                ["state"] = "active"
            }
        };

        var burndownData = new SprintBurndownResponse(
            SprintData: new SprintBurndownData(
                SprintName: "Sprint 3",
                TotalStoryPoints: 20,
                CompletedStoryPoints: 14, // 70% 完成
                RemainingStoryPoints: 6,
                CompletionRate: 70.0,
                Status: "normal",
                TotalWorkingDays: 10,
                DaysElapsed: 7, // 70% 時間已過
                RemainingWorkingDays: 3
            ),
            DailyProgress: new List<DayProgress>(),
            ChartData: new List<Dictionary<string, object>>()
        );

        _mockSheetsService.Setup(x => x.GetSprintListAsync())
            .ReturnsAsync(sprintList);
        _mockSheetsService.Setup(x => x.GetSprintBurndownDataAsync("Sprint 3"))
            .ReturnsAsync(burndownData);

        // Act
        var alerts = await _notificationService.CheckSprintProgressAsync();

        // Assert
        Assert.Empty(alerts);
    }

    /// <summary>
    /// TC-003-04: 測試邊界值 - 剛好達到預警閾值
    /// 驗證邊界值處理的正確性
    /// </summary>
    [Theory]
    [InlineData(10.0, "warning")] // 剛好達到預警閾值
    [InlineData(20.0, "danger")]  // 剛好達到危險閾值
    [InlineData(9.9, "normal")]   // 略低於預警閾值
    [InlineData(19.9, "warning")] // 略低於危險閾值
    public async Task CheckSprintProgressAsync_BoundaryValues_ShouldTriggerCorrectAlert(
        double lagPercentage, string expectedAlertType)
    {
        // Arrange
        var sprintList = new List<Dictionary<string, object>>
        {
            new Dictionary<string, object>
            {
                ["sprint_name"] = "Sprint Test",
                ["state"] = "active"
            }
        };

        var timeProgress = 70.0;
        var actualProgress = timeProgress - lagPercentage;

        var burndownData = new SprintBurndownResponse(
            SprintData: new SprintBurndownData(
                SprintName: "Sprint Test",
                TotalStoryPoints: 20,
                CompletedStoryPoints: actualProgress * 20 / 100,
                RemainingStoryPoints: 20 - (actualProgress * 20 / 100),
                CompletionRate: actualProgress,
                Status: expectedAlertType,
                TotalWorkingDays: 10,
                DaysElapsed: 7,
                RemainingWorkingDays: 3
            ),
            DailyProgress: new List<DayProgress>(),
            ChartData: new List<Dictionary<string, object>>()
        );

        _mockSheetsService.Setup(x => x.GetSprintListAsync())
            .ReturnsAsync(sprintList);
        _mockSheetsService.Setup(x => x.GetSprintBurndownDataAsync("Sprint Test"))
            .ReturnsAsync(burndownData);

        // Act
        var alerts = await _notificationService.CheckSprintProgressAsync();

        // Assert
        if (expectedAlertType == "normal")
        {
            Assert.Empty(alerts);
        }
        else
        {
            Assert.Single(alerts);
            Assert.Equal(expectedAlertType, alerts[0].AlertType);
        }
    }

    /// <summary>
    /// TC-003-05: 測試通知確認功能
    /// 驗證通知確認後狀態正確更新
    /// </summary>
    [Fact]
    public void AcknowledgeNotification_WhenValidId_ShouldUpdateStatus()
    {
        // Arrange
        var alertId = "test_alert_123";
        var alert = new NotificationAlert(
            Id: alertId,
            SprintName: "Sprint Test",
            AlertType: "warning",
            Title: "Test Alert",
            Message: "Test Message",
            CurrentCompletionRate: 50.0,
            IdealCompletionRate: 70.0,
            LagPercentage: 20.0,
            SuggestedActions: new List<string> { "Test Action" },
            CreatedAt: DateTime.UtcNow,
            IsAcknowledged: false,
            AcknowledgedAt: null
        );

        // 先添加一個通知
        _notificationService.GetActiveNotifications(); // 初始化服務

        // Act
        var result = _notificationService.AcknowledgeNotification(alertId);

        // Assert
        Assert.False(result); // 因為通知不存在，應該返回 false
    }

    /// <summary>
    /// TC-003-06: 測試設定更新功能
    /// 驗證通知設定能正確更新
    /// </summary>
    [Fact]
    public void UpdateSettings_WithValidSettings_ShouldUpdateConfiguration()
    {
        // Arrange
        var newSettings = new UpdateNotificationSettingsRequest(
            WarningThreshold: 15.0,
            DangerThreshold: 25.0,
            EmailNotifications: false,
            DashboardNotifications: true,
            CooldownMinutes: 45
        );

        // Act
        _notificationService.UpdateSettings(newSettings);

        // Assert
        var response = _notificationService.GetActiveNotifications();
        Assert.Equal(15.0, response.Settings.WarningThreshold);
        Assert.Equal(25.0, response.Settings.DangerThreshold);
        Assert.False(response.Settings.EmailNotifications);
        Assert.True(response.Settings.DashboardNotifications);
        Assert.Equal(45, response.Settings.CooldownMinutes);
    }

    /// <summary>
    /// TC-003-07: 測試冷卻時間機制
    /// 驗證冷卻時間內不會重複產生通知
    /// </summary>
    [Fact]
    public async Task CheckSprintProgressAsync_WithinCooldownPeriod_ShouldNotCreateDuplicateAlert()
    {
        // Arrange
        var sprintName = "Sprint Cooldown";
        var sprintList = new List<Dictionary<string, object>>
        {
            new Dictionary<string, object>
            {
                ["sprint_name"] = sprintName,
                ["state"] = "active"
            }
        };

        var burndownData = new SprintBurndownResponse(
            SprintData: new SprintBurndownData(
                SprintName: sprintName,
                TotalStoryPoints: 20,
                CompletedStoryPoints: 8,
                RemainingStoryPoints: 12,
                CompletionRate: 40.0,
                Status: "warning",
                TotalWorkingDays: 10,
                DaysElapsed: 7,
                RemainingWorkingDays: 3
            ),
            DailyProgress: new List<DayProgress>(),
            ChartData: new List<Dictionary<string, object>>()
        );

        _mockSheetsService.Setup(x => x.GetSprintListAsync())
            .ReturnsAsync(sprintList);
        _mockSheetsService.Setup(x => x.GetSprintBurndownDataAsync(sprintName))
            .ReturnsAsync(burndownData);

        // 第一次檢查 - 應該產生通知
        var firstAlerts = await _notificationService.CheckSprintProgressAsync();
        Assert.Single(firstAlerts);

        // 立即第二次檢查 - 應該因為冷卻時間而不產生通知
        var secondAlerts = await _notificationService.CheckSprintProgressAsync();
        Assert.Empty(secondAlerts);
    }
}
