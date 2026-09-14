using Barsys.RfidFlow.Application.Abstractions;
using Barsys.RfidFlow.Application.Common;
using Barsys.RfidFlow.Domain.Entities;
using MediatR;

namespace Barsys.RfidFlow.Application.Features.Assets.Queries;

public sealed record GetAssetsQuery(
    int Page = 1,
    int PageSize = 100
) : IRequest<IReadOnlyList<Asset>>;

public sealed class GetAssetsQueryHandler
    : IRequestHandler<GetAssetsQuery, IReadOnlyList<Asset>>
{
    private readonly IRepository<Asset> _assets;
    private readonly ITenantContextAccessor _tenant;

    public GetAssetsQueryHandler(
        IRepository<Asset> assets,
        ITenantContextAccessor tenant)
    {
        _assets = assets;
        _tenant = tenant;
    }

    public Task<IReadOnlyList<Asset>> Handle(
        GetAssetsQuery request,
        CancellationToken cancellationToken)
    {
        return _assets.ListAsync(
            _tenant.Current.TenantId,
            request.Page,
            request.PageSize,
            cancellationToken);
    }
}