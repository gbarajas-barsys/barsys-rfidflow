using Barsys.RfidFlow.Domain.Entities;

namespace Barsys.RfidFlow.Application.Abstractions;

public interface IReaderResolver
{
    Task<RfidReader?> ResolveAsync(
        Guid tenantId,
        string? serial,
        string? ip,
        string? name,
        CancellationToken cancellationToken);
}