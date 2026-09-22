using Barsys.RfidFlow.Api.Observability;
using Barsys.RfidFlow.Application.Abstractions;
using Barsys.RfidFlow.Application.Common;
using Barsys.RfidFlow.Application.Dtos;
using Barsys.RfidFlow.Application.Features.Rfid.Commands;
using Barsys.RfidFlow.Domain.Entities;
using Barsys.RfidFlow.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Net.Sockets;
using System.Text;

namespace Barsys.RfidFlow.Api.Controllers;

[Route("v2/rfid")]
public sealed class RfidController : ApiControllerBase
{
    private readonly ISender _sender;

    private readonly IRepository<RfidTag> _tags;

    private readonly IRepository<RfidReader> _readers;

    private readonly IRepository<RfidReadEvent> _events;

    private readonly IRepository<RfidAntenna> _antennas;

    private readonly IRepository<PrintJob> _printJobs;

    private readonly IRepository<RfidPrinter> _printers;

    private readonly IRepository<Asset> _assets;

    private readonly IRepository<Item> _items;

    private readonly RfidFlowMetrics _metrics;

    private readonly IRepository<RfidLabelTemplate> _templates;



    public RfidController(
        ISender sender,
        IRepository<RfidTag> tags,
        IRepository<RfidReader> readers,
        IRepository<RfidAntenna> antennas,
        IRepository<RfidReadEvent> events,
        IRepository<PrintJob> printJobs,
        IRepository<RfidPrinter> printers,
        IRepository<Asset> assets,
        IRepository<Item> items,
        RfidFlowMetrics metrics,
        IRepository<RfidLabelTemplate> templates
        )
    {
        _sender = sender;

        _tags = tags;

        _readers = readers;

        _antennas = antennas;

        _events = events;

        _printJobs = printJobs;

        _printers = printers;

        _items = items;

        _assets = assets;

        _metrics = metrics;

        _templates = templates;
    }

    [HttpGet("tags")]
    public async Task<IActionResult> Tags(int page = 1, int pageSize = 50, CancellationToken ct = default) => Ok(await _tags.ListAsync(TenantId, page, pageSize, ct));

    [HttpPost("tags")]
    public async Task<IActionResult> CreateTag(CreateRfidTagRequest request, CancellationToken ct)
    {
        var tag = new RfidTag { TenantId = TenantId, Epc = request.Epc, Tid = request.Tid, UserMemory = request.UserMemory, Status = RfidTagStatus.Available };
        return StatusCode(StatusCodes.Status201Created, await _tags.AddAsync(tag, ct));
    }

    [HttpPost("epc/generate")]
    public async Task<IActionResult> GenerateEpc(
        GenerateEpcRequest request,
        CancellationToken ct)
    {
        var result =
            await _sender.Send(
                new GenerateEpcCommand(
                    request.Encoding
                ),
                ct);

        return Ok(result);
    }

    [HttpGet("readers")]
    public async Task<IActionResult> Readers(
        int page = 1,
        int pageSize = 50,
        CancellationToken ct = default)
        => Ok(await _readers.ListAsync(
            TenantId,
            page,
            pageSize,
            ct));

    [HttpGet("antennas")]
    public async Task<IActionResult> Antennas(
        int page = 1,
        int pageSize = 50,
        CancellationToken ct = default)
    {
        return Ok(
            await _antennas.ListAsync(
                TenantId,
                page,
                pageSize,
                ct
            )
        );
    }

    [HttpPost("antennas")]
    public async Task<IActionResult> CreateAntenna(
        CreateRfidAntennaRequest request,
        CancellationToken ct)
    {
        var antenna =
            new RfidAntenna
            {
                TenantId = TenantId,

                ReaderId =
                    request.ReaderId,

                PortNumber =
                    request.PortNumber,

                Name =
                    request.Name,

                LocationId =
                    request.LocationId,

                Zone =
                    request.Zone,

                Power =
                    request.Power,

                Enabled =
                    request.Enabled
            };

        var created =
            await _antennas.AddAsync(
                antenna,
                ct
            );

        return StatusCode(
            StatusCodes.Status201Created,
            created
        );
    }

    [HttpPatch("antennas/{id:guid}")]
    public async Task<IActionResult> PatchAntenna(
        Guid id,
        RfidAntenna patch,
        CancellationToken ct)
    {
        var updated =
            await _antennas.UpdateAsync(
                TenantId,
                id,
                current =>
                {
                    if (!string.IsNullOrWhiteSpace(
                        patch.Name))
                    {
                        current.Name =
                            patch.Name;
                    }

                    current.ReaderId =
                        patch.ReaderId;

                    current.PortNumber =
                        patch.PortNumber;

                    current.LocationId =
                        patch.LocationId;

                    current.Zone =
                        patch.Zone;

                    current.Power =
                        patch.Power;

                    current.Enabled =
                        patch.Enabled;
                },
                ct);

        return updated is null
            ? NotFound()
            : Ok(updated);
    }

    [HttpDelete("antennas/{id:guid}")]
    public async Task<IActionResult> DeleteAntenna(
        Guid id,
        CancellationToken ct)
    {
        var deleted =
            await _antennas.DeleteAsync(
                TenantId,
                id,
                ct);

        return deleted
            ? NoContent()
            : NotFound();
    }

    [HttpPost("readers")]
    public async Task<IActionResult> CreateReader(
        CreateRfidReaderRequest request,
        CancellationToken ct)
    {
        var reader = new RfidReader
        {
            TenantId = TenantId,
            Name = request.Name,
            SerialNumber = request.SerialNumber,
            Vendor = Enum.Parse<RfidVendor>(request.Vendor, true),
            Model = request.Model,
            LocationId = request.LocationId,
            IpAddress = request.IpAddress,
            Port = request.Port,
            Enabled = request.Enabled,
            Status = DeviceStatus.Offline
        };

        var created = await _readers.AddAsync(reader, ct);

        return StatusCode(
            StatusCodes.Status201Created,
            created);
    }

    [HttpPatch("readers/{id:guid}")]
    public async Task<IActionResult> PatchReader(
        Guid id,
        RfidReader patch,
        CancellationToken ct)
    {
        var updated =
            await _readers.UpdateAsync(
                TenantId,
                id,
                current =>
                {
                    if (!string.IsNullOrWhiteSpace(patch.Name))
                        current.Name = patch.Name;

                    if (!string.IsNullOrWhiteSpace(patch.SerialNumber))
                        current.SerialNumber = patch.SerialNumber;

                    if (!string.IsNullOrWhiteSpace(patch.Model))
                        current.Model = patch.Model;

                    if (!string.IsNullOrWhiteSpace(patch.IpAddress))
                        current.IpAddress = patch.IpAddress;

                    current.Port = patch.Port;
                    current.Enabled = patch.Enabled;

                    if (patch.LocationId.HasValue)
                        current.LocationId = patch.LocationId;
                },
                ct);

        return updated is null
            ? NotFound()
            : Ok(updated);
    }

    [HttpDelete("readers/{id:guid}")]
    public async Task<IActionResult> DeleteReader(
        Guid id,
        CancellationToken ct)
    {
        var deleted =
            await _readers.DeleteAsync(
                TenantId,
                id,
                ct);

        return deleted
            ? NoContent()
            : NotFound();
    }

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
        var result = await _sender.Send(
        new IngestRfidReadEventCommand(
            request.Epc,
            request.ReaderId,
            request.ReaderSerial,
            request.ReaderName,
            request.ReaderIp,
            request.AntennaPort,
            request.AntennaId,
            request.LocationId,
            request.Rssi,
            request.ReadCount ?? 1,
            request.FirstSeenAt,
            request.LastSeenAt),
        ct);
        return Accepted(result);
    }

    [HttpPost("read-events/batch")]
    public async Task<ActionResult<BatchIngestionAck>> IngestBatch(RfidReadEventBatchRequest request, CancellationToken ct)
    {
        _metrics.RfidBatch(request.Events.Count, request.SourceId);
       var events = request.Events.Select(e =>
        new IngestRfidReadEventCommand(
            e.Epc,
            e.ReaderId,
            e.ReaderSerial,
            e.ReaderName,
            e.ReaderIp,
            e.AntennaPort,
            e.AntennaId,
            e.LocationId,
            e.Rssi,
            e.ReadCount ?? 1,
            e.FirstSeenAt,
            e.LastSeenAt))
        .ToList();
        var result = await _sender.Send(new IngestRfidReadEventBatchCommand(request.SourceId, request.SessionId, events), ct);
        _metrics.RfidAccepted(result.Accepted, request.SourceId);
        if (result.Rejected > 0) _metrics.RfidRejected(result.Rejected, request.SourceId);
        return Accepted(result);
    }

    [HttpPost("print-jobs")]
    public async Task<IActionResult> CreatePrintJob(
        CreatePrintJobRequest request,
        CancellationToken ct)
    {
        var job =
            await _sender.Send(
                new CreatePrintJobCommand(
                    request.AssetId,
                    request.ItemId,
                    request.Epc,
                    request.EncodingType,
                    request.LabelTemplate,
                    request.LabelTemplateId,
                    request.PrinterName,
                    request.RequestedByName,

                    request.IsReprint,

                    request.OriginalPrintJobId,

                    request.ReprintReason
                ),
                ct);

        return Ok(job);
    }

    [HttpGet("print-jobs")]
    public async Task<IActionResult> PrintJobs(
        int page = 1,
        int pageSize = 50,
        CancellationToken ct = default)
    {
        var jobs =
            await _printJobs.ListAsync(
                TenantId,
                page,
                pageSize,
                ct
            );

        var assets =
            await _assets.ListAsync(
                TenantId,
                1,
                1000,
                ct
            );

        var items =
            await _items.ListAsync(
                TenantId,
                1,
                1000,
                ct
            );

        var result =
            jobs.Select(job => new
            {
                job.Id,
                job.AssetId,
                job.Epc,
                job.EncodingType,
                job.LabelTemplate,
                job.PrinterName,
                job.Status,
                job.IsReprint,
                job.ReprintReason,
                job.RequestedByName,
                job.CreatedAt,

                Name =
                    job.AssetId != null
                        ? assets.FirstOrDefault(
                            a => a.Id == job.AssetId
                        )?.Name
                        : items.FirstOrDefault(
                            i => i.Id == job.ItemId
                        )?.Name
            });

        return Ok(result);
    }

    [HttpGet("printers")]
    public async Task<IActionResult> Printers(
        int page = 1,
        int pageSize = 50,
        CancellationToken ct = default)
    {
        var printers =
            await _printers.ListAsync(
                TenantId,
                page,
                pageSize,
                ct
            );

        var result =
            printers.Select(x => new
            {
                x.Id,
                x.Name,
                x.IpAddress,
                x.Port,
                x.Model,
                x.IsDefault,
                x.IsEnabled
            });

        return Ok(result);
    }

    [HttpPost("printers")]
    public async Task<IActionResult> CreatePrinter(
        CreateRfidPrinterRequest request,
        CancellationToken ct)
    {
        var printer =
            new RfidPrinter
            {
                TenantId = TenantId,

                Name = request.Name,

                IpAddress = request.IpAddress,

                Port = request.Port,

                Model = request.Model,

                IsDefault =
                    request.IsDefault,

                IsEnabled =
                    request.IsEnabled
            };

        var created =
            await _printers.AddAsync(
                printer,
                ct
            );

        return StatusCode(
            StatusCodes.Status201Created,
            created
        );
    }

    [HttpPatch("printers/{id:guid}")]
    public async Task<IActionResult> UpdatePrinter(
        Guid id,
        UpdateRfidPrinterRequest request,
        CancellationToken ct)
    {
        var updated =
            await _printers.UpdateAsync(
                TenantId,
                id,
                printer =>
                {
                    printer.Name =
                        request.Name;

                    printer.IpAddress =
                        request.IpAddress;

                    printer.Port =
                        request.Port;

                    printer.Model =
                        request.Model;
                },
                ct);

        return updated is null
            ? NotFound()
            : Ok(updated);
    }

    [HttpPatch("printers/{id:guid}/default")]
    public async Task<IActionResult> SetDefaultPrinter(
        Guid id,
        CancellationToken ct)
    {
        var printers =
            await _printers.ListAsync(
                TenantId,
                1,
                1000,
                ct);

        foreach (var printer in printers)
        {
            await _printers.UpdateAsync(
                TenantId,
                printer.Id,
                p =>
                {
                    p.IsDefault =
                        p.Id == id;
                },
                ct);
        }

        return NoContent();
    }

    [HttpPatch("printers/{id:guid}/enable")]
    public async Task<IActionResult> EnablePrinter(
        Guid id,
        CancellationToken ct)
    {
        var updated =
            await _printers.UpdateAsync(
                TenantId,
                id,
                printer =>
                {
                    printer.IsEnabled = true;
                },
                ct);

        return updated is null
            ? NotFound()
            : Ok(updated);
    }

    [HttpPatch("printers/{id:guid}/disable")]
    public async Task<IActionResult> DisablePrinter(
        Guid id,
        CancellationToken ct)
    {
        var updated =
            await _printers.UpdateAsync(
                TenantId,
                id,
                printer =>
                {
                    printer.IsEnabled = false;
                },
                ct);

        return updated is null
            ? NotFound()
            : Ok(updated);
    }

    [HttpPost("printers/{id:guid}/test")]
    public async Task<IActionResult> TestPrinter(
        Guid id,
        CancellationToken ct)
    {
        var printers =
            await _printers.ListAsync(
                TenantId,
                1,
                1000,
                ct);

        var printer =
            printers.FirstOrDefault(
                x => x.Id == id
            );

        if (printer is null)
            return NotFound();

        try
        {
            using var client =
                new TcpClient();

            var connectTask =
                client.ConnectAsync(
                    printer.IpAddress,
                    printer.Port
                );

            var timeoutTask =
                Task.Delay(
                    TimeSpan.FromSeconds(3),
                    ct
                );

            var completed =
                await Task.WhenAny(
                    connectTask,
                    timeoutTask
                );

            if (completed == timeoutTask)
            {
                return Ok(
                    new
                    {
                        status = "Offline"
                    }
                );
            }

            return Ok(
                new
                {
                    status = "Online"
                }
            );
        }
        catch
        {
            return Ok(
                new
                {
                    status = "Offline"
                }
            );
        }
    }

    [HttpPost("printers/{id:guid}/print-test")]
    public async Task<IActionResult> PrintTest(
        Guid id,
        CancellationToken ct)
    {
        var printers =
            await _printers.ListAsync(
                TenantId,
                1,
                1000,
                ct);

        var printer =
            printers.FirstOrDefault(
                x => x.Id == id
            );

        if (printer is null)
        {
            return NotFound();
        }

        try
        {
            using var client =
                new TcpClient();

            await client.ConnectAsync(
                printer.IpAddress,
                printer.Port,
                ct);

            using var stream =
                client.GetStream();

            var zpl =
            """
            ^XA
            ^CF0,40
            ^FO50,50^FDRFIDFLOW TEST^FS
            ^FO50,110^FDPrinter Connected^FS
            ^FO50,170^FDTCP 9100 OK^FS
            ^FO50,230^FDHELLO PAPORRO^FS
            ^XZ
            """;

            var bytes =
                Encoding.ASCII.GetBytes(
                    zpl
                );

            await stream.WriteAsync(
                bytes,
                ct
            );

            await stream.FlushAsync(
                ct
            );

            return Ok(
                new
                {
                    status = "Printed"
                }
            );
        }
        catch (Exception ex)
        {
            return BadRequest(
                new
                {
                    status = "Error",
                    error = ex.Message
                }
            );
        }
    }

    [HttpGet("templates")]
    public async Task<IActionResult> Templates(
        int page = 1,
        int pageSize = 100,
        CancellationToken ct = default)
    {
        return Ok(
            await _templates.ListAsync(
                TenantId,
                page,
                pageSize,
                ct
            )
        );
    }

    [HttpPost("templates")]
    public async Task<IActionResult> CreateTemplate(
        RfidLabelTemplate request,
        CancellationToken ct)
    {
        request.TenantId =
            TenantId;

        var template =
            await _templates.AddAsync(
                request,
                ct
            );

        return Ok(template);
    }

    [HttpGet("templates/variables")]
    public IActionResult TemplateVariables()
    {
        return Ok(
            RfidTemplateVariables.All
        );
    }

    [HttpGet("templates/{id:guid}")]
    public async Task<IActionResult> Template(
        Guid id,
        CancellationToken ct)
    {
        var templates =
            await _templates.ListAsync(
                TenantId,
                1,
                1000,
                ct
            );

        return Ok(
            templates.FirstOrDefault(
                x => x.Id == id
            )
        );
    }

    [HttpPatch("templates/{id:guid}")]
    public async Task<IActionResult> UpdateTemplate(
        Guid id,
        RfidLabelTemplate request,
        CancellationToken ct)
    {
        var updated =
            await _templates.UpdateAsync(
                TenantId,
                id,
                current =>
                {
                    current.Name =
                        request.Name;

                    current.Code =
                        request.Code;

                    current.TemplateType =
                        request.TemplateType;

                    current.ZplTemplate =
                        request.ZplTemplate;

                    current.IsDefault =
                        request.IsDefault;

                    current.IsActive =
                        request.IsActive;
                },
                ct);

        return Ok(updated);
    }


    [HttpPost("print-jobs/{id:guid}/process")]
    public async Task<IActionResult> ProcessPrintJob(
        Guid id,
        CancellationToken ct)
    {
        var updated =
            await _printJobs.UpdateAsync(
                TenantId,
                id,
                current =>
                {
                    current.Status =
                        "Completed";

                    current.ProcessedAt =
                        DateTimeOffset.UtcNow;

                    current.AttemptCount++;
                },
                ct);

        return updated is null
            ? NotFound()
            : Ok(updated);
    }

    [HttpPost("print-jobs/{id:guid}/fail")]
    public async Task<IActionResult> FailPrintJob(
        Guid id,
        CancellationToken ct)
    {
        var updated =
            await _printJobs.UpdateAsync(
                TenantId,
                id,
                current =>
                {
                    current.Status =
                        "Failed";

                    current.ProcessedAt =
                        DateTimeOffset.UtcNow;

                    current.AttemptCount++;

                    current.FailureReason =
                        "Printer Offline";
                },
                ct);

        return updated is null
            ? NotFound()
            : Ok(updated);
    }

    [HttpPost("print-jobs/{id:guid}/complete")]
    public async Task<IActionResult> CompletePrintJob(
        Guid id,
        CancellationToken ct)
    {
        var updated =
            await _printJobs.UpdateAsync(
                TenantId,
                id,
                job =>
                {
                    job.Status =
                        "Completed";

                    job.ProcessedAt =
                        DateTimeOffset.UtcNow;
                },
                ct);

        return Ok(updated);
    }

    
}

public sealed record GenerateEpcRequest(
    string Encoding
);

public sealed record CreatePrintJobRequest(
    Guid? AssetId,
    Guid? ItemId,
    string Epc,
    string EncodingType,
    string LabelTemplate,
    Guid? LabelTemplateId,
    string PrinterName,
    string? RequestedByName,

    bool IsReprint,

    Guid? OriginalPrintJobId,

    string? ReprintReason
);

public sealed record CreateRfidPrinterRequest(
    string Name,
    string IpAddress,
    int Port,
    string Model,
    bool IsDefault,
    bool IsEnabled
);

public sealed record UpdateRfidPrinterRequest(
    string Name,
    string IpAddress,
    int Port,
    string Model
);