using Barsys.RfidFlow.Api.Health;
using Barsys.RfidFlow.Api.Observability;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using Serilog;
using Serilog.Exceptions;

namespace Barsys.RfidFlow.Api.Extensions;

public static class ObservabilityExtensions
{
    public static WebApplicationBuilder AddRfidFlowObservability(this WebApplicationBuilder builder)
    {
        builder.Host.UseSerilog((context, services, loggerConfiguration) => loggerConfiguration
            .ReadFrom.Configuration(context.Configuration)
            .ReadFrom.Services(services)
            .Enrich.FromLogContext()
            .Enrich.WithMachineName()
            .Enrich.WithThreadId()
            .Enrich.WithExceptionDetails());

        builder.Services.AddSingleton<RfidFlowMetrics>();
        builder.Services.AddHealthChecks()
            .AddCheck<PostgreSqlHealthCheck>("postgresql", tags: new[] { "db", "ready" })
            .AddCheck("self", () => Microsoft.Extensions.Diagnostics.HealthChecks.HealthCheckResult.Healthy("API process is running."), tags: new[] { "live" });

        var otel = builder.Configuration.GetSection("OpenTelemetry");
        var serviceName = otel.GetValue<string>("ServiceName") ?? TelemetryConstants.ServiceName;
        var serviceVersion = otel.GetValue<string>("ServiceVersion") ?? TelemetryConstants.ServiceVersion;
        var enableConsoleExporter = otel.GetValue<bool>("EnableConsoleExporter");
        var enableOtlpExporter = otel.GetValue<bool>("EnableOtlpExporter");

        builder.Services.AddOpenTelemetry()
            .ConfigureResource(resource => resource
                .AddService(serviceName: serviceName, serviceVersion: serviceVersion)
                .AddAttributes(new Dictionary<string, object>
                {
                    ["deployment.environment"] = builder.Environment.EnvironmentName,
                    ["service.namespace"] = "Barsys"
                }))
            .WithTracing(tracing =>
            {
                tracing
                    .AddSource(TelemetryConstants.ActivitySourceName)
                    .AddAspNetCoreInstrumentation(options =>
                    {
                        options.RecordException = true;
                        options.Filter = context => !context.Request.Path.StartsWithSegments("/metrics") && !context.Request.Path.StartsWithSegments("/swagger");
                    })
                    .AddHttpClientInstrumentation();

                if (enableConsoleExporter) tracing.AddConsoleExporter();
                if (enableOtlpExporter) tracing.AddOtlpExporter();
            })
            .WithMetrics(metrics =>
            {
                metrics
                    .AddMeter(TelemetryConstants.MeterName)
                    .AddAspNetCoreInstrumentation()
                    .AddHttpClientInstrumentation()
                    .AddRuntimeInstrumentation()
                    .AddPrometheusExporter();

                if (enableConsoleExporter) metrics.AddConsoleExporter();
                if (enableOtlpExporter) metrics.AddOtlpExporter();
            });

        return builder;
    }
}
