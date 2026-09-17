using Barsys.RfidFlow.Application.Abstractions;
using Barsys.RfidFlow.Application.Common;
using Barsys.RfidFlow.Domain.Entities;
using MediatR;

namespace Barsys.RfidFlow.Application.Features.Rfid.Commands;

public sealed record CreatePrintJobCommand(
    Guid AssetId,
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
    private readonly ITenantContextAccessor _tenant;

    public CreatePrintJobCommandHandler(
        IRepository<PrintJob> printJobs,
        ITenantContextAccessor tenant)
    {
        _printJobs = printJobs;
        _tenant = tenant;
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

        return await _printJobs.AddAsync(
            printJob,
            cancellationToken);
    }
}