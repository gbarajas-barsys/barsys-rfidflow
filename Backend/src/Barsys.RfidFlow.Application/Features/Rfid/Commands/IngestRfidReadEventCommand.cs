using Barsys.RfidFlow.Application.Abstractions;
using Barsys.RfidFlow.Application.Common;
using Barsys.RfidFlow.Application.Dtos;
using Barsys.RfidFlow.Application.Rules;
using Barsys.RfidFlow.Domain.Entities;
using FluentValidation;
using MediatR;

namespace Barsys.RfidFlow.Application.Features.Rfid.Commands;

public sealed record IngestRfidReadEventCommand(
    string Epc,
    Guid ReaderId,
    string? ReaderSerial,
    string? ReaderName,
    string? ReaderIp,
    Guid? AntennaId,
    Guid? LocationId,
    decimal? Rssi,
    int ReadCount,
    DateTimeOffset FirstSeenAt,
    DateTimeOffset LastSeenAt
) : IRequest<IngestionAck>;

public sealed class IngestRfidReadEventCommandValidator : AbstractValidator<IngestRfidReadEventCommand>
{
    public IngestRfidReadEventCommandValidator()
    {
        RuleFor(x => x.Epc).Must(BusinessRules.IsValidEpc).WithMessage("EPC inválido.");
        RuleFor(x => x.ReaderId).NotEmpty();
        RuleFor(x => x.ReadCount).GreaterThan(0);
        RuleFor(x => x.LastSeenAt).GreaterThanOrEqualTo(x => x.FirstSeenAt);
    }
}

public sealed class IngestRfidReadEventCommandHandler : IRequestHandler<IngestRfidReadEventCommand, IngestionAck>
{
    private readonly IRepository<RfidReadEvent> _events;
    private readonly ITenantContextAccessor _tenant;
    private readonly IReaderResolver _readerResolver;
        public IngestRfidReadEventCommandHandler(
            IRepository<RfidReadEvent> events,
            ITenantContextAccessor tenant,
            IReaderResolver readerResolver)
        {
            _events = events;
            _tenant = tenant;
            _readerResolver = readerResolver;
        }

    public async Task<IngestionAck> Handle(IngestRfidReadEventCommand request, CancellationToken cancellationToken)
    {
        var cutoff = DateTimeOffset.UtcNow.AddMinutes(-5);

        var exists = await _events.ExistsRecentReadAsync(
            _tenant.Current.TenantId,
            request.Epc.Trim(),
            cutoff,
            cancellationToken);

        if (exists)
        {
            return new IngestionAck(
                true,
                Guid.Empty,
                "Lectura duplicada ignorada");
        }

        var resolvedReader =
            await _readerResolver.ResolveAsync(
                _tenant.Current.TenantId,
                request.ReaderSerial,
                request.ReaderIp,
                request.ReaderName,
                cancellationToken);

        Console.WriteLine(
            $"ReaderSerial={request.ReaderSerial}");

        Console.WriteLine(
            $"ReaderIp={request.ReaderIp}");

        Console.WriteLine(
            $"ReaderName={request.ReaderName}");

        Console.WriteLine(
            $"ResolvedReader={resolvedReader?.Name}");

        var readerId =
            resolvedReader?.Id
            ?? request.ReaderId;

        var locationId =
            resolvedReader?.LocationId
            ?? request.LocationId;

        var entity = new RfidReadEvent
        {
            TenantId =
                _tenant.Current.TenantId,

            Epc =
                request.Epc.Trim(),

            ReaderId =
                readerId,

            AntennaId =
                request.AntennaId,

            LocationId =
                locationId,

            Rssi =
                request.Rssi,

            ReadCount =
                request.ReadCount,

            FirstSeenAt =
                request.FirstSeenAt,

            LastSeenAt =
                request.LastSeenAt
        };

        var created =
            await _events.AddAsync(
                entity,
                cancellationToken);

        return new IngestionAck(
            true,
            created.Id,
            "Evento RFID aceptado.");
    }
}
