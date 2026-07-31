using Barsys.RfidFlow.Application.Abstractions;
using Barsys.RfidFlow.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Barsys.RfidFlow.Api.Controllers;

public sealed class ItemsController : ApiControllerBase
{
    private readonly IRepository<Item> _repository;
    public ItemsController(IRepository<Item> repository) => _repository = repository;

    [HttpGet]
    public async Task<IActionResult> List([FromQuery] int page = 1, [FromQuery] int pageSize = 50, CancellationToken ct = default)
        => Ok(await _repository.ListAsync(TenantId, page, pageSize, ct));

    [HttpGet("{id:guid}")] 
    public async Task<IActionResult> Get(Guid id, CancellationToken ct)
    {
        var item = await _repository.GetAsync(TenantId, id, ct);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Item entity, CancellationToken ct)
    {
        entity.TenantId = TenantId;
        var created = await _repository.AddAsync(entity, ct);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPatch("{id:guid}")] 
    public async Task<IActionResult> Patch(Guid id, Item patch, CancellationToken ct)
    {
        var updated = await _repository.UpdateAsync(TenantId, id, current =>
        {
            // TODO: replace with explicit command handlers/validators per aggregate.
            foreach (var p in typeof(Item).GetProperties().Where(p => p.CanWrite && p.Name != "Id" && p.Name != "TenantId"))
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
