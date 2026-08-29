using Microsoft.Extensions.Hosting;
using RFIDFlow.API.Services.Readers;

namespace RFIDFlow.API.Services;

public class ReaderHostedService
    : IHostedService
{
    private readonly
        MultiReaderProvider
        _multiReaderProvider;

    private readonly
        RFIDReadBuffer
        _buffer;

    private readonly
        PresenceService
        _presence;

    private readonly 
        BarsysApiClient 
        _barsysApi;

    private readonly 
        Dictionary<string, DateTime>
        _lastSent = new();

    private readonly
        ReaderRegistry _registry;

    public ReaderHostedService(
        MultiReaderProvider multiReaderProvider,
        ReaderRegistry registry,
        RFIDReadBuffer buffer,
        PresenceService presence,
        BarsysApiClient barsysApi)
    {
        _multiReaderProvider = multiReaderProvider;

        _registry = registry;

        _buffer = buffer;

        _presence = presence;

        _barsysApi = barsysApi;
    }

    public async Task StartAsync(
        CancellationToken cancellationToken)
    {
        Console.WriteLine(
            $"Configured Readers: {_registry.GetReaderCount()}"
        );

        foreach (
            var configuredReader
            in _registry.GetReaders()
        )
        {
            Console.WriteLine(
                $"Reader: {configuredReader.Name}"
            );

            Console.WriteLine(
                $"IP: {configuredReader.IpAddress}"
            );
        }

        Console.WriteLine(
            $"Configured Providers: {_multiReaderProvider
                .Providers
                .Count}"
        );

        foreach (
            var reader
            in _multiReaderProvider
                .Providers
        )
        {
            reader.ReadReceived +=
                OnReadReceived;

            await reader.ConnectAsync();
        }
    }
    
    public async Task StopAsync(
        CancellationToken
            cancellationToken)
    {
        foreach (
            var reader
            in _multiReaderProvider
                .Providers
        )
        {
            await reader
                .DisconnectAsync();
        }
    }

    private async void OnReadReceived(
        Models.RFIDRead read)
    {
        _buffer.Add(read);

        _presence.RegisterRead(
        read.EPC
        );

        try
        {
            if (
                _lastSent.TryGetValue(
                    read.EPC,
                    out var lastSeen
                ) &&
                DateTime.UtcNow - lastSeen <
                    TimeSpan.FromSeconds(5)
            )
            {
                return;
            }

            _lastSent[read.EPC] =
                DateTime.UtcNow;
            
            await _barsysApi.SendReadAsync(
                read.EPC
            );

            Console.WriteLine(
                $"RFID EVENT SENT: {read.EPC}"
            );
        }
        catch (Exception ex)
        {
            Console.WriteLine(
                $"ERROR SENDING RFID EVENT: {ex.Message}"
            );
        }

        Console.WriteLine(
            $"READ RECEIVED: {read.EPC}"
        );
    }
}