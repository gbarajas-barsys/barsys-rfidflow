using LlrpSdk;
using LlrpSdk.Extensions.Impinj;

using Microsoft.Extensions.Configuration;

using RFIDFlow.API.Models;

using Microsoft.Extensions.Options;

using ReaderConfig =
    RFIDFlow.API.Models.ReaderConfiguration;

namespace RFIDFlow.API.Services.Readers;

public class ImpinjR700Provider
    : IRFIDReaderProvider
{
    private readonly string _readerIp;

    private readonly int _readerPort;

    private readonly string _readerName;

    private Task? _inventoryTask;

    private CancellationTokenSource?
        _cts;

    public event Action<RFIDRead>?
        ReadReceived;

    public ImpinjR700Provider(
    IOptions<RFIDOptions> options
)
{
    var reader =
        options.Value.Readers
            .FirstOrDefault();

    if (reader is null)
    {
        throw new InvalidOperationException(
            "No RFID readers configured."
        );
    }

    _readerName =
        reader.Name;

    _readerIp =
        reader.IpAddress;

    _readerPort =
        reader.Port;
}

public ImpinjR700Provider(
    ReaderConfig reader
)
{
    _readerName =
        reader.Name;

    _readerIp =
        reader.IpAddress;

    _readerPort =
        reader.Port;
}

    public async Task ConnectAsync()
    {
        Console.WriteLine(
            $"Connecting to Impinj R700 {_readerIp}:{_readerPort}"
        );

        _cts =
            new CancellationTokenSource();

        _inventoryTask =
            Task.Run(
                () =>
                    RunInventoryAsync(
                        _cts.Token
                    )
            );

        await Task.CompletedTask;
    }

    public async Task DisconnectAsync()
    {
        Console.WriteLine(
            "Disconnecting Impinj R700"
        );

        _cts?.Cancel();

        if (_inventoryTask
            is not null)
        {
            await _inventoryTask;
        }
        IsConnected = false;
    }

    public bool IsConnected
    {
        get;
        private set;
    }

    public DateTime?
        LastSeenUtc
    {
        get;
        private set;
    }

    public string ReaderName
        => _readerName;

    public string ReaderIp
        => _readerIp;
        
    private async Task RunInventoryAsync(
        CancellationToken token)
    {
        try
        {
            await using var reader =
                LlrpReader
                    .CreateBuilder(
                        _readerIp
                    )
                    .WithPort(
                        _readerPort
                    )
                    .UseImpinj()
                    .Build();

            Console.WriteLine(
                "LLRP Connecting..."
            );

            await reader
                .ConnectAsync();

            IsConnected = true;

            Console.WriteLine(
                "LLRP Connected"
            );

            var defaultSettings =
                await reader
                    .GetDefaultSettingsAsync();

            await reader
                .ApplySettingsAsync(
                    defaultSettings.Settings
                );

            Console.WriteLine(
                "Reader Settings Applied"
            );

            await using var session =
                await reader
                    .StartInventoryAsync();

            Console.WriteLine(
                "Inventory Started"
            );

            await foreach (
                var report in
                session
                    .ReadReportsAsync()
                    .WithCancellation(
                        token
                    )
            )
            {
                var epc =
                    report.EpcHex;

                if (
                    string.IsNullOrWhiteSpace(
                        epc
                    )
                )
                {
                    continue;
                }

                var read =
                    new RFIDRead
                    {
                        EPC = epc,

                        Timestamp =
                            DateTime.UtcNow,

                        ReaderName =
                            _readerName,

                        ReaderIp =
                            _readerIp
                    };
                LastSeenUtc =
                DateTime.UtcNow;

                ReadReceived?.Invoke(
                    read
                );

                Console.WriteLine(
                    $"[{_readerName}] TAG: {epc}"
                );
            }
        }
        catch (
            OperationCanceledException
        )
        {
            IsConnected = false;

            Console.WriteLine(
                "Inventory stopped"
            );
        }
        catch (
            Exception ex
        )
        {
            IsConnected = false;

            Console.WriteLine(
                $"R700 ERROR: {ex}"
            );
        }
    }
}