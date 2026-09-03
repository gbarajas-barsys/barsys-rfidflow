namespace Barsys.RfidFlow.Application.Dtos;

public sealed record LoginRequest(string Email, string Password, string? TenantCode);
public sealed record AuthTokenResponse(string AccessToken, string RefreshToken, int ExpiresIn, string TokenType, object? User);
public sealed record CreateTenantRequest(string Name, string Code, string? LegalName, string? Country, string? Timezone, string? Plan);
public sealed record CreateOrganizationRequest(string Name, string Code, string? TaxId, Guid? ParentOrganizationId);
public sealed record CreateUserRequest(string Email, string DisplayName, string? Phone, IReadOnlyList<Guid>? RoleIds);
public sealed record CreateLocationRequest(Guid OrganizationId, string Code, string Name, string Type, Guid? ParentLocationId);
public sealed record CreateAssetRequest(string AssetNumber, string Name, string? Description, Guid? LocationId, string? SerialNumber, string? Criticality);
public sealed record AssignTagRequest(string Epc, string? Tid, bool OverwriteExisting);
public sealed record CreateItemRequest(string Sku, string Name, string UnitOfMeasure, string? Description, string? Barcode);
public sealed record CreateRfidTagRequest(string Epc, string? Tid, string? UserMemory);
public sealed record CreateRfidReaderRequest(
    string Name,
    string SerialNumber,
    string Vendor,
    string Model,
    Guid? LocationId,
    string IpAddress,
    int Port,
    bool Enabled
);
public sealed record RfidReadEventRequest(
    string Epc,
    Guid ReaderId,
    string? ReaderName,
    string? ReaderIp,
    Guid? AntennaId,
    Guid? LocationId,
    decimal? Rssi,
    int? ReadCount,
    DateTimeOffset FirstSeenAt,
    DateTimeOffset LastSeenAt
);
public sealed record RfidReadEventBatchRequest(string SourceId, Guid? SessionId, IReadOnlyList<RfidReadEventRequest> Events);
public sealed record IngestionAck(bool Accepted, Guid EventId, string Message);
public sealed record BatchIngestionAck(int Accepted, int Rejected, Guid BatchId, IReadOnlyList<ErrorResponse> Errors);
