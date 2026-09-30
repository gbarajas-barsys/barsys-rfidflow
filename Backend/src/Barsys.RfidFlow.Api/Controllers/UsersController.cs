using Barsys.RfidFlow.Application.Abstractions;
using Barsys.RfidFlow.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Barsys.RfidFlow.Infrastructure.Persistence;
using System.Text.Json;

namespace Barsys.RfidFlow.Api.Controllers;

public sealed class UsersController : ApiControllerBase
{
    private readonly IRepository<UserAccount> _repository;
    private readonly RfidFlowDbContext _db;

    public UsersController(
        IRepository<UserAccount> repository,
        RfidFlowDbContext db)
    {
        _repository = repository;
        _db = db;
    }

    [HttpGet]
public IActionResult List()
{
    var role =
        Request.Headers["X-Role"]
            .ToString();

    var isSuperAdmin =
        role == "SUPER_ADMIN";

    var users =
        from u in _db.Users

        join ur in _db.UserRoles
            on u.Id equals ur.UserId
            into userRoles

        from ur in userRoles.DefaultIfEmpty()

        join r in _db.Roles
            on ur.RoleId equals r.Id
            into roles

        from r in roles.DefaultIfEmpty()

        select new
        {
            u.Id,
            u.TenantId,
            u.Email,
            u.DisplayName,
            u.Status,

            role =
                r != null
                    ? r.Code
                    : null,

            roleId =
                r != null
                    ? r.Id
                    : (Guid?)null,

            userRoleId =
                ur != null
                    ? ur.Id
                    : (Guid?)null
        };

    if (!isSuperAdmin)
    {
        users =
            users.Where(
                x => x.TenantId == TenantId
            );
    }

    return Ok(users.ToList());
}

    [HttpGet("{id:guid}")] 
    public async Task<IActionResult> Get(Guid id, CancellationToken ct)
    {
        var item = await _repository.GetAsync(TenantId, id, ct);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        UserAccount entity,
        CancellationToken ct)
    {
        if (entity.TenantId == Guid.Empty)
        {
           // entity.TenantId = TenantId;
        }

        entity.PasswordHash =
            BCrypt.Net.BCrypt.HashPassword(
                "Password123!"
            );
            entity.MustChangePassword = true;

        var created =
            await _repository.AddAsync(
                entity,
                ct);

        _db.AuditLogs.Add(
            new AuditLog
            {
                TenantId = created.TenantId,

                UserId = CurrentUserId,

                EntityType = "User",

                EntityId = created.Id,

                Action = "USER_CREATED",

                AfterJson =
                    JsonSerializer.Serialize(
                        new
                        {
                            created.Email,
                            created.DisplayName
                        })
            });

        await _db.SaveChangesAsync(ct);

        return CreatedAtAction(
            nameof(Get),
            new { id = created.Id },
            created);
    }

    [HttpPatch("{id:guid}")] 
    public async Task<IActionResult> Patch(Guid id, UserAccount patch, CancellationToken ct)
    {
        var existing =
            await _repository.GetAsync(
                TenantId,
                id,
                ct);

        if (existing is null)
        {
            return NotFound();
        }

        var before =
            JsonSerializer.Serialize(
                new
                {
                    existing.Email,
                    existing.DisplayName
                });
        var updated = await _repository.UpdateAsync(TenantId, id, current =>
        {
            // TODO: replace with explicit command handlers/validators per aggregate.
            foreach (var p in typeof(UserAccount).GetProperties().Where(p => p.CanWrite && p.Name != "Id" && p.Name != "TenantId"))
            {
                var value = p.GetValue(patch);
                if (value is not null) p.SetValue(current, value);
            }
        }, ct);
        if (updated is not null)
        {
        var after =
            JsonSerializer.Serialize(
                new
                {
                    updated.Email,
                    updated.DisplayName
                });
            _db.AuditLogs.Add(
                new AuditLog
                {
                    TenantId = updated.TenantId,

                    UserId = CurrentUserId,

                    EntityType = "User",

                    EntityId = updated.Id,

                    Action = "USER_UPDATED",

                    BeforeJson = before,

                    AfterJson = after
                });

            await _db.SaveChangesAsync(ct);
        }

        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(
        Guid id,
        CancellationToken ct)
    {
        var user =
            await _repository.GetAsync(
                TenantId,
                id,
                ct);

        if (user is null)
        {
            return NotFound();
        }

        var deleted =
            await _repository.DeleteAsync(
                TenantId,
                id,
                ct);

        if (!deleted)
        {
            return NotFound();
        }

        _db.AuditLogs.Add(
            new AuditLog
            {
                TenantId = user.TenantId,

                EntityType = "User",

                EntityId = user.Id,

                Action = "USER_DELETED",

                AfterJson =
                    JsonSerializer.Serialize(
                        new
                        {
                            user.Email,
                            user.DisplayName
                        })
            });

        await _db.SaveChangesAsync(ct);

        return NoContent();
    }

    [HttpPost("{id:guid}/reset-password")]
    public async Task<IActionResult> ResetPassword(
        Guid id,
        CancellationToken ct)
    {
        var existing =
            await _repository.GetAsync(
                TenantId,
                id,
                ct);

        if (existing is null)
        {
            return NotFound();
        }

        var updated =
            await _repository.UpdateAsync(
                TenantId,
                id,
                current =>
                {
                    current.PasswordHash =
                        BCrypt.Net.BCrypt.HashPassword(
                            "Password123!"
                        );

                    current.MustChangePassword = true;
                },
                ct);

                if (updated is not null)
                {
                    _db.AuditLogs.Add(
                        new AuditLog
                        {
                            TenantId = updated.TenantId,

                            EntityType = "User",

                            EntityId = updated.Id,

                            Action = "PASSWORD_RESET",

                            AfterJson =
                                JsonSerializer.Serialize(
                                    new
                                    {
                                        existing.Email,
                                        existing.DisplayName
                                    })
                        });

                    await _db.SaveChangesAsync(ct);
                }

        return updated is null
            ? NotFound()
            : Ok(new
            {
                Message =
                    "Contraseña restablecida correctamente.",
                TemporaryPassword =
                    "Password123!"
            });
    }
}
