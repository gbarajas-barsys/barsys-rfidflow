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

        if (
            string.IsNullOrWhiteSpace(
                dbUser.PasswordHash
            )
        )
        {
            return Unauthorized();
        }

        if (
            !BCrypt.Net.BCrypt.Verify(
                request.Password,
                dbUser.PasswordHash
            )
        )
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

        var permissions =
            (
                from ur in _db.UserRoles
                join r in _db.Roles
                    on ur.RoleId equals r.Id
                where ur.UserId == dbUser.Id
                from p in r.Permissions
                select p
            )
            .Distinct()
            .ToArray();

        var user = new
        {
            id = dbUser.Id,
            email = dbUser.Email,
            displayName = dbUser.DisplayName,
            roles,
            permissions
        };

        return Ok(
            new AuthTokenResponse(
                "dev-access-token",
                "dev-refresh-token",
                3600,
                "Bearer",
                user));
            }
    [HttpPost("change-password")]
    public IActionResult ChangePassword(
        ChangePasswordRequest request)
    {
        var user =
            _db.Users.FirstOrDefault(
                x => x.Email ==
                    request.Email
            );

        if (user is null)
        {
            return Unauthorized();
        }

        if (
            string.IsNullOrWhiteSpace(
                user.PasswordHash
            )
        )
        {
            return Unauthorized();
        }

        if (
            !BCrypt.Net.BCrypt.Verify(
                request.CurrentPassword,
                user.PasswordHash
            )
        )
        {
            return BadRequest(
                new
                {
                    Message =
                        "Current password is invalid."
                });
        }

        if (
            request.NewPassword !=
            request.ConfirmPassword
        )
        {
            return BadRequest(
                new
                {
                    Message =
                        "Passwords do not match."
                });
        }

        if (
            request.NewPassword.Length < 8
        )
        {
            return BadRequest(
                new
                {
                    Message =
                        "Password must contain at least 8 characters."
                });
        }

        if (
            BCrypt.Net.BCrypt.Verify(
                request.NewPassword,
                user.PasswordHash
            )
        )
        {
            return BadRequest(
                new
                {
                    Message =
                        "New password must be different from current password."
                });
        }

        user.PasswordHash =
            BCrypt.Net.BCrypt.HashPassword(
                request.NewPassword
            );

        _db.SaveChanges();

        return Ok(
            new
            {
                Message =
                    "Password updated successfully."
            });
    }

    [HttpPost("refresh")]
    public ActionResult<AuthTokenResponse> Refresh(object request) => Ok(new AuthTokenResponse("dev-access-token", "dev-refresh-token", 3600, "Bearer", null));

    [HttpPost("logout")]
    public IActionResult Logout() => NoContent();

    [HttpGet("me")]
    public IActionResult Me() => Ok(new { id = Guid.NewGuid(), email = "admin@barsys.local", displayName = "Barsys Admin", permissions = new[] { "*" } });

    [HttpGet("hash")]
    public IActionResult GenerateHash() {return Ok(BCrypt.Net.BCrypt.HashPassword("Password123!"));}
}

