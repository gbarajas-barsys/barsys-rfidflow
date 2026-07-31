using Barsys.RfidFlow.Application.Features.Assets.Commands;
using Barsys.RfidFlow.Domain.Enums;
using Xunit;

namespace Barsys.RfidFlow.Api.Tests.Application.Validators;

public sealed class CreateAssetCommandValidatorTests
{
    private readonly CreateAssetCommandValidator _validator = new();

    [Fact]
    public async Task Valid_Command_Passes()
    {
        var command = new CreateAssetCommand("A-100", "Laptop Zebra", "Activo de pruebas", null, "SER-001", AssetCriticality.High);
        var result = await _validator.ValidateAsync(command);
        Assert.True(result.IsValid);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public async Task Empty_AssetNumber_Fails(string assetNumber)
    {
        var command = new CreateAssetCommand(assetNumber, "Laptop", null, null, null);
        var result = await _validator.ValidateAsync(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == nameof(CreateAssetCommand.AssetNumber));
    }

    [Fact]
    public async Task Empty_Name_Fails()
    {
        var command = new CreateAssetCommand("A-100", "", null, null, null);
        var result = await _validator.ValidateAsync(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == nameof(CreateAssetCommand.Name));
    }
}
