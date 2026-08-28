using RFIDFlow.API.Models;

namespace RFIDFlow.API.Services.Readers;

public interface IRFIDReaderProvider
{
    event Action<RFIDRead>? ReadReceived;

    Task ConnectAsync();

    Task DisconnectAsync();
}