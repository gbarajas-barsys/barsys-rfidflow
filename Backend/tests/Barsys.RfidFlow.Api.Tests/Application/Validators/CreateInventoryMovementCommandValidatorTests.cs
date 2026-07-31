using Barsys.RfidFlow.Application.Features.Inventory.Commands;
using Barsys.RfidFlow.Domain.Enums;
using Xunit;

namespace Barsys.RfidFlow.Api.Tests.Application.Validators;

public sealed class CreateInventoryMovementCommandValidatorTests
{
    private readonly CreateInventoryMovementCommandValidator _validator = new();

    [Fact]
    public async Task Valid_Command_Passes()
    {
        var command = new CreateInventoryMovementCommand(InventoryMovementType.Transfer, Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid(), 10, "LOT-1", "test", Guid.NewGuid(), DateTimeOffset.UtcNow);
        var result = await _validator.ValidateAsync(command);
        Assert.True(result.IsValid);
    }

    [Fact]
    public async Task Quantity_Zero_Fails()
    {
        var command = new CreateInventoryMovementCommand(InventoryMovementType.Transfer, Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid(), 0, null, null, null, DateTimeOffset.UtcNow);
        var result = await _validator.ValidateAsync(command);
        Assert.False(result.IsValid);
    }

    [Fact]
    public async Task Missing_Source_And_Target_Location_Fails()
    {
        var command = new CreateInventoryMovementCommand(InventoryMovementType.Transfer, Guid.NewGuid(), null, null, 1, null, null, null, DateTimeOffset.UtcNow);
        var result = await _validator.ValidateAsync(command);
        Assert.False(result.IsValid);
    }
}
