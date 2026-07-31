using Barsys.RfidFlow.Application.Abstractions;
using Barsys.RfidFlow.Domain.Entities;
using Barsys.RfidFlow.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Barsys.RfidFlow.Infrastructure.Repositories;

public sealed class EfRepository<T> : IRepository<T> where T : BaseEntity
{
    private readonly RfidFlowDbContext _db;
    public EfRepository(RfidFlowDbContext db) => _db = db;

    public async Task<IReadOnlyList<T>> ListAsync(Guid tenantId, int page = 1, int pageSize = 50, CancellationToken ct = default)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 200);
        return await _db.Set<T>()
            .AsNoTracking()
            .Where(x => x.TenantId == tenantId)
            .OrderByDescending(x => x.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);
    }

    public Task<T?> GetAsync(Guid tenantId, Guid id, CancellationToken ct = default)
        => _db.Set<T>().AsNoTracking().FirstOrDefaultAsync(x => x.TenantId == tenantId && x.Id == id, ct);

    public async Task<T> AddAsync(T entity, CancellationToken ct = default)
    {
        _db.Set<T>().Add(entity);
        await _db.SaveChangesAsync(ct);
        return entity;
    }

    public async Task<T?> UpdateAsync(Guid tenantId, Guid id, Action<T> update, CancellationToken ct = default)
    {
        var entity = await _db.Set<T>().FirstOrDefaultAsync(x => x.TenantId == tenantId && x.Id == id, ct);
        if (entity is null) return null;
        update(entity);
        await _db.SaveChangesAsync(ct);
        return entity;
    }

    public async Task<bool> DeleteAsync(Guid tenantId, Guid id, CancellationToken ct = default)
    {
        var entity = await _db.Set<T>().FirstOrDefaultAsync(x => x.TenantId == tenantId && x.Id == id, ct);
        if (entity is null) return false;
        _db.Remove(entity);
        await _db.SaveChangesAsync(ct);
        return true;
    }
}
