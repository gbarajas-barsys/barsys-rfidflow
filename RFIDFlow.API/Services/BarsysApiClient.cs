using System.Net.Http.Json;

namespace RFIDFlow.API.Services;

public sealed class BarsysApiClient
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public BarsysApiClient(
        HttpClient httpClient,
        IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task SendReadAsync(string epc)
    {
        var url =
            $"{_configuration["BarsysApi:BaseUrl"]}/v2/rfid/read-events";

        var payload = new
        {
            epc,
            readerId =
                Guid.Parse("a3c80c66-aba8-4bf5-b8d0-a89804161fc5"),
            antennaId = (Guid?)null,
            locationId =
                Guid.Parse("723d1c96-4ed0-4808-af9b-b9f97246e75c"),
            rssi = 0,
            readCount = 1,
            firstSeenAt = DateTimeOffset.UtcNow,
            lastSeenAt = DateTimeOffset.UtcNow
        };

        var response =
            await _httpClient.PostAsJsonAsync(
                url,
                payload);

        response.EnsureSuccessStatusCode();
    }
}