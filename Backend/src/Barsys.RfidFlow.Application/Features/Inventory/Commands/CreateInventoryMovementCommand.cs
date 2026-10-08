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
    DateTimeOffset OccurredAt,
    IReadOnlyCollection<Guid>? SerializedUnitIds)
    : IRequest<InventoryMovement>;    

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
    private readonly IRepository<InventoryMovement>
        _movements;

    private readonly IRepository<SerializedUnitEvent>
        _events;

    private readonly ITenantContextAccessor
        _tenant;
    public CreateInventoryMovementCommandHandler(
    IRepository<InventoryMovement> movements,
    IRepository<SerializedUnitEvent> events,
    ITenantContextAccessor tenant)
    {
        _movements = movements;
        _events = events;
        _tenant = tenant;
    }
    
    public async Task<InventoryMovement> Handle(
        CreateInventoryMovementCommand request,
        CancellationToken cancellationToken)
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

        var createdMovement =
            await _movements.AddAsync(
                movement,
                cancellationToken);

        if (
            request.MovementType ==
            InventoryMovementType.Shipment
            &&
            request.SerializedUnitIds?.Any() == true)
        {
            foreach (
                var serializedUnitId
                in request.SerializedUnitIds)
            {
                await _events.AddAsync(
                    new SerializedUnitEvent
                    {
                        TenantId =
                            _tenant.Current.TenantId,

                        SerializedUnitId =
                            serializedUnitId,

                        EventType = "SALIDA",

                        OccurredAt =
                            DateTime.UtcNow,

                        Comments =
                            "Salida registrada desde Inventario"
                    },
                    cancellationToken);
            }
        }

        return createdMovement;
    }
}
