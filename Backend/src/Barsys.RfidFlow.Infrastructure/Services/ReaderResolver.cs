using Barsys.RfidFlow.Application.Abstractions;
using Barsys.RfidFlow.Domain.Entities;
using Barsys.RfidFlow.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Barsys.RfidFlow.Infrastructure.Services;

public sealed class ReaderResolver
    : IReaderResolver
{
    private readonly RfidFlowDbContext _db;

    public ReaderResolver(
        RfidFlowDbContext db)
    {
        _db = db;
    }

    public async Task<RfidReader?> ResolveAsync(
        Guid tenantId,
        string? serial,
        string? ip,
        string? name,
        CancellationToken cancellationToken)
    {
        if (!string.IsNullOrWhiteSpace(serial))
        {
            var bySerial =
                await _db.RfidReaders
                    .AsNoTracking()
                    .FirstOrDefaultAsync(
                        x =>
                            x.TenantId == tenantId &&
                            x.SerialNumber == serial,
                        cancellationToken);

            if (bySerial is not null)
            {
                return bySerial;
            }
        }

        if (!string.IsNullOrWhiteSpace(ip))
        {
            var byIp =
                await _db.RfidReaders
                    .AsNoTracking()
                    .FirstOrDefaultAsync(
                        x =>
                            x.TenantId == tenantId &&
                            x.IpAddress == ip,
                        cancellationToken);

            if (byIp is not null)
            {
                return byIp;
            }
        }

        if (!string.IsNullOrWhiteSpace(name))
        {
            var byName =
                await _db.RfidReaders
                    .AsNoTracking()
                    .FirstOrDefaultAsync(
                        x =>
                            x.TenantId == tenantId &&
                            x.Name == name,
                        cancellationToken);

            if (byName is not null)
            {
                return byName;
            }
        }

        return null;
    }
}