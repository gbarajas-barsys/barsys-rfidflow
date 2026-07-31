using Barsys.RfidFlow.Application.Abstractions;
using Barsys.RfidFlow.Application.Features.WorkOrders.Commands;
using Barsys.RfidFlow.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Barsys.RfidFlow.Api.Controllers;

[Route("v2/work-orders")]
public sealed class WorkOrdersController : ApiControllerBase
{
    private readonly ISender _sender;
    private readonly IRepository<WorkOrder> _workOrders;
    public WorkOrdersController(ISender sender, IRepository<WorkOrder> workOrders)
    {
        _sender = sender;
        _workOrders = workOrders;
    }

    [HttpGet]
    public async Task<IActionResult> List(int page = 1, int pageSize = 50, CancellationToken ct = default)
        => Ok(await _workOrders.ListAsync(TenantId, page, pageSize, ct));

    [HttpPost]
    public async Task<IActionResult> Create(CreateWorkOrderCommand command, CancellationToken ct)
    {
        var workOrder = await _sender.Send(command, ct);
        return StatusCode(StatusCodes.Status201Created, workOrder);
    }
}
