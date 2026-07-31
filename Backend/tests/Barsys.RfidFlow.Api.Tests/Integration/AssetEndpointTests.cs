using System.Net;
using System.Net.Http.Json;
using Barsys.RfidFlow.Api.Tests.Infrastructure;
using Xunit;

namespace Barsys.RfidFlow.Api.Tests.Integration;

public sealed class AssetEndpointTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;
    public AssetEndpointTests(CustomWebApplicationFactory factory) => _factory = factory;

    [Fact]
    public async Task CreateAsset_Returns_Created()
    {
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Add("X-Tenant-Id", TestConstants.TenantId.ToString());

        var response = await client.PostAsJsonAsync("/v2/assets", new
        {
            assetNumber = "IT-100",
            name = "Laptop de integración",
            description = "Prueba automatizada",
            locationId = (Guid?)null,
            serialNumber = "SN-IT-100",
            criticality = "High"
        });

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    [Fact]
    public async Task CreateAsset_InvalidPayload_Returns_BadRequest()
    {
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Add("X-Tenant-Id", TestConstants.TenantId.ToString());

        var response = await client.PostAsJsonAsync("/v2/assets", new
        {
            assetNumber = "",
            name = "",
            description = "Prueba automatizada"
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}
