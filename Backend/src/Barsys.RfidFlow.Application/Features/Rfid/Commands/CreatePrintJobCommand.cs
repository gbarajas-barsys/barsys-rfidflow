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

    public CreatePrintJobCommandHandler(
        IRepository<PrintJob> printJobs,
        IRepository<RfidPrinter> printers,
        ITenantContextAccessor tenant,
        IRfidPrinterService printerService)
    {
        _printJobs = printJobs;
        _printers = printers;
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

        if (printer is not null)
        {
            var zpl =
            $"""
            ^XA
            ^CF0,40
            ^FO50,50^FDRFIDFLOW^FS
            ^FO50,110^FDEPC:^FS
            ^FO50,160^FD{request.Epc}^FS
            ^FO50,220^FD{request.EncodingType}^FS
            ^XZ
            """;

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