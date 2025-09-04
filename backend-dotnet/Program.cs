using JiraDashboard.Services;
using JiraDashboard.Models;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddHttpClient();
builder.Services.AddSingleton<GoogleSheetsService>(provider =>
{
    var httpClient = provider.GetRequiredService<IHttpClientFactory>().CreateClient();
    var configuration = provider.GetRequiredService<IConfiguration>();
    return new GoogleSheetsService(httpClient, configuration);
});

builder.Services.AddSingleton<NotificationService>(provider =>
{
    var sheetsService = provider.GetRequiredService<GoogleSheetsService>();
    return new NotificationService(sheetsService);
});

builder.Services.AddSingleton<WorkloadService>(provider =>
{
    var sheetsService = provider.GetRequiredService<GoogleSheetsService>();
    return new WorkloadService(sheetsService);
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.WithOrigins("http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Use CORS
app.UseCors();

// Configure the HTTP request pipeline.

app.MapGet("/api/table/summary", async (GoogleSheetsService sheetsService) => 
{
    try
    {
        return Results.Ok(await sheetsService.GetSummaryAsync());
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message);
    }
});

app.MapGet("/api/table/data", async (
    [FromServices] GoogleSheetsService sheetsService,
    [FromQuery] int page = 1,
    [FromQuery(Name = "page_size")] int pageSize = 100,
    [FromQuery(Name = "sort_by")] string sortBy = "key",
    [FromQuery(Name = "sort_order")] string sortOrder = "asc",
    [FromQuery] string? sprint = null) =>
{
    try
    {
        var result = await sheetsService.GetPaginatedDataAsync(page, pageSize, sortBy, sortOrder, sprint);
        return Results.Ok(result);
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message);
    }
});

app.MapGet("/api/table/sprints", async (GoogleSheetsService sheetsService) => 
{
    try
    {
        var sprints = await sheetsService.GetSprintOptionsAsync();
        return Results.Ok(new { sprints });
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message);
    }
});

// Dashboard MVP API endpoints
app.MapGet("/api/dashboard/stats", async (
    [FromServices] GoogleSheetsService sheetsService,
    [FromQuery] string? sprint = null) =>
{
    try
    {
        var stats = await sheetsService.GetDashboardStatsAsync(sprint);
        return Results.Ok(stats);
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message);
    }
});

app.MapGet("/api/dashboard/status-distribution", async (
    [FromServices] GoogleSheetsService sheetsService,
    [FromQuery] string? sprint = null) =>
{
    try
    {
        var distribution = await sheetsService.GetStatusDistributionAsync(sprint);
        return Results.Ok(distribution);
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message);
    }
});

// Sprint Burndown API endpoints
app.MapGet("/api/sprint/burndown/{sprintName}", async (string sprintName, GoogleSheetsService sheetsService) =>
{
    try
    {
        var burndownData = await sheetsService.GetSprintBurndownDataAsync(sprintName);
        return Results.Ok(burndownData);
    }
    catch (ArgumentException ex)
    {
        return Results.NotFound(ex.Message);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Failed to get sprint burndown data: {ex.Message}");
    }
});

app.MapGet("/api/sprint/info/{sprintName}", async (string sprintName, GoogleSheetsService sheetsService) =>
{
    try
    {
        var sprintInfo = await sheetsService.GetSprintInfoAsync(sprintName);
        return Results.Ok(sprintInfo);
    }
    catch (ArgumentException ex)
    {
        return Results.NotFound(ex.Message);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Failed to get sprint info: {ex.Message}");
    }
});

app.MapGet("/api/sprint/list", async (GoogleSheetsService sheetsService) =>
{
    try
    {
        var sprintData = await sheetsService.GetSprintListAsync();
        var sprints = sprintData.Select(row => new
        {
            sprint_name = row.ContainsKey("sprint_name") ? row["sprint_name"]?.ToString() : "",
            sprint_id = row.ContainsKey("sprint_id") && int.TryParse(row["sprint_id"]?.ToString(), out var id) ? id : 0,
            board_name = row.ContainsKey("board_name") ? row["board_name"]?.ToString() : "",
            state = row.ContainsKey("state") ? row["state"]?.ToString() : "",
            start_date = row.ContainsKey("startdate") ? row["startdate"]?.ToString() : null,
            end_date = row.ContainsKey("enddate") ? row["enddate"]?.ToString() : null,
            goal = row.ContainsKey("goal") ? row["goal"]?.ToString() : ""
        }).ToList();

        return Results.Ok(new { sprints });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Failed to get sprint list: {ex.Message}");
    }
});

// Configuration API endpoints
app.MapGet("/api/config/sheet", (GoogleSheetsService sheetsService) =>
{
    try
    {
        var sheetId = sheetsService.GetCurrentSheetId();
        var sheetUrl = sheetsService.GetSheetUrl();
        return Results.Ok(new SheetConfigInfo(sheetId, sheetUrl));
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message);
    }
});

app.MapPost("/api/config/sheet", (
    [FromBody] UpdateSheetConfigRequest request,
    [FromServices] GoogleSheetsService sheetsService) =>
{
    try
    {
        var extractedSheetId = GoogleSheetsService.ExtractSheetIdFromUrl(request.GoogleSheetUrl);
        
        if (string.IsNullOrEmpty(extractedSheetId))
        {
            return Results.BadRequest(new UpdateSheetConfigResponse(
                false, 
                "Invalid Google Sheets URL. Please provide a valid Google Sheets URL.", 
                null));
        }

        // 動態更新 SheetId 並清除快取
        sheetsService.UpdateSheetId(extractedSheetId);
        
        return Results.Ok(new UpdateSheetConfigResponse(
            true, 
            $"Sheet ID updated successfully to: {extractedSheetId}. Changes are now active.", 
            extractedSheetId));
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message);
    }
});

// Notification API endpoints for US-003
app.MapGet("/api/notifications", async (NotificationService notificationService) =>
{
    try
    {
        var response = notificationService.GetActiveNotifications();
        return Results.Ok(response);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Failed to get notifications: {ex.Message}");
    }
});

app.MapPost("/api/notifications/check", async (NotificationService notificationService) =>
{
    try
    {
        var newAlerts = await notificationService.CheckSprintProgressAsync();
        return Results.Ok(new { alerts_created = newAlerts.Count, alerts = newAlerts });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Failed to check sprint progress: {ex.Message}");
    }
});

app.MapPost("/api/notifications/check-sprint/{sprintName}", async (string sprintName, NotificationService notificationService) =>
{
    try
    {
        var newAlerts = await notificationService.CheckSpecificSprintAsync(sprintName);
        return Results.Ok(new { alerts_created = newAlerts.Count, alerts = newAlerts });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Failed to check sprint progress for {sprintName}: {ex.Message}");
    }
});

app.MapPost("/api/notifications/acknowledge", (
    [FromBody] AcknowledgeNotificationRequest request,
    NotificationService notificationService) =>
{
    try
    {
        var success = notificationService.AcknowledgeNotification(request.AlertId);
        if (success)
        {
            return Results.Ok(new { success = true, message = "Notification acknowledged successfully" });
        }
        else
        {
            return Results.NotFound(new { success = false, message = "Notification not found" });
        }
    }
    catch (Exception ex)
    {
        return Results.Problem($"Failed to acknowledge notification: {ex.Message}");
    }
});

app.MapGet("/api/notifications/settings", (NotificationService notificationService) =>
{
    try
    {
        var response = notificationService.GetActiveNotifications();
        return Results.Ok(response.Settings);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Failed to get notification settings: {ex.Message}");
    }
});

app.MapPost("/api/notifications/settings", (
    [FromBody] UpdateNotificationSettingsRequest request,
    NotificationService notificationService) =>
{
    try
    {
        notificationService.UpdateSettings(request);
        return Results.Ok(new { success = true, message = "Settings updated successfully" });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Failed to update notification settings: {ex.Message}");
    }
});

app.MapPost("/api/notifications/cleanup", (NotificationService notificationService) =>
{
    try
    {
        notificationService.CleanupAcknowledgedNotifications();
        return Results.Ok(new { success = true, message = "Acknowledged notifications cleaned up" });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Failed to cleanup notifications: {ex.Message}");
    }
});

// Workload API endpoints for US-004
app.MapGet("/api/workload/{sprintName}", async (string sprintName, WorkloadService workloadService) =>
{
    try
    {
        var distribution = await workloadService.GetWorkloadDistributionAsync(sprintName);
        return Results.Ok(distribution);
    }
    catch (ArgumentException ex)
    {
        return Results.NotFound(ex.Message);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Failed to get workload distribution: {ex.Message}");
    }
});

app.MapGet("/api/workload/{sprintName}/alerts", async (string sprintName, WorkloadService workloadService) =>
{
    try
    {
        var alerts = await workloadService.GetWorkloadAlertsAsync(sprintName);
        return Results.Ok(new { alerts });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Failed to get workload alerts: {ex.Message}");
    }
});

app.MapGet("/api/workload/{sprintName}/trend", async (string sprintName, WorkloadService workloadService) =>
{
    try
    {
        var trend = await workloadService.GetWorkloadTrendAsync(sprintName);
        return Results.Ok(trend);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Failed to get workload trend: {ex.Message}");
    }
});

app.MapPost("/api/workload/{sprintName}/refresh", async (string sprintName, WorkloadService workloadService) =>
{
    try
    {
        workloadService.ClearCache(sprintName);
        var distribution = await workloadService.GetWorkloadDistributionAsync(sprintName);
        return Results.Ok(new { success = true, distribution });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Failed to refresh workload data: {ex.Message}");
    }
});

app.Run();

// 讓測試可以存取 Program 類別
public partial class Program { }
