using Barsys.RfidFlow.Application.Abstractions;
using Barsys.RfidFlow.Application.Common;
using Barsys.RfidFlow.Domain.Entities;
using Barsys.RfidFlow.Domain.Enums;
using FluentValidation;
using MediatR;

namespace Barsys.RfidFlow.Application.Features.WorkOrders.Commands;

public sealed record CreateWorkOrderCommand(
    string Type,
    string Title,
    string? Description,
    string Priority,
    Guid? AssignedToUserId,
    DateTimeOffset? DueAt) : IRequest<WorkOrder>;

public sealed class CreateWorkOrderCommandValidator : AbstractValidator<CreateWorkOrderCommand>
{
    public CreateWorkOrderCommandValidator()
    {
        RuleFor(x => x.Type).NotEmpty().MaximumLength(60);
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Priority).NotEmpty().Must(x => new[] { "low", "medium", "high", "urgent" }.Contains(x));
    }
}

public sealed class CreateWorkOrderCommandHandler : IRequestHandler<CreateWorkOrderCommand, WorkOrder>
{
    private readonly IRepository<WorkOrder> _workOrders;
    private readonly ITenantContextAccessor _tenant;
    public CreateWorkOrderCommandHandler(IRepository<WorkOrder> workOrders, ITenantContextAccessor tenant)
    {
        _workOrders = workOrders;
        _tenant = tenant;
    }

    public Task<WorkOrder> Handle(CreateWorkOrderCommand request, CancellationToken cancellationToken)
    {
        var wo = new WorkOrder
        {
            TenantId = _tenant.Current.TenantId,
            WorkOrderNumber = $"WO-{DateTime.UtcNow:yyyyMMddHHmmssfff}",
            Type = request.Type,
            Title = request.Title,
            Description = request.Description,
            Priority = request.Priority,
            AssignedToUserId = request.AssignedToUserId,
            DueAt = request.DueAt,
            Status = WorkOrderStatus.Open
        };
        return _workOrders.AddAsync(wo, cancellationToken);
    }
}
