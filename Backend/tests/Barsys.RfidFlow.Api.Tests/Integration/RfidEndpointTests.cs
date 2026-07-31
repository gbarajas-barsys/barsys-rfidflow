using System.Net;
using System.Net.Http.Json;
using Barsys.RfidFlow.Api.Tests.Infrastructure;
using Xunit;

namespace Barsys.RfidFlow.Api.Tests.Integration;

public sealed class RfidEndpointTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;
    public RfidEndpointTests(CustomWebApplicationFactory factory) => _factory = factory;

    [Fact]
    public async Task IngestReadEvent_Returns_Accepted()
    {
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Add("X-Tenant-Id", TestConstants.TenantId.ToString());
        var now = DateTimeOffset.UtcNow;

        var response = await client.PostAsJsonAsync("/v2/rfid/read-events", new
        {
            epc = "E2000017221101441890ABCD",
            readerId = Guid.NewGuid(),
            antennaId = (Guid?)null,
            locationId = (Guid?)null,
            rssi = -58.2m,
            readCount = 1,
            firstSeenAt = now,
            lastSeenAt = now.AddSeconds(1)
        });

        Assert.Equal(HttpStatusCode.Accepted, response.StatusCode);
    }

    [Fact]
    public async Task IngestReadEvent_Invalid_Returns_BadRequest()
    {
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Add("X-Tenant-Id", TestConstants.TenantId.ToString());
        var now = DateTimeOffset.UtcNow;

        var response = await client.PostAsJsonAsync("/v2/rfid/read-events", new
        {
            epc = "",
            readerId = Guid.Empty,
            readCount = 0,
            firstSeenAt = now,
            lastSeenAt = now.AddSeconds(-1)
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}
