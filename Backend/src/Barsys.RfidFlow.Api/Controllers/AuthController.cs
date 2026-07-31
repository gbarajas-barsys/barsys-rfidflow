using Barsys.RfidFlow.Application.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace Barsys.RfidFlow.Api.Controllers;

[Route("v2/auth")]
public sealed class AuthController : ApiControllerBase
{
    [HttpPost("login")]
    public ActionResult<AuthTokenResponse> Login(LoginRequest request)
    {
        var user = new { id = Guid.NewGuid(), request.Email, displayName = request.Email.Split('@')[0], roles = new[] { "tenant_admin" } };
        return Ok(new AuthTokenResponse("dev-access-token", "dev-refresh-token", 3600, "Bearer", user));
    }

    [HttpPost("refresh")]
    public ActionResult<AuthTokenResponse> Refresh(object request) => Ok(new AuthTokenResponse("dev-access-token", "dev-refresh-token", 3600, "Bearer", null));

    [HttpPost("logout")]
    public IActionResult Logout() => NoContent();

    [HttpGet("me")]
    public IActionResult Me() => Ok(new { id = Guid.NewGuid(), email = "admin@barsys.local", displayName = "Barsys Admin", permissions = new[] { "*" } });
}
