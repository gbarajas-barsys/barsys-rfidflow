using Barsys.RfidFlow.Application.Abstractions;
using Barsys.RfidFlow.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Barsys.RfidFlow.Api.Controllers;

public sealed class RolesController
    : ApiControllerBase
{
    private readonly IRepository<Role> _repository;

    public RolesController(
        IRepository<Role> repository)
    {
        _repository = repository;
    }

    [HttpGet("ping")]
    public IActionResult Ping()
    {
        return Ok("roles-online");
    }

    [HttpGet]
    public async Task<IActionResult> List(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50,
        CancellationToken ct = default)
    {
        return Ok(
            await _repository.ListAsync(
                TenantId,
                page,
                pageSize,
                ct));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Get(
        Guid id,
        CancellationToken ct)
    {
        var item =
            await _repository.GetAsync(
                TenantId,
                id,
                ct);

        return item is null
            ? NotFound()
            : Ok(item);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        Role entity,
        CancellationToken ct)
    {
        entity.TenantId = TenantId;

        var created =
            await _repository.AddAsync(
                entity,
                ct);

        return CreatedAtAction(
            nameof(Get),
            new { id = created.Id },
            created);
    }

    [HttpPatch("{id:guid}")]
    public async Task<IActionResult> Patch(
        Guid id,
        Role patch,
        CancellationToken ct)
    {
        var updated =
            await _repository.UpdateAsync(
                TenantId,
                id,
                current =>
                {
                    foreach (
                        var p in typeof(Role)
                        .GetProperties()
                        .Where(p =>
                            p.CanWrite &&
                            p.Name != "Id" &&
                            p.Name != "TenantId"))
                    {
                        var value =
                            p.GetValue(patch);

                        if (value is not null)
                            p.SetValue(
                                current,
                                value);
                    }
                },
                ct);

        return updated is null
            ? NotFound()
            : Ok(updated);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(
        Guid id,
        CancellationToken ct)
    {
        var deleted =
            await _repository.DeleteAsync(
                TenantId,
                id,
                ct);

        return deleted
            ? NoContent()
            : NotFound();
    }
}