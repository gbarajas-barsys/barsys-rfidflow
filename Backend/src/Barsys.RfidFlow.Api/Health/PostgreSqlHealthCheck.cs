using Microsoft.Extensions.Diagnostics.HealthChecks;
using Npgsql;

namespace Barsys.RfidFlow.Api.Health;

public sealed class PostgreSqlHealthCheck : IHealthCheck
{
    private readonly IConfiguration _configuration;
    public PostgreSqlHealthCheck(IConfiguration configuration) => _configuration = configuration;

    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        var connectionString = _configuration.GetConnectionString("Postgres");
        if (string.IsNullOrWhiteSpace(connectionString))
            return HealthCheckResult.Degraded("PostgreSQL connection string is not configured.");

        try
        {
            await using var connection = new NpgsqlConnection(connectionString);
            await connection.OpenAsync(cancellationToken);
            await using var command = new NpgsqlCommand("SELECT 1", connection);
            var result = await command.ExecuteScalarAsync(cancellationToken);
            return Convert.ToInt32(result) == 1
                ? HealthCheckResult.Healthy("PostgreSQL is reachable.")
                : HealthCheckResult.Unhealthy("Unexpected PostgreSQL health query result.");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("PostgreSQL health check failed.", ex);
        }
    }
}
