using RFIDFlow.API.Models;

namespace RFIDFlow.API.Services.Readers;

public class MockRFIDProvider
    : IRFIDReaderProvider
{
    private Timer? _timer;

    public event Action<RFIDRead>?
        ReadReceived;

    private readonly string[] _epcs =
    {
        "E280699955555555",
        "E280699998765432",
        "E280699942327238"
    };

    public Task ConnectAsync()
    {
        _timer = new Timer(
            GenerateRead,
            null,
            0,
            3000
        );

        return Task.CompletedTask;
    }

    public Task DisconnectAsync()
    {
        _timer?.Dispose();

        return Task.CompletedTask;
    }

    private void GenerateRead(
        object? state)
    {
        var read =
            new RFIDRead
            {
                EPC =
                    _epcs[
                        Random.Shared.Next(
                            _epcs.Length
                        )
                    ],
                Timestamp =
                    DateTime.UtcNow
            };

        ReadReceived?.Invoke(
            read
        );
    }
}