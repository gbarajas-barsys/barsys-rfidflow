using Barsys.RfidFlow.Application.Abstractions;
using Barsys.RfidFlow.Application.Common;
using Barsys.RfidFlow.Application.Rules;
using Barsys.RfidFlow.Domain.Entities;
using Barsys.RfidFlow.Domain.Enums;
using FluentValidation;
using MediatR;

namespace Barsys.RfidFlow.Application.Features.Inventory.Commands;

public sealed record CreateInventoryMovementCommand(
    InventoryMovementType MovementType,
    Guid ItemId,
    Guid? FromLocationId,
    Guid? ToLocationId,
    decimal Quantity,
    string? LotNumber,
    string? ReferenceType,
    Guid? ReferenceId,
    DateTimeOffset OccurredAt) : IRequest<InventoryMovement>;

public sealed class CreateInventoryMovementCommandValidator : AbstractValidator<CreateInventoryMovementCommand>
{
    public CreateInventoryMovementCommandValidator()
    {
        RuleFor(x => x.ItemId).NotEmpty();
        RuleFor(x => x.Quantity).Must(BusinessRules.QuantityIsPositive).WithMessage("La cantidad debe ser mayor a cero.");
        RuleFor(x => x.OccurredAt).NotEmpty();
        RuleFor(x => x.LotNumber).MaximumLength(120);
        RuleFor(x => x.ReferenceType).MaximumLength(80);
        RuleFor(x => x).Must(x => x.FromLocationId.HasValue || x.ToLocationId.HasValue).WithMessage("Debe existir ubicación origen o destino.");
    }
}

public sealed class CreateInventoryMovementCommandHandler : IRequestHandler<CreateInventoryMovementCommand, InventoryMovement>
{
    private readonly IRepository<InventoryMovement> _movements;
    private readonly ITenantContextAccessor _tenant;
    public CreateInventoryMovementCommandHandler(IRepository<InventoryMovement> movements, ITenantContextAccessor tenant)
    {
        _movements = movements;
        _tenant = tenant;
    }

    public Task<InventoryMovement> Handle(CreateInventoryMovementCommand request, CancellationToken cancellationToken)
    {
        var movement = new InventoryMovement
        {
            TenantId = _tenant.Current.TenantId,
            MovementType = request.MovementType,
            ItemId = request.ItemId,
            FromLocationId = request.FromLocationId,
            ToLocationId = request.ToLocationId,
            Quantity = request.Quantity,
            LotNumber = request.LotNumber,
            ReferenceType = request.ReferenceType,
            ReferenceId = request.ReferenceId,
            OccurredAt = request.OccurredAt
        };
        return _movements.AddAsync(movement, cancellationToken);
    }
}
