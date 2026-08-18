using Barsys.RfidFlow.Domain.Entities;

namespace Barsys.RfidFlow.Application.Abstractions;

public interface IRepository<T> where T : BaseEntity
{
    Task<IReadOnlyList<T>> ListAsync(Guid tenantId, int page = 1, int pageSize = 50, CancellationToken ct = default);
    Task<T?> GetAsync(Guid tenantId, Guid id, CancellationToken ct = default);
    Task<T> AddAsync(T entity, CancellationToken ct = default);
    Task<T?> UpdateAsync(Guid tenantId, Guid id, Action<T> update, CancellationToken ct = default);
    Task<bool> DeleteAsync(Guid tenantId, Guid id, CancellationToken ct = default);
    Task<bool> ExistsRecentReadAsync(Guid tenantId, string epc, DateTimeOffset cutoff, CancellationToken ct = default);
}
