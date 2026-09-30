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
            (
                from audit in _db.AuditLogs

                join user in _db.Users
                    on audit.UserId equals user.Id
                    into users

                from user in users.DefaultIfEmpty()

                orderby audit.CreatedAt descending

                select new
                {
                    audit.Id,

                    audit.Action,

                    audit.EntityType,

                    audit.EntityId,

                    audit.BeforeJson,

                    audit.AfterJson,

                    audit.CreatedAt,

                    audit.UserId,

                    PerformedBy =
                        user != null
                            ? user.DisplayName
                            : "Sistema"
                }
            )
            .Take(100)
            .ToList();

        return Ok(logs);
    }
}
