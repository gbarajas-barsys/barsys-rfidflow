using System.Net.Sockets;
using System.Text;

using Barsys.RfidFlow.Application.Abstractions;

namespace Barsys.RfidFlow.Infrastructure.Services;

public sealed class RfidPrinterService
    : IRfidPrinterService
{
    public async Task PrintAsync(
        string ip,
        int port,
        string zpl,
        CancellationToken ct)
    {
        using var client =
            new TcpClient();

        await client.ConnectAsync(
            ip,
            port,
            ct);

        using var stream =
            client.GetStream();

        var bytes =
            Encoding.ASCII.GetBytes(
                zpl
            );

        await stream.WriteAsync(
            bytes,
            ct);

        await stream.FlushAsync(
            ct);
    }
}