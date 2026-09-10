using Barsys.RfidFlow.Application.Abstractions;
using Barsys.RfidFlow.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Barsys.RfidFlow.Infrastructure.Persistence;

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
        var users =
            from u in _db.Users

            join ur in _db.UserRoles
                on u.Id equals ur.UserId into userRoles
            from ur in userRoles.DefaultIfEmpty()

            join r in _db.Roles
                on ur.RoleId equals r.Id into roles
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
                        : null
            };

        return Ok(users.ToList());
    }

    [HttpGet("{id:guid}")] 
    public async Task<IActionResult> Get(Guid id, CancellationToken ct)
    {
        var item = await _repository.GetAsync(TenantId, id, ct);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public async Task<IActionResult> Create(UserAccount entity, CancellationToken ct)
    {
        entity.TenantId = TenantId;
        var created = await _repository.AddAsync(entity, ct);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPatch("{id:guid}")] 
    public async Task<IActionResult> Patch(Guid id, UserAccount patch, CancellationToken ct)
    {
        var updated = await _repository.UpdateAsync(TenantId, id, current =>
        {
            // TODO: replace with explicit command handlers/validators per aggregate.
            foreach (var p in typeof(UserAccount).GetProperties().Where(p => p.CanWrite && p.Name != "Id" && p.Name != "TenantId"))
            {
                var value = p.GetValue(patch);
                if (value is not null) p.SetValue(current, value);
            }
        }, ct);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id:guid}")] 
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
        => await _repository.DeleteAsync(TenantId, id, ct) ? NoContent() : NotFound();
}
