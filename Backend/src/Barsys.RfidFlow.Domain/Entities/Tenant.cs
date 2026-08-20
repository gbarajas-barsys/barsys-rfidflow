namespace RFIDFlow.Domain.Entities;

public sealed class Tenant
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Code { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public string? LegalName { get; set; }

    public string? Country { get; set; }

    public string? Timezone { get; set; }

    public string? Status { get; set; }

    public string? Plan { get; set; }
}
