using Barsys.RfidFlow.Application.Features.Assets.Commands;
using Xunit;

namespace Barsys.RfidFlow.Api.Tests.Application.Validators;

public sealed class AssignTagToAssetCommandValidatorTests
{
    private readonly AssignTagToAssetCommandValidator _validator = new();

    [Fact]
    public async Task Valid_Command_Passes()
    {
        var command = new AssignTagToAssetCommand(Guid.NewGuid(), "E2000017221101441890ABCD", null, false);
        var result = await _validator.ValidateAsync(command);
        Assert.True(result.IsValid);
    }

    [Fact]
    public async Task Empty_AssetId_Fails()
    {
        var command = new AssignTagToAssetCommand(Guid.Empty, "E2000017221101441890ABCD", null, false);
        var result = await _validator.ValidateAsync(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == nameof(AssignTagToAssetCommand.AssetId));
    }

    [Fact]
    public async Task Empty_Epc_Fails()
    {
        var command = new AssignTagToAssetCommand(Guid.NewGuid(), "", null, false);
        var result = await _validator.ValidateAsync(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == nameof(AssignTagToAssetCommand.Epc));
    }
}
