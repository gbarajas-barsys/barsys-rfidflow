using Microsoft.AspNetCore.Mvc;
using Barsys.RfidFlow.Infrastructure.Persistence;

namespace Barsys.RfidFlow.Api.Controllers;

public sealed class AuditLogsController
    : ApiControllerBase
{
    private readonly RfidFlowDbContext _db;

    public AuditLogsController(
        RfidFlowDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public IActionResult List()
    {
        var logs =
            _db.AuditLogs
                .OrderByDescending(
                    x => x.CreatedAt
                )
                .Take(100)
                .ToList();

        return Ok(logs);
    }
}
