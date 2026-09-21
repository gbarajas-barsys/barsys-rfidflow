namespace Barsys.RfidFlow.Application.Abstractions;

public interface IRfidPrinterService
{
    Task PrintAsync(
        string ip,
        int port,
        string zpl,
        CancellationToken ct);
}