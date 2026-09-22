using Barsys.RfidFlow.Api.Observability;
using Barsys.RfidFlow.Application.Abstractions;
using Barsys.RfidFlow.Application.Dtos;
using Barsys.RfidFlow.Application.Features.Assets.Commands;
using Barsys.RfidFlow.Application.Features.Assets.Queries;
using Barsys.RfidFlow.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Barsys.RfidFlow.Api.Controllers;

public sealed class AssetsController : ApiControllerBase
{
    private readonly ISender _sender;
    private readonly RfidFlowMetrics _metrics;

    private readonly IRepository<Asset> _assets;

    public AssetsController(
        ISender sender,
        RfidFlowMetrics metrics,
        IRepository<Asset> assets)
    {
        _sender = sender;
        _metrics = metrics;
        _assets = assets;
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        CreateAssetCommand command,
        CancellationToken ct)
    {
        var asset = await _sender.Send(command, ct);

        _metrics.AssetCreated();

        return CreatedAtAction(
            nameof(Get),
            new { id = asset.Id },
            asset);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Get(
        Guid id,
        CancellationToken ct)
    {
        var asset =
            await _sender.Send(
                new GetAssetDetailQuery(id),
                ct);

        if (asset is null)
            return NotFound();

        return Ok(asset);
    }

    [HttpPost("{assetId:guid}/assign-tag")]
    public async Task<IActionResult> AssignTag(
        Guid assetId,
        AssignTagRequest request,
        CancellationToken ct)
    {
        var result = await _sender.Send(
            new AssignTagToAssetCommand(
                assetId,
                request.Epc,
                request.Tid,
                request.EncodingType,
                request.OverwriteExisting),
            ct);

        if (result.Succeeded)
            return Ok(result.Data);

        return result.ErrorCode == "NOT_FOUND"
            ? NotFound(result)
            : Conflict(result);
    }

    [HttpGet("{assetId:guid}/timeline")]
    public Task<IReadOnlyList<TimelineEventDto>> Timeline(
        Guid assetId,
        DateTimeOffset? from,
        DateTimeOffset? to,
        CancellationToken ct)
    {
        return _sender.Send(
            new GetAssetTimelineQuery(assetId, from, to),
            ct);
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAll(
        CancellationToken ct)
    {
        var assets =
            await _sender.Send(
                new GetAssetsQuery(),
                ct);

        return Ok(assets);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(
        Guid id,
        CancellationToken ct)
    {
        var deleted =
            await _assets.DeleteAsync(
                TenantId,
                id,
                ct);

        return deleted
            ? NoContent()
            : NotFound();
    }

    [HttpPatch("{id:guid}")]
    public async Task<IActionResult> Patch(
        Guid id,
        Asset patch,
        CancellationToken ct)
    {
        var updated =
            await _assets.UpdateAsync(
                TenantId,
                id,
                current =>
                {
                    current.Name =
                        patch.Name;

                    current.Description =
                        patch.Description;

                    current.SerialNumber =
                        patch.SerialNumber;

                    current.Brand =
                        patch.Brand;

                    current.Model =
                        patch.Model;

                    current.PartNumber =
                        patch.PartNumber;

                    current.LocationId =
                        patch.LocationId;
                },
                ct);

        return updated is null
            ? NotFound()
            : Ok(updated);
    }

}



public sealed record AssignTagRequest(
    string Epc,
    string? Tid,
    string? EncodingType,
    bool OverwriteExisting = false);
