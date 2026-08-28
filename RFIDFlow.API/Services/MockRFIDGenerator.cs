using Microsoft.Extensions.Hosting;
using RFIDFlow.API.Models;

namespace RFIDFlow.API.Services;

public class MockRFIDGenerator : BackgroundService
{
    private readonly RFIDReadBuffer _buffer;
    private readonly PresenceService _presence;

    public MockRFIDGenerator(
        RFIDReadBuffer buffer,
        PresenceService presence)
    {
        _buffer = buffer;
        _presence = presence;

        Console.WriteLine(
            "CONSTRUCTOR MOCK RFID"
        );
    }

    public override Task StartAsync(
        CancellationToken cancellationToken)
    {
        Console.WriteLine(
            "STARTASYNC MOCK RFID"
        );

        return base.StartAsync(
            cancellationToken
        );
    }

    protected override async Task ExecuteAsync(
        CancellationToken stoppingToken)
    {
        Console.WriteLine(
            "EXECUTEASYNC MOCK RFID"
        );

        while (
            !stoppingToken.IsCancellationRequested
        )
        {
            var epcs = new[]
{
    "E280699955555555",
    "E280699998765432",
    "E280699942327238"
};

var read = new RFIDRead
{
    EPC =
        epcs[
            Random.Shared.Next(
                0,
                epcs.Length
            )
        ],
    Timestamp =
        DateTime.UtcNow
};

            Console.WriteLine(
                $"READ GENERATED: {read.EPC}"
            );

            _buffer.Add(read);

            _presence.RegisterRead(
                read.EPC
            );

            await Task.Delay(
                3000,
                stoppingToken
            );
        }
    }
}