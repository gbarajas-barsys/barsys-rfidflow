using Barsys.RfidFlow.Api.Observability;
using Barsys.RfidFlow.Application.Features.Inventory.Commands;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Barsys.RfidFlow.Application.Abstractions;
using Barsys.RfidFlow.Domain.Entities;

namespace Barsys.RfidFlow.Api.Controllers;

[Route("v2/inventory")]
public sealed class InventoryController : ApiControllerBase
{
    private readonly ISender _sender;
    private readonly RfidFlowMetrics _metrics;
    private readonly IRepository<InventoryMovement> _repository;

    public InventoryController(
        ISender sender,
        RfidFlowMetrics metrics,
        IRepository<InventoryMovement> repository)
    {
        _sender = sender;
        _metrics = metrics;
        _repository = repository;
    }

    [HttpGet("movements")]
    public async Task<IActionResult> GetMovements(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50,
        CancellationToken ct = default)
    {
        var result =
            await _repository.ListAsync(
                TenantId,
                page,
                pageSize,
                ct);

        return Ok(result);
    }

    [HttpPost("movements")]
    public async Task<IActionResult> CreateMovement(CreateInventoryMovementCommand command, CancellationToken ct)
    {
        var movement = await _sender.Send(command, ct);
        _metrics.InventoryMovementCreated();
        return StatusCode(StatusCodes.Status201Created, movement);
    }

    [HttpPost("counts/{countId:guid}/complete")]
    public async Task<IActionResult> CompleteCount(Guid countId, CancellationToken ct)
    {
        var result = await _sender.Send(new CompleteInventoryCountCommand(countId), ct);
        return result.Succeeded ? Ok(result.Data) : BadRequest(result);
    }
}
