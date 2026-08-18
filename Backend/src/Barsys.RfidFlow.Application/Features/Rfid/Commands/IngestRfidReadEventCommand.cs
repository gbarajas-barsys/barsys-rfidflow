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
    Guid? AntennaId,
    Guid? LocationId,
    decimal? Rssi,
    int ReadCount,
    DateTimeOffset FirstSeenAt,
    DateTimeOffset LastSeenAt) : IRequest<IngestionAck>;

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
        public IngestRfidReadEventCommandHandler(
    IRepository<RfidReadEvent> events,
    ITenantContextAccessor tenant)
{
    _events = events;
    _tenant = tenant;
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
        
        var entity = new RfidReadEvent
        {
            TenantId = _tenant.Current.TenantId,
            Epc = request.Epc.Trim(),
            ReaderId = request.ReaderId,
            AntennaId = request.AntennaId,
            LocationId = request.LocationId,
            Rssi = request.Rssi,
            ReadCount = request.ReadCount,
            FirstSeenAt = request.FirstSeenAt,
            LastSeenAt = request.LastSeenAt
        };
        var created = await _events.AddAsync(entity, cancellationToken);
        return new IngestionAck(true, created.Id, "Evento RFID aceptado.");
    }
}
