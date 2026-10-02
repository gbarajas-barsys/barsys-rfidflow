namespace Barsys.RfidFlow.Domain.Entities;

public sealed class SerializedUnit : BaseEntity
{
    public Guid ItemId { get; set; }

    public string SerialNumber { get; set; }
        = default!;

    public string? Vin { get; set; }

    public string? BinCode { get; set; }

    public string? LotNumber { get; set; }

    public string? Brand { get; set; }

    public string? Model { get; set; }

    public string Status { get; set; }
        = "REGISTERED";

    public string? Epc { get; set; }

    public Guid? CurrentLocationId { get; set; }

    public DateTimeOffset? LastSeenAt { get; set; }
}