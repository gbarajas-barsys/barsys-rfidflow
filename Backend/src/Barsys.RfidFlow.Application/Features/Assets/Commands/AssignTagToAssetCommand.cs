using Barsys.RfidFlow.Application.Abstractions;
using Barsys.RfidFlow.Application.Common;
using Barsys.RfidFlow.Application.Rules;
using Barsys.RfidFlow.Domain.Entities;
using Barsys.RfidFlow.Domain.Enums;
using FluentValidation;
using MediatR;

namespace Barsys.RfidFlow.Application.Features.Assets.Commands;

public sealed record AssignTagToAssetCommand(Guid AssetId, string Epc, string? Tid, bool OverwriteExisting = false) : IRequest<OperationResult<Asset>>;

public sealed class AssignTagToAssetCommandValidator : AbstractValidator<AssignTagToAssetCommand>
{
    public AssignTagToAssetCommandValidator()
    {
        RuleFor(x => x.AssetId).NotEmpty();
        RuleFor(x => x.Epc).Must(BusinessRules.IsValidEpc).WithMessage("EPC inválido o demasiado largo.");
        RuleFor(x => x.Tid).MaximumLength(128);
    }
}

public sealed class AssignTagToAssetCommandHandler : IRequestHandler<AssignTagToAssetCommand, OperationResult<Asset>>
{
    private readonly IRepository<Asset> _assets;
    private readonly IRepository<RfidTag> _tags;
    private readonly ITenantContextAccessor _tenant;

    public AssignTagToAssetCommandHandler(IRepository<Asset> assets, IRepository<RfidTag> tags, ITenantContextAccessor tenant)
    {
        _assets = assets;
        _tags = tags;
        _tenant = tenant;
    }

    public async Task<OperationResult<Asset>> Handle(AssignTagToAssetCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _tenant.Current.TenantId;
        var asset = await _assets.GetAsync(tenantId, request.AssetId, cancellationToken);
        if (asset is null) return OperationResult<Asset>.NotFound("Activo no encontrado.");
        if (!request.OverwriteExisting && !string.IsNullOrWhiteSpace(asset.Epc))
            return OperationResult<Asset>.Conflict("El activo ya tiene un tag asignado.");

        var updated = await _assets.UpdateAsync(tenantId, request.AssetId, a => a.Epc = request.Epc.Trim(), cancellationToken);
        await _tags.AddAsync(new RfidTag
        {
            TenantId = tenantId,
            Epc = request.Epc.Trim(),
            Tid = request.Tid,
            Status = RfidTagStatus.Assigned,
            AssignedEntityType = "asset",
            AssignedEntityId = request.AssetId
        }, cancellationToken);

        return OperationResult<Asset>.Success(updated!);
    }
}
