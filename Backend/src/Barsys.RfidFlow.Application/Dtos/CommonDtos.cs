namespace Barsys.RfidFlow.Application.Dtos;

public sealed record PagedResult<T>(int Page, int PageSize, int TotalItems, IReadOnlyList<T> Items)
{
    public int TotalPages => PageSize <= 0 ? 0 : (int)Math.Ceiling((double)TotalItems / PageSize);
    public bool HasNextPage => Page < TotalPages;
    public bool HasPreviousPage => Page > 1;
}

public sealed record ErrorResponse(string Code, string Message, string TraceId, object? Details = null);
public sealed record StatusResponse(string Status, DateTimeOffset Timestamp);
