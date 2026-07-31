using Barsys.RfidFlow.Api.Extensions;
using Barsys.RfidFlow.Api.Health;
using Barsys.RfidFlow.Api.Middleware;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Serilog;

Log.Logger = new LoggerConfiguration()
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    builder.AddRfidFlowObservability();
    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();
    builder.Services.AddProblemDetails();
    builder.Services.AddRfidFlowServices(builder.Configuration);

    var app = builder.Build();

    app.UseMiddleware<CorrelationIdMiddleware>();
    app.UseMiddleware<Barsys.RfidFlow.Api.Infrastructure.ValidationExceptionMiddleware>();
    app.UseMiddleware<AuditLoggingMiddleware>();

    app.UseExceptionHandler();
    app.UseStatusCodePages();
    app.UseSerilogRequestLogging(options =>
    {
        options.MessageTemplate = "HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000} ms";
        options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
        {
            diagnosticContext.Set("CorrelationId", httpContext.TraceIdentifier);
            diagnosticContext.Set("TenantId", httpContext.Request.Headers.TryGetValue("X-Tenant-Id", out var tenant) ? tenant.ToString() : "unknown");
            diagnosticContext.Set("UserAgent", httpContext.Request.Headers.UserAgent.ToString());
        };
    });

    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Barsys RFIDFlow API v2");
        options.DocumentTitle = "Barsys RFIDFlow API";
    });
    app.UseHttpsRedirection();

    app.UseCors(builder =>
    {
        builder
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });

    app.UseAuthentication();
    app.UseAuthorization();

    app.MapControllers();
    app.MapPrometheusScrapingEndpoint("/metrics");
    app.MapHealthChecks("/health/live", new HealthCheckOptions
    {
        Predicate = check => check.Tags.Contains("live"),
        ResponseWriter = HealthCheckResponseWriter.WriteJsonResponse
    });
    app.MapHealthChecks("/health/ready", new HealthCheckOptions
    {
        Predicate = check => check.Tags.Contains("ready") || check.Tags.Contains("db"),
        ResponseWriter = HealthCheckResponseWriter.WriteJsonResponse
    });
    app.MapGet("/v2/system/health", () => Results.Ok(new { status = "healthy", timestamp = DateTimeOffset.UtcNow }));
    app.MapGet("/v2/system/version", () => Results.Ok(new { apiVersion = "2.0.0", build = "observability", environment = app.Environment.EnvironmentName }));

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Barsys RFIDFlow API terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}

public partial class Program { }
