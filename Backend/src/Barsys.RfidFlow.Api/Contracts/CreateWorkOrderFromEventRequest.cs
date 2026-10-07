namespace Barsys.RfidFlow.Api.Contracts;

public sealed class CreateWorkOrderFromEventRequest
{
    public string Title { get; set; }
        = string.Empty;

    public string Description { get; set; }
        = string.Empty;
}