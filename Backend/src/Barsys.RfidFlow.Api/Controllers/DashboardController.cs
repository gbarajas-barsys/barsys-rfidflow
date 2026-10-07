using Barsys.RfidFlow.Domain.Entities;
using Barsys.RfidFlow.Application.Abstractions;
using Microsoft.AspNetCore.Mvc;

namespace Barsys.RfidFlow.Api.Controllers;

[Route("v2/dashboard")]
public sealed class DashboardController : ApiControllerBase
{
    private readonly IRepository<SerializedUnitEvent>
        _events;

    public DashboardController(
        IRepository<SerializedUnitEvent> events)
    {
        _events = events;
    }

    [HttpGet("reentry-summary")]
    public async Task<IActionResult> ReentrySummary(
        CancellationToken ct)
    {
        var events =
            await _events.ListAsync(
                TenantId,
                1,
                100000,
                ct);

        var pending =
            events
                .Where(x =>
                    x.EventType == "REINGRESO"
                    &&
                    x.WorkOrderId == null)
                .Select(x =>
                    x.SerializedUnitId)
                .Distinct()
                .Count();

        return Ok(
            new
            {
                pendingReentries = pending
            });
    }
}