using Barsys.RfidFlow.Application.Dtos;
using FluentValidation;
using MediatR;

namespace Barsys.RfidFlow.Application.Features.Rfid.Commands;

public sealed record IngestRfidReadEventBatchCommand(string SourceId, Guid? SessionId, IReadOnlyList<IngestRfidReadEventCommand> Events) : IRequest<BatchIngestionAck>;

public sealed class IngestRfidReadEventBatchCommandValidator : AbstractValidator<IngestRfidReadEventBatchCommand>
{
    public IngestRfidReadEventBatchCommandValidator()
    {
        RuleFor(x => x.SourceId).NotEmpty().MaximumLength(120);
        RuleFor(x => x.Events).NotEmpty().Must(x => x.Count <= 10000).WithMessage("El lote no puede exceder 10,000 lecturas.");
        RuleForEach(x => x.Events).SetValidator(new IngestRfidReadEventCommandValidator());
    }
}

public sealed class IngestRfidReadEventBatchCommandHandler : IRequestHandler<IngestRfidReadEventBatchCommand, BatchIngestionAck>
{
    private readonly ISender _sender;
    public IngestRfidReadEventBatchCommandHandler(ISender sender) => _sender = sender;

    public async Task<BatchIngestionAck> Handle(IngestRfidReadEventBatchCommand request, CancellationToken cancellationToken)
    {
        var accepted = 0;
        var errors = new List<ErrorResponse>();
        foreach (var item in request.Events)
        {
            try
            {
                await _sender.Send(item, cancellationToken);
                accepted++;
            }
            catch (Exception ex)
            {
                errors.Add(new ErrorResponse("RFID_EVENT_REJECTED", ex.Message, Guid.NewGuid().ToString()));
            }
        }
        return new BatchIngestionAck(accepted, errors.Count, Guid.NewGuid(), errors);
    }
}
