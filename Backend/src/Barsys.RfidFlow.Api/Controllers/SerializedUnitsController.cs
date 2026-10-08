using Barsys.RfidFlow.Application.Abstractions;
using Barsys.RfidFlow.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Barsys.RfidFlow.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Barsys.RfidFlow.Api.Contracts;
using Barsys.RfidFlow.Domain.Enums;

namespace Barsys.RfidFlow.Api.Controllers;

public sealed class SerializedUnitsController : ApiControllerBase
{
    private readonly IRepository<SerializedUnit> _repository;
    private readonly IRepository<Item> _items;
    private readonly IRepository<SerializedUnitEvent> _events;
    private readonly IRepository<WorkOrder> _workOrders;
    private readonly IRepository<InventoryMovement> _inventoryMovements;

    public sealed class RegisterShipmentRequest
    {
        public string? InvoiceNumber { get; set; }

        public string? CustomerName { get; set; }

        public string? Comments { get; set; }
    }

    public SerializedUnitsController(
        IRepository<SerializedUnit> repository,
        IRepository<Item> items,
        IRepository<SerializedUnitEvent> events,
        IRepository<WorkOrder> workOrders,
        IRepository<InventoryMovement> inventoryMovements)
    {
        _repository = repository;
        _items = items;
        _events = events;
        _workOrders = workOrders;
        _inventoryMovements = inventoryMovements;
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

        await _events.AddAsync(
        new SerializedUnitEvent
        {
            Id = Guid.NewGuid(),

            SerializedUnitId =
                created.Id,

            EventType =
                 "CREATED",

            OccurredAt =
                DateTime.UtcNow,

            TenantId =
                TenantId
        },
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

        if (
            existing.Epc is null &&
            !string.IsNullOrWhiteSpace(
                updated?.Epc
            )
        )
        {
            await _events.AddAsync(
                new SerializedUnitEvent
                {
                    Id = Guid.NewGuid(),

                    SerializedUnitId =
                        updated.Id,

                    EventType =
                        "RFID_TAGGED",

                    OccurredAt =
                        DateTime.UtcNow,

                    TenantId =
                        TenantId,

                    Comments =
                        $"EPC asignado: {updated.Epc}"
                },
                ct);
        }

        return updated is null
            ? NotFound()
            : Ok(updated);
    }

    [HttpGet("{id:guid}/history")]
    public async Task<IActionResult> GetHistory(
        Guid id,
        [FromServices] RfidFlowDbContext db,
        CancellationToken ct)
    {
        var events =
            await db.SerializedUnitEvents
                .AsNoTracking()
                .Where(x =>
                    x.SerializedUnitId == id)
                .OrderByDescending(x =>
                    x.OccurredAt)
                .ToListAsync(ct);

        return Ok(events);
    }

    [HttpPost("{id:guid}/reingreso")]
    public async Task<IActionResult> RegisterReingreso(
        Guid id,
        ReingresoRequest request,
        CancellationToken ct)
    {
        Console.WriteLine(
            $"TENANT EN REINGRESO: {TenantId}"
        );
        await _events.AddAsync(
            new SerializedUnitEvent
            {
                Id = Guid.NewGuid(),

                SerializedUnitId = id,

                EventType = "REINGRESO",

                OccurredAt = DateTime.UtcNow,

                TenantId = TenantId,

                Comments =
                    request.Motivo
            },
            ct);

        return Ok();
    }

    [HttpPost("{id:guid}/shipment")]
    public async Task<IActionResult> RegisterShipment(
        Guid id,
        RegisterShipmentRequest request,
        CancellationToken ct)
    {
        var unit =
            await _repository.GetAsync(
                TenantId,
                id,
                ct);

        if (unit is null)
        {
            return NotFound();
        }

        await _events.AddAsync(
            new SerializedUnitEvent
            {
                Id = Guid.NewGuid(),

                SerializedUnitId = id,

                EventType = "SALIDA",

                OccurredAt =
                    DateTime.UtcNow,

                TenantId =
                    TenantId,

                Comments =
                    $"Factura: {request.InvoiceNumber} | Cliente: {request.CustomerName} | {request.Comments}"
            },
            ct);

        await _inventoryMovements.AddAsync(
            new InventoryMovement
            {
                TenantId = TenantId,

                ItemId = unit.ItemId,

                MovementType =
                    InventoryMovementType.Shipment,

                Quantity = 1,

                OccurredAt =
                    DateTimeOffset.UtcNow
            },
            ct);

        return Ok();
    }

    [HttpPost("events/{eventId:guid}/work-order")]
    public async Task<IActionResult> CreateWorkOrder(
        Guid eventId,
        [FromBody] CreateWorkOrderFromEventRequest request,
        CancellationToken ct)
    {
        var ev =
            await _events.GetAsync(
                TenantId,
                eventId,
                ct);

        if (ev is null)
        {
            return NotFound();
        }

        if (ev.WorkOrderId.HasValue)
        {
            return BadRequest(
                "El evento ya tiene una Work Order."
            );
        }

        var wo =
            await _workOrders.AddAsync(
                new WorkOrder
                {
                    TenantId = TenantId,

                    WorkOrderNumber =
                        $"WO-{DateTime.UtcNow:yyyyMMddHHmmssfff}",

                    Type = "warranty",

                    Title = request.Title,

                    Description = request.Description,

                    Priority = "medium",

                    Status = Domain.Enums.WorkOrderStatus.Open
                },
                ct
            );

        await _events.UpdateAsync(
            TenantId,
            eventId,
            x =>
            {
                x.WorkOrderId = wo.Id;
            },
            ct);

        return Ok(wo);
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

    [HttpGet("events/debug")]
    public async Task<IActionResult> DebugEvents(
        [FromServices] RfidFlowDbContext db,
        CancellationToken ct)
    {
        return Ok(
            await db.SerializedUnitEvents
                .AsNoTracking()
                .ToListAsync(ct)
        );
    }

}