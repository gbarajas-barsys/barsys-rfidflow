using Barsys.RfidFlow.Domain.Enums;

namespace Barsys.RfidFlow.Domain.Entities;

public sealed class Tenant : BaseEntity
{
    public string Name { get; set; } = default!;
    public string Code { get; set; } = default!;
    public string? LegalName { get; set; }
    public string Country { get; set; } = "MX";
    public string Timezone { get; set; } = "America/Mexico_City";
    public TenantStatus Status { get; set; } = TenantStatus.Trial;
    public string Plan { get; set; } = "enterprise";
}

public sealed class Organization : BaseEntity
{
    public string Name { get; set; } = default!;
    public string Code { get; set; } = default!;
    public string? TaxId { get; set; }
    public Guid? ParentOrganizationId { get; set; }
    public bool Active { get; set; } = true;
}

public sealed class UserAccount : BaseEntity
{
    public string Email { get; set; } = default!;
    public string DisplayName { get; set; } = default!;
    public string? Phone { get; set; }
    public UserStatus Status { get; set; } = UserStatus.Active;
    public DateTimeOffset? LastLoginAt { get; set; }
}

public sealed class Location : BaseEntity
{
    public Guid OrganizationId { get; set; }
    public Guid? ParentLocationId { get; set; }
    public string Code { get; set; } = default!;
    public string Name { get; set; } = default!;
    public LocationType Type { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public bool Active { get; set; } = true;
}

public sealed class Asset : BaseEntity
{
    public string AssetNumber { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public Guid? CategoryId { get; set; }
    public Guid? LocationId { get; set; }
    public Guid? AssignedToUserId { get; set; }
    public string? Epc { get; set; }
    public string? SerialNumber { get; set; }
    public AssetStatus Status { get; set; } = AssetStatus.Available;
    public AssetCriticality Criticality { get; set; } = AssetCriticality.Medium;
}

public sealed class Item : BaseEntity
{
    public string Sku { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public Guid? CategoryId { get; set; }
    public string UnitOfMeasure { get; set; } = "PCS";
    public string? Barcode { get; set; }
    public decimal? MinStock { get; set; }
    public decimal? MaxStock { get; set; }
    public bool Active { get; set; } = true;
}

public sealed class RfidTag : BaseEntity
{
    public string Epc { get; set; } = default!;
    public string? Tid { get; set; }
    public string? UserMemory { get; set; }
    public RfidTagStatus Status { get; set; } = RfidTagStatus.Available;
    public string? AssignedEntityType { get; set; }
    public Guid? AssignedEntityId { get; set; }
    public DateTimeOffset? LastSeenAt { get; set; }
}

public sealed class RfidReader : BaseEntity
{
    public string Name { get; set; } = default!;
    public string SerialNumber { get; set; } = default!;
    public string IpAddress { get; set; } = default!;
    public int Port { get; set; } = 5084;
    public bool Enabled { get; set; } = true;
    public RfidVendor Vendor { get; set; }
    public string Model { get; set; } = default!;
    public Guid? LocationId { get; set; }
    public DeviceStatus Status { get; set; } =
        DeviceStatus.Offline;
    public DateTimeOffset? LastHeartbeatAt { get; set; }
}

public sealed class RfidReadEvent : BaseEntity
{
    public string Epc { get; set; } = default!;
    public Guid ReaderId { get; set; }
    public Guid? AntennaId { get; set; }
    public Guid? LocationId { get; set; }
    public decimal? Rssi { get; set; }
    public int ReadCount { get; set; } = 1;
    public DateTimeOffset FirstSeenAt { get; set; }
    public DateTimeOffset LastSeenAt { get; set; }
}
