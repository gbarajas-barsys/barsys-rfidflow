using Barsys.RfidFlow.Application.Common;

namespace Barsys.RfidFlow.Api.Infrastructure;

public sealed class HttpTenantContextAccessor : ITenantContextAccessor
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    public HttpTenantContextAccessor(IHttpContextAccessor httpContextAccessor) => _httpContextAccessor = httpContextAccessor;

    public TenantContext Current
    {
        get
        {
            var http = _httpContextAccessor.HttpContext;
            if (http?.Request.Headers.TryGetValue("X-Tenant-Id", out var value) == true && Guid.TryParse(value, out var tenantId))
            {
                return new TenantContext(tenantId);
            }
            return new TenantContext(Guid.Parse("00000000-0000-0000-0000-000000000001"));
        }
    }
}
