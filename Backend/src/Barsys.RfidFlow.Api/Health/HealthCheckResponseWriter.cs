using System.Text.Json;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace Barsys.RfidFlow.Api.Health;

public static class HealthCheckResponseWriter
{
    public static Task WriteJsonResponse(HttpContext context, HealthReport report)
    {
        context.Response.ContentType = "application/json";
        var payload = new
        {
            status = report.Status.ToString(),
            totalDurationMs = report.TotalDuration.TotalMilliseconds,
            checks = report.Entries.Select(entry => new
            {
                name = entry.Key,
                status = entry.Value.Status.ToString(),
                description = entry.Value.Description,
                durationMs = entry.Value.Duration.TotalMilliseconds,
                error = entry.Value.Exception?.Message
            }),
            timestamp = DateTimeOffset.UtcNow
        };
        return context.Response.WriteAsync(JsonSerializer.Serialize(payload, new JsonSerializerOptions { WriteIndented = true }));
    }
}
