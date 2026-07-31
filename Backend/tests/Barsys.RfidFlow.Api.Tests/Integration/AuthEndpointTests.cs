using System.Net;
using System.Net.Http.Json;
using Barsys.RfidFlow.Api.Tests.Infrastructure;
using Xunit;

namespace Barsys.RfidFlow.Api.Tests.Integration;

public sealed class AuthEndpointTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;
    public AuthEndpointTests(CustomWebApplicationFactory factory) => _factory = factory;

    [Fact]
    public async Task Login_Returns_Token()
    {
        var client = _factory.CreateClient();
        var response = await client.PostAsJsonAsync("/v2/auth/login", new { email = "admin@barsys.local", password = "dev", tenantCode = "barsys-demo" });
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var json = await response.Content.ReadAsStringAsync();
        Assert.Contains("dev-access-token", json);
    }
}
