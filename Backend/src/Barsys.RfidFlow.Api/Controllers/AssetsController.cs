using Barsys.RfidFlow.Api.Observability;
using Barsys.RfidFlow.Application.Features.Assets.Commands;
using Barsys.RfidFlow.Application.Features.Assets.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Barsys.RfidFlow.Api.Controllers;

public sealed class AssetsController : ApiControllerBase
{
    private readonly ISender _sender;
    private readonly RfidFlowMetrics _metrics;
    public AssetsController(ISender sender, RfidFlowMetrics metrics)
    {
        _sender = sender;
        _metrics = metrics;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateAssetCommand command, CancellationToken ct)
    {
        var asset = await _sender.Send(command, ct);
        _metrics.AssetCreated();
        return CreatedAtAction(nameof(Get), new { id = asset.Id }, asset);
    }

    [HttpGet("{id:guid}")]
    public IActionResult Get(Guid id) => Ok(new { id, message = "Use query handler expansion for AssetDetail." });

    [HttpPost("{assetId:guid}/assign-tag")]
    public async Task<IActionResult> AssignTag(Guid assetId, AssignTagRequest request, CancellationToken ct)
    {
        var result = await _sender.Send(new AssignTagToAssetCommand(assetId, request.Epc, request.Tid, request.OverwriteExisting), ct);
        if (result.Succeeded) return Ok(result.Data);
        return result.ErrorCode == "NOT_FOUND" ? NotFound(result) : Conflict(result);
    }

    [HttpGet("{assetId:guid}/timeline")]
    public Task<IReadOnlyList<TimelineEventDto>> Timeline(Guid assetId, DateTimeOffset? from, DateTimeOffset? to, CancellationToken ct)
        => _sender.Send(new GetAssetTimelineQuery(assetId, from, to), ct);
}

public sealed record AssignTagRequest(string Epc, string? Tid, bool OverwriteExisting = false);
