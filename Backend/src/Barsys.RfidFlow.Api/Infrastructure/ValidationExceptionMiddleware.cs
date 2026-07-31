using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace Barsys.RfidFlow.Api.Infrastructure;

public sealed class ValidationExceptionMiddleware
{
    private readonly RequestDelegate _next;
    public ValidationExceptionMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ValidationException ex)
        {
            var problem = new ValidationProblemDetails(
                ex.Errors
                    .GroupBy(e => e.PropertyName)
                    .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray()))
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Validation failed",
                Detail = "One or more validation rules failed.",
                Instance = context.Request.Path
            };
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            await context.Response.WriteAsJsonAsync(problem);
        }
    }
}
