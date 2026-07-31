using Barsys.RfidFlow.Api.Observability;
using Barsys.RfidFlow.Application.Features.Inventory.Commands;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Barsys.RfidFlow.Api.Controllers;

[Route("v2/inventory")]
public sealed class InventoryController : ApiControllerBase
{
    private readonly ISender _sender;
    private readonly RfidFlowMetrics _metrics;
    public InventoryController(ISender sender, RfidFlowMetrics metrics)
    {
        _sender = sender;
        _metrics = metrics;
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
