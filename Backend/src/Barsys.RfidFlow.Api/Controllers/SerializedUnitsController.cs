using Barsys.RfidFlow.Application.Abstractions;
using Barsys.RfidFlow.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Barsys.RfidFlow.Api.Controllers;

public sealed class SerializedUnitsController : ApiControllerBase
{
    private readonly IRepository<SerializedUnit> _repository;
    private readonly IRepository<Item> _items;

    public SerializedUnitsController(
        IRepository<SerializedUnit> repository,
        IRepository<Item> items)
    {
        _repository = repository;
        _items = items;
    }

    [HttpGet]
    public async Task<IActionResult> List(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 100,
        CancellationToken ct = default)
    {
        var items = await _repository.ListAsync(
            TenantId,
            page,
            pageSize,
            ct);

        return Ok(items);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Get(
        Guid id,
        CancellationToken ct)
    {
        var item = await _repository.GetAsync(
            TenantId,
            id,
            ct);

        return item is null
            ? NotFound()
            : Ok(item);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        SerializedUnit entity,
        CancellationToken ct)
    {
        var item = await _items.GetAsync(
            TenantId,
            entity.ItemId,
            ct);

        if (item is null)
        {
            return BadRequest(
                "El producto no pertenece al tenant actual.");
        }

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
        SerializedUnit patch,
        CancellationToken ct)
    {
        var updated =
            await _repository.UpdateAsync(
                TenantId,
                id,
                current =>
                {
                    foreach (
                        var p in typeof(SerializedUnit)
                        .GetProperties()
                        .Where(x =>
                            x.CanWrite &&
                            x.Name != "Id" &&
                            x.Name != "TenantId"))
                    {
                        var value =
                            p.GetValue(patch);

                        if (value is not null)
                        {
                            p.SetValue(
                                current,
                                value);
                        }
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

    [HttpGet("/v2/Items/{itemId:guid}/SerializedUnits")]
    public async Task<IActionResult> GetByItem(
        Guid itemId,
        CancellationToken ct)
    {
        Console.WriteLine(
            $"TENANT: {TenantId}"
        );

        var all =
            await _repository.ListAsync(
                TenantId,
                1,
                10000,
                ct);

        return Ok(
            all.Where(
                x => x.ItemId == itemId
            ));
    }

}