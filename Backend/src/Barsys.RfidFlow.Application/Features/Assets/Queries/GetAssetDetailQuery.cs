using Barsys.RfidFlow.Application.Abstractions;
using Barsys.RfidFlow.Application.Common;
using Barsys.RfidFlow.Domain.Entities;
using FluentValidation;
using MediatR;

namespace Barsys.RfidFlow.Application.Features.Assets.Queries;

public sealed record GetAssetDetailQuery(
    Guid AssetId
) : IRequest<Asset?>;

public sealed class GetAssetDetailQueryValidator
    : AbstractValidator<GetAssetDetailQuery>
{
    public GetAssetDetailQueryValidator()
    {
        RuleFor(x => x.AssetId)
            .NotEmpty();
    }
}

public sealed class GetAssetDetailQueryHandler
    : IRequestHandler<GetAssetDetailQuery, Asset?>
{
    private readonly IRepository<Asset> _assets;
    private readonly ITenantContextAccessor _tenant;

    public GetAssetDetailQueryHandler(
        IRepository<Asset> assets,
        ITenantContextAccessor tenant)
    {
        _assets = assets;
        _tenant = tenant;
    }

    public Task<Asset?> Handle(
        GetAssetDetailQuery request,
        CancellationToken cancellationToken)
    {
        return _assets.GetAsync(
            _tenant.Current.TenantId,
            request.AssetId,
            cancellationToken);
    }
}