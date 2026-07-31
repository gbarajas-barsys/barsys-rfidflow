using Barsys.RfidFlow.Application.Features.WorkOrders.Commands;
using Xunit;

namespace Barsys.RfidFlow.Api.Tests.Application.Validators;

public sealed class CreateWorkOrderCommandValidatorTests
{
    private readonly CreateWorkOrderCommandValidator _validator = new();

    [Fact]
    public async Task Valid_Command_Passes()
    {
        var command = new CreateWorkOrderCommand("asset_move", "Mover activo", null, "high", null, DateTimeOffset.UtcNow.AddDays(1));
        var result = await _validator.ValidateAsync(command);
        Assert.True(result.IsValid);
    }

    [Fact]
    public async Task Invalid_Priority_Fails()
    {
        var command = new CreateWorkOrderCommand("asset_move", "Mover activo", null, "invalid", null, null);
        var result = await _validator.ValidateAsync(command);
        Assert.False(result.IsValid);
    }
}
