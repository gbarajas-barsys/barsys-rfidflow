namespace Barsys.RfidFlow.Application.Common;

public sealed record TenantContext(Guid TenantId, Guid? UserId = null);

public interface ITenantContextAccessor
{
    TenantContext Current { get; }
}
