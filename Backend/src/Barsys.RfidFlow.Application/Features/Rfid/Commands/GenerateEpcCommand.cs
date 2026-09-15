using MediatR;

namespace Barsys.RfidFlow.Application.Features.Rfid.Commands;

public sealed record GenerateEpcCommand(
    string Encoding
) : IRequest<GenerateEpcResponse>;

public sealed record GenerateEpcResponse(
    string Epc,
    string Encoding
);

public sealed class GenerateEpcCommandHandler
    : IRequestHandler<
        GenerateEpcCommand,
        GenerateEpcResponse>
{
    public Task<GenerateEpcResponse> Handle(
        GenerateEpcCommand request,
        CancellationToken cancellationToken)
    {
        var sequence =
            DateTimeOffset
                .UtcNow
                .ToUnixTimeMilliseconds();

        string epc =
            request.Encoding switch
            {
                "EPC_GEN2"
                    => $"EPC-{sequence}",

                "SGTIN"
                    => $"SGTIN-{sequence}",

                "GIAI"
                    => $"GIAI-{sequence}",

                _ => $"RFID-{sequence}"
            };

        return Task.FromResult(
            new GenerateEpcResponse(
                epc,
                request.Encoding
            )
        );
    }
}