using Barsys.RfidFlow.Api.Observability;
using Barsys.RfidFlow.Application.Abstractions;
using Barsys.RfidFlow.Application.Dtos;
using Barsys.RfidFlow.Application.Features.Rfid.Commands;
using Barsys.RfidFlow.Domain.Entities;
using Barsys.RfidFlow.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Barsys.RfidFlow.Api.Controllers;

[Route("v2/rfid")]
public sealed class RfidController : ApiControllerBase
{
    private readonly ISender _sender;
    private readonly IRepository<RfidTag> _tags;
    private readonly IRepository<RfidReader> _readers;
    private readonly IRepository<RfidReadEvent> _events;
    private readonly RfidFlowMetrics _metrics;

    public RfidController(ISender sender, IRepository<RfidTag> tags, IRepository<RfidReader> readers, IRepository<RfidReadEvent> events, RfidFlowMetrics metrics)
    {
        _sender = sender;
        _tags = tags;
        _readers = readers;
        _events = events;
        _metrics = metrics;
    }

    [HttpGet("tags")]
    public async Task<IActionResult> Tags(int page = 1, int pageSize = 50, CancellationToken ct = default) => Ok(await _tags.ListAsync(TenantId, page, pageSize, ct));

    [HttpPost("tags")]
    public async Task<IActionResult> CreateTag(CreateRfidTagRequest request, CancellationToken ct)
    {
        var tag = new RfidTag { TenantId = TenantId, Epc = request.Epc, Tid = request.Tid, UserMemory = request.UserMemory, Status = RfidTagStatus.Available };
        return StatusCode(StatusCodes.Status201Created, await _tags.AddAsync(tag, ct));
    }

    [HttpGet("readers")]
    public async Task<IActionResult> Readers(int page = 1, int pageSize = 50, CancellationToken ct = default) => Ok(await _readers.ListAsync(TenantId, page, pageSize, ct));

    [HttpPost("readers/{readerId:guid}/heartbeat")]
    public async Task<IActionResult> Heartbeat(Guid readerId, CancellationToken ct)
    {
        await _readers.UpdateAsync(TenantId, readerId, r => { r.Status = DeviceStatus.Online; r.LastHeartbeatAt = DateTimeOffset.UtcNow; }, ct);
        return NoContent();
    }

    [HttpGet("read-events")]
    public async Task<IActionResult> Events(int page = 1, int pageSize = 50, CancellationToken ct = default) => Ok(await _events.ListAsync(TenantId, page, pageSize, ct));

    [HttpPost("read-events")]
    public async Task<ActionResult<IngestionAck>> Ingest(RfidReadEventRequest request, CancellationToken ct)
    {
        var result = await _sender.Send(new IngestRfidReadEventCommand(request.Epc, request.ReaderId, request.AntennaId, request.LocationId, request.Rssi, request.ReadCount ?? 1, request.FirstSeenAt, request.LastSeenAt), ct);
        _metrics.RfidAccepted(1, "single");
        return Accepted(result);
    }

    [HttpPost("read-events/batch")]
    public async Task<ActionResult<BatchIngestionAck>> IngestBatch(RfidReadEventBatchRequest request, CancellationToken ct)
    {
        _metrics.RfidBatch(request.Events.Count, request.SourceId);
        var events = request.Events.Select(e => new IngestRfidReadEventCommand(e.Epc, e.ReaderId, e.AntennaId, e.LocationId, e.Rssi, e.ReadCount ?? 1, e.FirstSeenAt, e.LastSeenAt)).ToList();
        var result = await _sender.Send(new IngestRfidReadEventBatchCommand(request.SourceId, request.SessionId, events), ct);
        _metrics.RfidAccepted(result.Accepted, request.SourceId);
        if (result.Rejected > 0) _metrics.RfidRejected(result.Rejected, request.SourceId);
        return Accepted(result);
    }
}
