using System.Net;
using Barsys.RfidFlow.Api.Tests.Infrastructure;
using Xunit;

namespace Barsys.RfidFlow.Api.Tests;

public sealed class HealthTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;
    public HealthTests(CustomWebApplicationFactory factory) => _factory = factory;

    [Fact]
    public async Task Health_ReturnsOk()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/v2/system/health");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Version_ReturnsOk()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/v2/system/version");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}
