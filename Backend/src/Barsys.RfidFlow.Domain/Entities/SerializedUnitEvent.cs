namespace Barsys.RfidFlow.Domain.Entities;

public sealed class SerializedUnitEvent
    : BaseEntity
{
    public Guid SerializedUnitId { get; set; }

    public string EventType { get; set; }
        = string.Empty;

    public DateTime OccurredAt { get; set; }

    public string? Comments { get; set; }

    public Guid? WorkOrderId { get; set; }
}