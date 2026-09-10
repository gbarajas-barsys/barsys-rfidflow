using Barsys.RfidFlow.Application.Dtos;
using Barsys.RfidFlow.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;

namespace Barsys.RfidFlow.Api.Controllers;
[Route("v2/auth")]
public sealed class AuthController : ApiControllerBase
{
    private readonly RfidFlowDbContext _db;
    public AuthController(
        RfidFlowDbContext db)
    {
        _db = db;
    }

    [HttpPost("login")]
    public ActionResult<AuthTokenResponse> Login(LoginRequest request)
    {
        var dbUser =
            _db.Users.FirstOrDefault(
                x => x.Email == request.Email);

        if (dbUser is null)
        {
            return Unauthorized();
        }

        var roles =
            (from ur in _db.UserRoles
            join r in _db.Roles
                on ur.RoleId equals r.Id
            where ur.UserId == dbUser.Id
            select r.Code)
            .ToArray();

        var user = new
        {
            id = dbUser.Id,
            email = dbUser.Email,
            displayName = dbUser.DisplayName,
            roles
        };

        return Ok(
            new AuthTokenResponse(
                "dev-access-token",
                "dev-refresh-token",
                3600,
                "Bearer",
                user));
            }

    [HttpPost("refresh")]
    public ActionResult<AuthTokenResponse> Refresh(object request) => Ok(new AuthTokenResponse("dev-access-token", "dev-refresh-token", 3600, "Bearer", null));

    [HttpPost("logout")]
    public IActionResult Logout() => NoContent();

    [HttpGet("me")]
    public IActionResult Me() => Ok(new { id = Guid.NewGuid(), email = "admin@barsys.local", displayName = "Barsys Admin", permissions = new[] { "*" } });
}
