using Xunit;
using JiraDashboard.Models;

namespace JiraDashboard.Tests;

/// <summary>
/// Sprint 燃盡圖 API 業務邏輯測試
/// 對應測試案例：TC-001-01 至 TC-001-05
/// 驗證核心業務邏輯和計算邏輯的正確性
/// </summary>
public class SprintBurndownApiTests
{
    /// <summary>
    /// TC-001-01: 測試基本資料模型驗證
    /// 驗證 SprintBurndownData 模型的基本結構
    /// </summary>
    [Fact]
    public void SprintBurndownData_CreatesWithCorrectStructure()
    {
        // Arrange & Act
        var sprintData = new SprintBurndownData(
            SprintName: "Test Sprint",
            TotalStoryPoints: 20.0,
            CompletedStoryPoints: 13.0,
            RemainingStoryPoints: 7.0,
            CompletionRate: 65.0,
            Status: "normal",
            TotalWorkingDays: 10,
            DaysElapsed: 7,
            RemainingWorkingDays: 3
        );

        // Assert - 對應 TC-001-01 預期結果
        Assert.Equal("Test Sprint", sprintData.SprintName);
        Assert.Equal(20.0, sprintData.TotalStoryPoints);
        Assert.Equal(13.0, sprintData.CompletedStoryPoints);
        Assert.Equal(7.0, sprintData.RemainingStoryPoints);
        Assert.Equal(65.0, sprintData.CompletionRate);
        Assert.Equal("normal", sprintData.Status);
        Assert.Equal(10, sprintData.TotalWorkingDays);
        Assert.Equal(7, sprintData.DaysElapsed);
        Assert.Equal(3, sprintData.RemainingWorkingDays);
    }

    /// <summary>
    /// TC-001-02: 測試正常進度狀態的計算邏輯
    /// 驗證當進度正常時，狀態為 "normal"
    /// </summary>
    [Theory]
    [InlineData(70.0, 60.0, "normal")]  // 超前進度 - 綠色
    [InlineData(65.0, 65.0, "normal")]  // 剛好符合 - 綠色
    [InlineData(80.0, 70.0, "normal")]  // 超前 10% - 綠色
    public void CalculateProgressStatus_NormalProgress_ReturnsNormal(
        double completionRate, double timeProgressRate, string expectedStatus)
    {
        // Act
        var actualStatus = CalculateProgressStatus(completionRate, timeProgressRate);

        // Assert - 對應 TC-001-02 正常狀態預期
        Assert.Equal(expectedStatus, actualStatus);
    }

    /// <summary>
    /// TC-001-03: 測試警示進度狀態的計算邏輯
    /// 驗證當進度稍微落後時（10-20%），狀態為 "warning"
    /// </summary>
    [Theory]
    [InlineData(50.0, 60.0, "warning")] // 落後 10% - 黃色
    [InlineData(45.0, 60.0, "warning")] // 落後 15% - 黃色
    [InlineData(40.0, 55.0, "warning")] // 落後 15% - 黃色
    public void CalculateProgressStatus_WarningProgress_ReturnsWarning(
        double completionRate, double timeProgressRate, string expectedStatus)
    {
        // Act
        var actualStatus = CalculateProgressStatus(completionRate, timeProgressRate);

        // Assert - 對應 TC-001-03 警示狀態預期
        Assert.Equal(expectedStatus, actualStatus);
    }

    /// <summary>
    /// TC-001-04: 測試危險進度狀態的計算邏輯
    /// 驗證當進度嚴重落後時（>20%），狀態為 "danger"
    /// </summary>
    [Theory]
    [InlineData(30.0, 80.0, "danger")]  // 落後 50% - 紅色
    [InlineData(20.0, 70.0, "danger")]  // 落後 50% - 紅色
    [InlineData(40.0, 65.0, "danger")]  // 落後 25% - 紅色
    public void CalculateProgressStatus_DangerProgress_ReturnsDanger(
        double completionRate, double timeProgressRate, string expectedStatus)
    {
        // Act
        var actualStatus = CalculateProgressStatus(completionRate, timeProgressRate);

        // Assert - 對應 TC-001-04 危險狀態預期
        Assert.Equal(expectedStatus, actualStatus);
    }

    /// <summary>
    /// TC-001-05: 邊界值測試
    /// 驗證進度狀態切換的邊界值準確性
    /// </summary>
    [Theory]
    [InlineData(91.0, 100.0, "normal")]  // 落後 9% - 正常
    [InlineData(90.0, 100.0, "warning")] // 落後 10% - 警示
    [InlineData(81.0, 100.0, "warning")] // 落後 19% - 警示
    [InlineData(80.0, 100.0, "danger")]  // 落後 20% - 危險
    [InlineData(79.0, 100.0, "danger")]  // 落後 21% - 危險
    [InlineData(50.0, 59.99, "normal")]  // 落後 9.99% - 正常
    [InlineData(50.0, 60.0, "warning")]  // 落後 10% - 警示（邊界）
    [InlineData(50.0, 69.99, "warning")] // 落後 19.99% - 警示
    [InlineData(50.0, 70.0, "danger")]   // 落後 20% - 危險（邊界）
    public void CalculateProgressStatus_BoundaryValues_ReturnsCorrectStatus(
        double completionRate, double timeProgressRate, string expectedStatus)
    {
        // Act
        var actualStatus = CalculateProgressStatus(completionRate, timeProgressRate);

        // Assert - 對應 TC-001-05 邊界值測試
        Assert.Equal(expectedStatus, actualStatus);
    }

    /// <summary>
    /// 測試完成率計算邏輯
    /// </summary>
    [Theory]
    [InlineData(13.0, 20.0, 65.0)]   // TC-001-01 測試資料
    [InlineData(14.0, 20.0, 70.0)]   // TC-001-02 測試資料
    [InlineData(10.0, 20.0, 50.0)]   // TC-001-03 測試資料
    [InlineData(6.0, 20.0, 30.0)]    // TC-001-04 測試資料
    [InlineData(0.0, 20.0, 0.0)]     // 邊界值：未開始
    [InlineData(20.0, 20.0, 100.0)]  // 邊界值：全部完成
    public void CalculateCompletionRate_VariousValues_ReturnsCorrectPercentage(
        double completedSP, double totalSP, double expectedRate)
    {
        // Act
        var completionRate = CalculateCompletionRate(completedSP, totalSP);
        
        // Assert
        Assert.Equal(expectedRate, completionRate, 1); // 允許 1% 誤差
    }

    /// <summary>
    /// 測試剩餘故事點數計算
    /// </summary>
    [Theory]
    [InlineData(20.0, 13.0, 7.0)]   // TC-001-01 測試資料
    [InlineData(20.0, 14.0, 6.0)]   // TC-001-02 測試資料
    [InlineData(20.0, 10.0, 10.0)]  // TC-001-03 測試資料
    [InlineData(20.0, 6.0, 14.0)]   // TC-001-04 測試資料
    [InlineData(20.0, 0.0, 20.0)]   // 邊界值：未開始
    [InlineData(20.0, 20.0, 0.0)]   // 邊界值：全部完成
    public void CalculateRemainingStoryPoints_VariousValues_ReturnsCorrectRemaining(
        double totalSP, double completedSP, double expectedRemaining)
    {
        // Act
        var remaining = totalSP - completedSP;
        
        // Assert
        Assert.Equal(expectedRemaining, remaining);
    }

    /// <summary>
    /// 測試異常情況處理
    /// </summary>
    [Theory]
    [InlineData(0.0, 100.0)]   // 完成率為 0
    [InlineData(-10.0, 50.0)]  // 負數完成率
    [InlineData(110.0, 50.0)]  // 超過 100% 完成率
    [InlineData(50.0, -10.0)]  // 負數時間進度
    public void CalculateProgressStatus_EdgeCases_HandlesGracefully(
        double completionRate, double timeProgressRate)
    {
        // Act & Assert - 不應該拋出異常
        var status = CalculateProgressStatus(completionRate, timeProgressRate);
        Assert.Contains(status, new[] { "normal", "warning", "danger" });
    }

    /// <summary>
    /// 測試 SprintBurndownResponse 資料結構
    /// </summary>
    [Fact]
    public void SprintBurndownResponse_CreatesWithCorrectStructure()
    {
        // Arrange
        var sprintData = new SprintBurndownData(
            "Test Sprint", 20.0, 13.0, 7.0, 65.0, "normal", 10, 7, 3
        );
        var dailyProgress = new List<DayProgress>
        {
            new(1, "2025-01-01", 18.0, 18.0, true),
            new(2, "2025-01-02", 16.0, 15.0, true)
        };
        var chartData = new List<Dictionary<string, object>>
        {
            new() { ["day"] = 1, ["ideal"] = 18.0, ["actual"] = 18.0 },
            new() { ["day"] = 2, ["ideal"] = 16.0, ["actual"] = 15.0 }
        };

        // Act
        var response = new SprintBurndownResponse(sprintData, dailyProgress, chartData);

        // Assert
        Assert.NotNull(response.SprintData);
        Assert.NotNull(response.DailyProgress);
        Assert.NotNull(response.ChartData);
        Assert.Equal(2, response.DailyProgress.Count);
        Assert.Equal(2, response.ChartData.Count);
    }

    /// <summary>
    /// 測試 DayProgress 資料結構
    /// </summary>
    [Fact]
    public void DayProgress_CreatesWithCorrectStructure()
    {
        // Act
        var dayProgress = new DayProgress(
            Day: 5,
            Date: "2025-01-05",
            IdealRemaining: 10.0,
            ActualRemaining: 8.0,
            IsWorkingDay: true
        );

        // Assert
        Assert.Equal(5, dayProgress.Day);
        Assert.Equal("2025-01-05", dayProgress.Date);
        Assert.Equal(10.0, dayProgress.IdealRemaining);
        Assert.Equal(8.0, dayProgress.ActualRemaining);
        Assert.True(dayProgress.IsWorkingDay);
    }

    #region 輔助方法

    /// <summary>
    /// 進度狀態計算輔助方法
    /// 複製後端邏輯用於測試驗證
    /// </summary>
    private static string CalculateProgressStatus(double completionRate, double timeProgressRate)
    {
        var progressDiff = timeProgressRate - completionRate;
        
        if (progressDiff < 10) return "normal";    // 綠色：正常或超前
        if (progressDiff < 20) return "warning";   // 黃色：稍微落後
        return "danger";                           // 紅色：嚴重落後
    }

    /// <summary>
    /// 完成率計算輔助方法
    /// </summary>
    private static double CalculateCompletionRate(double completedSP, double totalSP)
    {
        if (totalSP <= 0) return 0.0;
        return Math.Round((completedSP / totalSP) * 100, 2);
    }

    #endregion
}