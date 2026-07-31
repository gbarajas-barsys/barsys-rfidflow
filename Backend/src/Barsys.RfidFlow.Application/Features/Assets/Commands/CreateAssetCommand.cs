using Barsys.RfidFlow.Application.Abstractions;
using Barsys.RfidFlow.Application.Common;
using Barsys.RfidFlow.Domain.Entities;
using Barsys.RfidFlow.Domain.Enums;
using FluentValidation;
using MediatR;

namespace Barsys.RfidFlow.Application.Features.Assets.Commands;

public sealed record CreateAssetCommand(
    string AssetNumber,
    string Name,
    string? Description,
    Guid? LocationId,
    string? SerialNumber,
    AssetCriticality Criticality = AssetCriticality.Medium) : IRequest<Asset>;

public sealed class CreateAssetCommandValidator : AbstractValidator<CreateAssetCommand>
{
    public CreateAssetCommandValidator()
    {
        RuleFor(x => x.AssetNumber).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Description).MaximumLength(4000);
        RuleFor(x => x.SerialNumber).MaximumLength(120);
    }
}

public sealed class CreateAssetCommandHandler : IRequestHandler<CreateAssetCommand, Asset>
{
    private readonly IRepository<Asset> _assets;
    private readonly ITenantContextAccessor _tenant;
    public CreateAssetCommandHandler(IRepository<Asset> assets, ITenantContextAccessor tenant)
    {
        _assets = assets;
        _tenant = tenant;
    }

    public Task<Asset> Handle(CreateAssetCommand request, CancellationToken cancellationToken)
    {
        var asset = new Asset
        {
            TenantId = _tenant.Current.TenantId,
            AssetNumber = request.AssetNumber.Trim(),
            Name = request.Name.Trim(),
            Description = request.Description,
            LocationId = request.LocationId,
            SerialNumber = request.SerialNumber,
            Criticality = request.Criticality,
            Status = AssetStatus.Available
        };
        return _assets.AddAsync(asset, cancellationToken);
    }
}
