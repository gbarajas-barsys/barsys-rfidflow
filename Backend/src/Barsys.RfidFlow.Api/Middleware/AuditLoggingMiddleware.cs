using System.Diagnostics;

namespace Barsys.RfidFlow.Api.Middleware;

public sealed class AuditLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<AuditLoggingMiddleware> _logger;

    public AuditLoggingMiddleware(RequestDelegate next, ILogger<AuditLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var sw = Stopwatch.StartNew();
        try
        {
            await _next(context);
        }
        finally
        {
            sw.Stop();
            if (ShouldAudit(context))
            {
                _logger.LogInformation(
                    "Audit event: {Method} {Path} responded {StatusCode} in {ElapsedMs} ms",
                    context.Request.Method,
                    context.Request.Path.Value,
                    context.Response.StatusCode,
                    sw.Elapsed.TotalMilliseconds);
            }
        }
    }

    private static bool ShouldAudit(HttpContext context)
    {
        if (context.Request.Path.StartsWithSegments("/swagger")) return false;
        if (context.Request.Path.StartsWithSegments("/metrics")) return false;
        if (context.Request.Method.Equals("GET", StringComparison.OrdinalIgnoreCase) && context.Response.StatusCode < 400) return false;
        return true;
    }
}
