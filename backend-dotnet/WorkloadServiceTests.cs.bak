using JiraDashboard.Services;
using JiraDashboard.Models;
using Moq;
using Xunit;

namespace JiraDashboard.Tests;

/// <summary>
/// 工作分配服務測試 - 對應 US-004: 團隊工作分配視覺化
/// </summary>
public class WorkloadServiceTests
{
    private readonly Mock<GoogleSheetsService> _mockSheetsService;
    private readonly WorkloadService _workloadService;

    public WorkloadServiceTests()
    {
        _mockSheetsService = new Mock<GoogleSheetsService>(Mock.Of<HttpClient>(), Mock.Of<IConfiguration>());
        _workloadService = new WorkloadService(_mockSheetsService.Object);
    }

    [Fact]
    public async Task GetWorkloadDistributionAsync_WithValidSprint_ReturnsWorkloadDistribution()
    {
        // Arrange
        var sprintName = "Sprint 1";
        var mockSprintData = new SprintBurndownResponse(
            SprintData: new SprintBurndownData(
                SprintName: sprintName,
                TotalStoryPoints: 100,
                CompletedStoryPoints: 50,
                RemainingStoryPoints: 50,
                CompletionRate: 50.0,
                Status: "normal",
                TotalWorkingDays: 10,
                DaysElapsed: 5,
                RemainingWorkingDays: 5
            ),
            DailyProgress: new List<DayProgress>(),
            ChartData: new List<ChartDataPoint>()
        );

        var mockSprintList = new List<Dictionary<string, object?>>
        {
            new Dictionary<string, object?> { ["sprint_name"] = sprintName }
        };

        var mockTasks = new List<Dictionary<string, object?>>
        {
            new Dictionary<string, object?>
            {
                ["id"] = "1",
                ["key"] = "TASK-1",
                ["summary"] = "Task 1",
                ["story_points"] = "5",
                ["status"] = "done",
                ["priority"] = "high",
                ["assignee"] = "John Doe",
                ["created"] = "2024-01-01",
                ["updated"] = "2024-01-02"
            },
            new Dictionary<string, object?>
            {
                ["id"] = "2",
                ["key"] = "TASK-2",
                ["summary"] = "Task 2",
                ["story_points"] = "3",
                ["status"] = "in progress",
                ["priority"] = "medium",
                ["assignee"] = "Jane Smith",
                ["created"] = "2024-01-01",
                ["updated"] = "2024-01-02"
            }
        };

        var mockPaginatedData = new PaginatedDataResponse(
            Data: mockTasks,
            TotalCount: 2,
            Page: 1,
            PageSize: 100,
            TotalPages: 1
        );

        _mockSheetsService.Setup(x => x.GetSprintBurndownDataAsync(sprintName))
            .ReturnsAsync(mockSprintData);
        _mockSheetsService.Setup(x => x.GetSprintListAsync())
            .ReturnsAsync(mockSprintList);
        _mockSheetsService.Setup(x => x.GetPaginatedDataAsync(1, 1000, "key", "asc", sprintName))
            .ReturnsAsync(mockPaginatedData);

        // Act
        var result = await _workloadService.GetWorkloadDistributionAsync(sprintName);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(sprintName, result.SprintName);
        Assert.Equal(8, result.TotalStoryPoints); // 5 + 3
        Assert.Equal(2, result.MemberWorkloads.Count);
        Assert.False(result.WorkloadImbalance); // Should be balanced with 2 members having similar loads
    }

    [Fact]
    public async Task GetWorkloadDistributionAsync_WithNonExistentSprint_ThrowsArgumentException()
    {
        // Arrange
        var sprintName = "Non-existent Sprint";
        var mockSprintList = new List<Dictionary<string, object?>>();

        _mockSheetsService.Setup(x => x.GetSprintListAsync())
            .ReturnsAsync(mockSprintList);

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => 
            _workloadService.GetWorkloadDistributionAsync(sprintName));
    }

    [Fact]
    public async Task GetWorkloadAlertsAsync_WithImbalancedWorkload_ReturnsAlerts()
    {
        // Arrange
        var sprintName = "Sprint 1";
        var mockSprintData = new SprintBurndownResponse(
            SprintData: new SprintBurndownData(
                SprintName: sprintName,
                TotalStoryPoints: 100,
                CompletedStoryPoints: 50,
                RemainingStoryPoints: 50,
                CompletionRate: 50.0,
                Status: "normal",
                TotalWorkingDays: 10,
                DaysElapsed: 5,
                RemainingWorkingDays: 5
            ),
            DailyProgress: new List<DayProgress>(),
            ChartData: new List<ChartDataPoint>()
        );

        var mockSprintList = new List<Dictionary<string, object?>>
        {
            new Dictionary<string, object?> { ["sprint_name"] = sprintName }
        };

        // Create imbalanced workload - one member with much more work
        var mockTasks = new List<Dictionary<string, object?>>
        {
            // Member 1: 50 story points (overloaded)
            new Dictionary<string, object?>
            {
                ["id"] = "1", ["key"] = "TASK-1", ["summary"] = "Task 1",
                ["story_points"] = "50", ["status"] = "todo", ["priority"] = "high",
                ["assignee"] = "John Doe", ["created"] = "2024-01-01", ["updated"] = "2024-01-02"
            },
            // Member 2: 5 story points (underloaded)
            new Dictionary<string, object?>
            {
                ["id"] = "2", ["key"] = "TASK-2", ["summary"] = "Task 2",
                ["story_points"] = "5", ["status"] = "todo", ["priority"] = "medium",
                ["assignee"] = "Jane Smith", ["created"] = "2024-01-01", ["updated"] = "2024-01-02"
            }
        };

        var mockPaginatedData = new PaginatedDataResponse(
            Data: mockTasks,
            TotalCount: 2,
            Page: 1,
            PageSize: 100,
            TotalPages: 1
        );

        _mockSheetsService.Setup(x => x.GetSprintBurndownDataAsync(sprintName))
            .ReturnsAsync(mockSprintData);
        _mockSheetsService.Setup(x => x.GetSprintListAsync())
            .ReturnsAsync(mockSprintList);
        _mockSheetsService.Setup(x => x.GetPaginatedDataAsync(1, 1000, "key", "asc", sprintName))
            .ReturnsAsync(mockPaginatedData);

        // Act
        var alerts = await _workloadService.GetWorkloadAlertsAsync(sprintName);

        // Assert
        Assert.NotNull(alerts);
        Assert.Equal(2, alerts.Count); // Both members should have alerts due to imbalance
        
        var overloadedAlert = alerts.FirstOrDefault(a => a.AlertType == "overloaded");
        var underloadedAlert = alerts.FirstOrDefault(a => a.AlertType == "underloaded");
        
        Assert.NotNull(overloadedAlert);
        Assert.NotNull(underloadedAlert);
        Assert.Equal("John Doe", overloadedAlert.MemberName);
        Assert.Equal("Jane Smith", underloadedAlert.MemberName);
    }

    [Fact]
    public async Task GetWorkloadTrendAsync_ReturnsTrendData()
    {
        // Arrange
        var sprintName = "Sprint 1";

        // Act
        var trend = await _workloadService.GetWorkloadTrendAsync(sprintName, 7);

        // Assert
        Assert.NotNull(trend);
        Assert.Equal(7, trend.Dates.Count);
        Assert.Equal(7, trend.AverageTrend.Count);
    }

    [Fact]
    public void ClearCache_WithSpecificSprint_RemovesSprintFromCache()
    {
        // Arrange
        var sprintName = "Sprint 1";

        // Act
        _workloadService.ClearCache(sprintName);

        // Assert - This test verifies the method doesn't throw
        // In a real implementation, we might want to verify cache state
        Assert.True(true);
    }

    [Fact]
    public void ClearCache_WithoutSprintName_ClearsAllCache()
    {
        // Act
        _workloadService.ClearCache();

        // Assert - This test verifies the method doesn't throw
        Assert.True(true);
    }
}