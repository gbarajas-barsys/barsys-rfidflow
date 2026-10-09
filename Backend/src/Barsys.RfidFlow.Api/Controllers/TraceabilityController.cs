using Barsys.RfidFlow.Application.Abstractions;
using Barsys.RfidFlow.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

using Barsys.RfidFlow.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Barsys.RfidFlow.Api.Controllers;

[Route("v2/traceability")]
public sealed class TraceabilityController
    : ApiControllerBase
{
    private readonly IRepository<SerializedUnit>
        _repository;

    public TraceabilityController(
        IRepository<SerializedUnit> repository)
    {
        _repository = repository;
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> Dashboard(
        CancellationToken ct)
    {
        var units =
            await _repository.ListAsync(
                TenantId,
                1,
                10000,
                ct);

        return Ok(
            new
            {
                total =
                    units.Count(),

                registered =
                    units.Count(
                        x =>
                            x.Status ==
                            "REGISTERED"
                    ),

                shipped =
                    units.Count(
                        x =>
                            x.Status ==
                            "SHIPPED"
                    ),

                returned =
                    units.Count(
                        x =>
                            x.Status ==
                            "RETURNED"
                    ),

                tagged =
                    units.Count(
                        x =>
                            !string.IsNullOrWhiteSpace(
                                x.Epc
                            )
                    )
            });
    }

    [HttpGet("recent-events")]
    public async Task<IActionResult> RecentEvents(
        [FromServices] RfidFlowDbContext db,
        CancellationToken ct)
    {
        var events =
            await db.SerializedUnitEvents
                .AsNoTracking()
                .Join(
                    db.SerializedUnits,
                    e => e.SerializedUnitId,
                    s => s.Id,
                    (e, s) => new
                    {
                        e.Id,
                        e.EventType,
                        e.OccurredAt,
                        e.Comments,
                        s.SerialNumber,
                        s.Vin,
                        s.Status
                    })
                .Where(
                    x => x.Status != null
                )
                .OrderByDescending(
                    x => x.OccurredAt
                )
                .Take(20)
                .ToListAsync(ct);

        return Ok(events);
    }
}