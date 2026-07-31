using Barsys.RfidFlow.Application.Common;
using FluentValidation;
using MediatR;

namespace Barsys.RfidFlow.Application.Features.Inventory.Commands;

public sealed record CompleteInventoryCountCommand(Guid CountId) : IRequest<OperationResult<object>>;

public sealed class CompleteInventoryCountCommandValidator : AbstractValidator<CompleteInventoryCountCommand>
{
    public CompleteInventoryCountCommandValidator() => RuleFor(x => x.CountId).NotEmpty();
}

public sealed class CompleteInventoryCountCommandHandler : IRequestHandler<CompleteInventoryCountCommand, OperationResult<object>>
{
    public Task<OperationResult<object>> Handle(CompleteInventoryCountCommand request, CancellationToken cancellationToken)
    {
        // TODO: cuando se agregue entidad InventoryCount, calcular variaciones y generar movimientos de ajuste.
        return Task.FromResult(OperationResult<object>.Success(new { request.CountId, status = "completed", completedAt = DateTimeOffset.UtcNow }));
    }
}
