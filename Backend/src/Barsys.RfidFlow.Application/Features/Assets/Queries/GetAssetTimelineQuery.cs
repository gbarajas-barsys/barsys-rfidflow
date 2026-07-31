using Barsys.RfidFlow.Application.Common;
using Barsys.RfidFlow.Application.Dtos;
using FluentValidation;
using MediatR;

namespace Barsys.RfidFlow.Application.Features.Assets.Queries;

public sealed record GetAssetTimelineQuery(Guid AssetId, DateTimeOffset? From, DateTimeOffset? To) : IRequest<IReadOnlyList<TimelineEventDto>>;

public sealed record TimelineEventDto(DateTimeOffset OccurredAt, string EventType, string Title, string? Description, string Source);

public sealed class GetAssetTimelineQueryValidator : AbstractValidator<GetAssetTimelineQuery>
{
    public GetAssetTimelineQueryValidator()
    {
        RuleFor(x => x.AssetId).NotEmpty();
        RuleFor(x => x).Must(x => x.From is null || x.To is null || x.From <= x.To).WithMessage("El rango de fechas es inválido.");
    }
}

public sealed class GetAssetTimelineQueryHandler : IRequestHandler<GetAssetTimelineQuery, IReadOnlyList<TimelineEventDto>>
{
    public Task<IReadOnlyList<TimelineEventDto>> Handle(GetAssetTimelineQuery request, CancellationToken cancellationToken)
    {
        IReadOnlyList<TimelineEventDto> events = new[]
        {
            new TimelineEventDto(DateTimeOffset.UtcNow, "asset.timeline.generated", "Timeline generada", "Placeholder para unir auditoría, movimientos y lecturas RFID.", "application")
        };
        return Task.FromResult(events);
    }
}
