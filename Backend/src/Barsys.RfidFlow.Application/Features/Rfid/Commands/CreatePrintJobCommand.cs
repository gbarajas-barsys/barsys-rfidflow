using Barsys.RfidFlow.Application.Abstractions;
using Barsys.RfidFlow.Application.Common;
using Barsys.RfidFlow.Domain.Entities;
using MediatR;

namespace Barsys.RfidFlow.Application.Features.Rfid.Commands;

public sealed record CreatePrintJobCommand(
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
) : IRequest<PrintJob>;

public sealed class CreatePrintJobCommandHandler
    : IRequestHandler<
        CreatePrintJobCommand,
        PrintJob>
{
    private readonly IRepository<PrintJob> _printJobs;
    private readonly IRepository<RfidPrinter> _printers;
    private readonly ITenantContextAccessor _tenant;
    private readonly IRfidPrinterService _printerService;
    private readonly IRepository<RfidLabelTemplate> _templates;
    private readonly IRepository<Asset> _assets;
    private readonly IRepository<Item> _items;

    public CreatePrintJobCommandHandler(
        IRepository<PrintJob> printJobs,
        IRepository<RfidPrinter> printers,
        IRepository<RfidLabelTemplate> templates,
        IRepository<Asset> assets,
        IRepository<Item> items,
        ITenantContextAccessor tenant,
        IRfidPrinterService printerService)
    {
        _printJobs = printJobs;
        _printers = printers;
        _templates = templates;
        _assets = assets;
        _items = items;
        _tenant = tenant;
        _printerService = printerService;
    }

    public async Task<PrintJob> Handle(
        CreatePrintJobCommand request,
        CancellationToken cancellationToken)
    {
       
        var printJob =
            new PrintJob
            {
                TenantId =
                    _tenant.Current.TenantId,

                AssetId =
                    request.AssetId,

                ItemId =
                    request.ItemId,

                Epc =
                    request.Epc,

                EncodingType =
                    request.EncodingType,

                LabelTemplate =
                    request.LabelTemplate,

                LabelTemplateId =
                    request.LabelTemplateId,

                PrinterName =
                    request.PrinterName,

                Status =
                    "Pending",

                RequestedByName =
                    request.RequestedByName,

                IsReprint =
                    request.IsReprint,

                OriginalPrintJobId =
                    request.OriginalPrintJobId,

                ReprintReason =
                    request.ReprintReason
            };

        var job =
            await _printJobs.AddAsync(
                printJob,
                cancellationToken);

        var printers =
            await _printers.ListAsync(
                _tenant.Current.TenantId,
                1,
                1000,
                cancellationToken
            );

        var printer =
            printers.FirstOrDefault(
                x =>
                    x.Name ==
                    request.PrinterName
            );

        var templates =
            await _templates.ListAsync(
                _tenant.Current.TenantId,
                1,
                1000,
                cancellationToken);

        var template =
            templates.FirstOrDefault(
                x => x.Id == request.LabelTemplateId);

        var assets =
            await _assets.ListAsync(
                _tenant.Current.TenantId,
                1,
                1000,
                cancellationToken);

        var items =
            await _items.ListAsync(
                _tenant.Current.TenantId,
                1,
                1000,
                cancellationToken);

        var asset =
            assets.FirstOrDefault(
                x => x.Id == request.AssetId);

        var item =
            items.FirstOrDefault(
                x => x.Id == request.ItemId);

        if (printer is not null)
        {
            var zpl =
    template?.ZplTemplate;

Console.WriteLine("TEMPLATE ORIGINAL:");
Console.WriteLine(zpl);

var mexicoNow =
    TimeZoneInfo.ConvertTimeBySystemTimeZoneId(
        DateTime.UtcNow,
        "Central Standard Time"
    );

zpl ??= string.Empty;

zpl = zpl
    .Replace("{{EPC}}", request.Epc ?? string.Empty)

    .Replace("{{ENCODING_TYPE}}",
        request.EncodingType ?? string.Empty)

    .Replace("{{DATE}}",
        mexicoNow.ToString("yyyy-MM-dd"))

    .Replace("{{TIME}}",
        mexicoNow.ToString("HH:mm:ss"))

    .Replace("{{ASSET_NAME}}",
        asset?.Name ?? string.Empty)

    .Replace("{{ASSET_NUMBER}}",
        asset?.AssetNumber ?? string.Empty)

    .Replace("{{SERIAL_NUMBER}}",
        asset?.SerialNumber ?? string.Empty)

    .Replace("{{BRAND}}",
        asset?.Brand ?? string.Empty)

    .Replace("{{MODEL}}",
        asset?.Model ?? string.Empty)

    .Replace("{{PART_NUMBER}}",
        asset?.PartNumber ?? string.Empty)


    .Replace("{{ITEM_NAME}}",
        item?.Name ?? string.Empty)

    .Replace("{{SKU}}",
        item?.Sku ?? string.Empty)

    .Replace("{{PRINTER_NAME}}",
        printer.Name ?? string.Empty);



Console.WriteLine("TEMPLATE FINAL:");
Console.WriteLine(zpl);

            await _printerService.PrintAsync(
                printer.IpAddress,
                printer.Port,
                zpl,
                cancellationToken
            );

            await _printJobs.UpdateAsync(
                _tenant.Current.TenantId,
                job.Id,
                current =>
                {
                    current.Status =
                        "Completed";

                    current.ProcessedAt =
                        DateTimeOffset.UtcNow;

                    current.AttemptCount++;
                },
                cancellationToken
            );
        }

        return job;
    }
}