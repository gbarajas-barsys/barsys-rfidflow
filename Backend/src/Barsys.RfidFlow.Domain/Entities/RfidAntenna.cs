namespace Barsys.RfidFlow.Domain.Entities;

public sealed class RfidAntenna
    : BaseEntity
{
    public Guid ReaderId { get; set; }

    public int PortNumber { get; set; }

    public string Name { get; set; }
        = default!;

    public Guid? LocationId { get; set; }

    public string? Zone { get; set; }

    public int Power { get; set; }
        = 30;

    public bool Enabled { get; set; }
        = true;
}