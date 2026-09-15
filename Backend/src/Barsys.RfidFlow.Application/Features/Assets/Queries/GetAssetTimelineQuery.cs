using Barsys.RfidFlow.Application.Abstractions;
using Barsys.RfidFlow.Application.Common;
using Barsys.RfidFlow.Domain.Entities;
using FluentValidation;
using MediatR;

namespace Barsys.RfidFlow.Application.Features.Assets.Queries;

public sealed record GetAssetTimelineQuery(
    Guid AssetId,
    DateTimeOffset? From,
    DateTimeOffset? To
) : IRequest<IReadOnlyList<TimelineEventDto>>;

public sealed record TimelineEventDto(
    DateTimeOffset OccurredAt,
    string EventType,
    string Title,
    string? Description,
    string Source);

public sealed class GetAssetTimelineQueryValidator
    : AbstractValidator<GetAssetTimelineQuery>
{
    public GetAssetTimelineQueryValidator()
    {
        RuleFor(x => x.AssetId)
            .NotEmpty();

        RuleFor(x => x)
            .Must(x =>
                x.From is null ||
                x.To is null ||
                x.From <= x.To)
            .WithMessage(
                "El rango de fechas es inválido.");
    }
}

public sealed class GetAssetTimelineQueryHandler
    : IRequestHandler<
        GetAssetTimelineQuery,
        IReadOnlyList<TimelineEventDto>>
{
    private readonly IRepository<Asset> _assets;
    private readonly ITenantContextAccessor _tenant;

    public GetAssetTimelineQueryHandler(
        IRepository<Asset> assets,
        ITenantContextAccessor tenant)
    {
        _assets = assets;
        _tenant = tenant;
    }

    public async Task<IReadOnlyList<TimelineEventDto>>
        Handle(
            GetAssetTimelineQuery request,
            CancellationToken cancellationToken)
    {
        var asset =
            await _assets.GetAsync(
                _tenant.Current.TenantId,
                request.AssetId,
                cancellationToken);

        if (asset is null)
            return [];

        var timeline =
            new List<TimelineEventDto>();

        timeline.Add(
            new TimelineEventDto(
                asset.CreatedAt,
                "asset.created",
                "Activo creado",
                $"Activo {asset.AssetNumber} registrado en RFIDFlow.",
                "asset"));

        if (!string.IsNullOrWhiteSpace(asset.Epc))
        {
            timeline.Add(
                new TimelineEventDto(
                    asset.UpdatedAt,
                    "rfid.assigned",
                    "RFID asignado",
                    $"EPC {asset.Epc} asociado al activo.",
                    "rfid"));
        }

        timeline =
            timeline
                .OrderByDescending(
                    x => x.OccurredAt)
                .ToList();

        return timeline;
    }
}