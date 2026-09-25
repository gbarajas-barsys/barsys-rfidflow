using Barsys.RfidFlow.Application.Abstractions;
using Barsys.RfidFlow.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Barsys.RfidFlow.Infrastructure.Persistence;

namespace Barsys.RfidFlow.Api.Controllers;

public sealed class TenantsController : ApiControllerBase
{
    private readonly IRepository<Tenant> _repository;
    private readonly RfidFlowDbContext _db;
    public TenantsController(
        IRepository<Tenant> repository,
        RfidFlowDbContext db)
        {
        _repository = repository;
        _db = db;
        }

    [HttpGet]
public async Task<IActionResult> List(
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 50,
    CancellationToken ct = default)
{
    return Ok(await _repository.ListAsync(
        TenantId,
        page,
        pageSize,
        ct));
}

    [HttpGet("{id:guid}")] 
    public async Task<IActionResult> Get(Guid id, CancellationToken ct)
    {
        var item = await _repository.GetAsync(TenantId, id, ct);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        Tenant entity,
        CancellationToken ct)
    {
        entity.TenantId = entity.Id;

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
    public async Task<IActionResult> Patch(Guid id, Tenant patch, CancellationToken ct)
    {
        var updated = await _repository.UpdateAsync(TenantId, id, current =>
        {
            // TODO: replace with explicit command handlers/validators per aggregate.
            foreach (var p in typeof(Tenant).GetProperties().Where(p => p.CanWrite && p.Name != "Id" && p.Name != "TenantId"))
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

    [HttpGet("all")]
    public IActionResult All()
    {
        return Ok(
            _db.Tenants
                .OrderBy(x => x.Name)
                .ToList()
        );
    }
}
