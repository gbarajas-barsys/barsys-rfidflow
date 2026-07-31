namespace Barsys.RfidFlow.Application.Common;

public sealed record OperationResult<T>(bool Succeeded, T? Data, string? ErrorCode = null, string? ErrorMessage = null)
{
    public static OperationResult<T> Success(T data) => new(true, data);
    public static OperationResult<T> NotFound(string message) => new(false, default, "NOT_FOUND", message);
    public static OperationResult<T> Conflict(string message) => new(false, default, "CONFLICT", message);
    public static OperationResult<T> Invalid(string message) => new(false, default, "INVALID", message);
}
