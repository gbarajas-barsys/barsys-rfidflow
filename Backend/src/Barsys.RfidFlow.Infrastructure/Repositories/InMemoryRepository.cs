using System.Collections.Concurrent;
using Barsys.RfidFlow.Application.Abstractions;
using Barsys.RfidFlow.Domain.Entities;

namespace Barsys.RfidFlow.Infrastructure.Repositories;

public sealed class InMemoryRepository<T> : IRepository<T> where T : BaseEntity
{
    private static readonly ConcurrentDictionary<Guid, T> Store = new();

    public Task<IReadOnlyList<T>> ListAsync(Guid tenantId, int page = 1, int pageSize = 50, CancellationToken ct = default)
    {
        var items = Store.Values
            .Where(x => x.TenantId == tenantId)
            .OrderByDescending(x => x.CreatedAt)
            .Skip((Math.Max(page, 1) - 1) * Math.Clamp(pageSize, 1, 200))
            .Take(Math.Clamp(pageSize, 1, 200))
            .ToList();
        return Task.FromResult((IReadOnlyList<T>)items);
    }

    public Task<T?> GetAsync(Guid tenantId, Guid id, CancellationToken ct = default)
    {
        return Task.FromResult(Store.TryGetValue(id, out var item) && item.TenantId == tenantId ? item : null);
    }

    public Task<T> AddAsync(T entity, CancellationToken ct = default)
    {
        entity.Id = entity.Id == Guid.Empty ? Guid.NewGuid() : entity.Id;
        entity.CreatedAt = DateTimeOffset.UtcNow;
        entity.UpdatedAt = entity.CreatedAt;
        Store[entity.Id] = entity;
        return Task.FromResult(entity);
    }

    public Task<T?> UpdateAsync(Guid tenantId, Guid id, Action<T> update, CancellationToken ct = default)
    {
        if (!Store.TryGetValue(id, out var item) || item.TenantId != tenantId) return Task.FromResult<T?>(null);
        update(item);
        item.UpdatedAt = DateTimeOffset.UtcNow;
        item.RowVersion++;
        return Task.FromResult<T?>(item);
    }

    public Task<bool> DeleteAsync(Guid tenantId, Guid id, CancellationToken ct = default)
    {
        if (!Store.TryGetValue(id, out var item) || item.TenantId != tenantId) return Task.FromResult(false);
        return Task.FromResult(Store.TryRemove(id, out _));
    }
}
