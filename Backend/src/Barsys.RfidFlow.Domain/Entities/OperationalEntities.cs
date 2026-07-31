using Barsys.RfidFlow.Domain.Enums;

namespace Barsys.RfidFlow.Domain.Entities;

public sealed class Role : BaseEntity
{
    public string Name { get; set; } = default!;
    public string Code { get; set; } = default!;
    public string? Description { get; set; }
    public string[] Permissions { get; set; } = [];
}

public sealed class InventoryBalance : BaseEntity
{
    public Guid ItemId { get; set; }
    public Guid LocationId { get; set; }
    public string? LotNumber { get; set; }
    public string? SerialNumber { get; set; }
    public decimal QuantityOnHand { get; set; }
    public decimal QuantityReserved { get; set; }
    public decimal QuantityAvailable { get; set; }
    public DateTimeOffset? LastMovementAt { get; set; }
}

public sealed class InventoryMovement : BaseEntity
{
    public InventoryMovementType MovementType { get; set; }
    public Guid ItemId { get; set; }
    public Guid? FromLocationId { get; set; }
    public Guid? ToLocationId { get; set; }
    public decimal Quantity { get; set; }
    public string? LotNumber { get; set; }
    public string? ReferenceType { get; set; }
    public Guid? ReferenceId { get; set; }
    public DateTimeOffset OccurredAt { get; set; }
}

public sealed class WorkOrder : BaseEntity
{
    public string WorkOrderNumber { get; set; } = default!;
    public string Type { get; set; } = default!;
    public string Title { get; set; } = default!;
    public string? Description { get; set; }
    public WorkOrderStatus Status { get; set; } = WorkOrderStatus.Draft;
    public string Priority { get; set; } = "medium";
    public Guid? AssignedToUserId { get; set; }
    public DateTimeOffset? DueAt { get; set; }
    public string MetadataJson { get; set; } = "{}";
}

public sealed class AuditLog
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TenantId { get; set; }
    public Guid? UserId { get; set; }
    public string Action { get; set; } = default!;
    public string EntityType { get; set; } = default!;
    public Guid? EntityId { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public string? BeforeJson { get; set; }
    public string? AfterJson { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}

public sealed class WebhookSubscription : BaseEntity
{
    public string Name { get; set; } = default!;
    public string Url { get; set; } = default!;
    public string[] Events { get; set; } = [];
    public string? SecretHash { get; set; }
    public string Status { get; set; } = "active";
}

public sealed class Notification : BaseEntity
{
    public Guid UserId { get; set; }
    public string Title { get; set; } = default!;
    public string Message { get; set; } = default!;
    public string Severity { get; set; } = "info";
    public DateTimeOffset? ReadAt { get; set; }
    public string MetadataJson { get; set; } = "{}";
}
