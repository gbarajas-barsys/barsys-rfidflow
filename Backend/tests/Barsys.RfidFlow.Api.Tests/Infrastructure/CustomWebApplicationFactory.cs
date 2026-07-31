using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;

namespace Barsys.RfidFlow.Api.Tests.Infrastructure;

public sealed class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.ConfigureAppConfiguration((_, config) =>
        {
            var values = new Dictionary<string, string?>
            {
                ["UseInMemoryRepository"] = "true",
                ["ConnectionStrings:Postgres"] = "Host=localhost;Port=5432;Database=rfidflow_tests;Username=rfidflow;Password=rfidflow"
            };
            config.AddInMemoryCollection(values);
        });
    }
}
