using Microsoft.AspNetCore.Mvc;

namespace Barsys.RfidFlow.Api.Controllers;

[ApiController]
[Route("v2/[controller]")]
public abstract class ApiControllerBase : ControllerBase
{
    protected Guid TenantId
    {
        get
        {
            if (Request.Headers.TryGetValue("X-Tenant-Id", out var value) && Guid.TryParse(value, out var tenantId)) return tenantId;
            return Guid.Parse("00000000-0000-0000-0000-000000000001");
        }
    }
}
