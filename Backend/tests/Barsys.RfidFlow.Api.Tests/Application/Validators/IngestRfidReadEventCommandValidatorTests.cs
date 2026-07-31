using Barsys.RfidFlow.Application.Features.Rfid.Commands;
using Xunit;

namespace Barsys.RfidFlow.Api.Tests.Application.Validators;

public sealed class IngestRfidReadEventCommandValidatorTests
{
    private readonly IngestRfidReadEventCommandValidator _validator = new();

    [Fact]
    public async Task Valid_Command_Passes()
    {
        var now = DateTimeOffset.UtcNow;
        var command = new IngestRfidReadEventCommand("E2000017221101441890ABCD", Guid.NewGuid(), null, null, -55, 1, now, now.AddSeconds(1));
        var result = await _validator.ValidateAsync(command);
        Assert.True(result.IsValid);
    }

    [Fact]
    public async Task LastSeen_Before_FirstSeen_Fails()
    {
        var now = DateTimeOffset.UtcNow;
        var command = new IngestRfidReadEventCommand("E2000017221101441890ABCD", Guid.NewGuid(), null, null, -55, 1, now, now.AddSeconds(-1));
        var result = await _validator.ValidateAsync(command);
        Assert.False(result.IsValid);
    }

    [Fact]
    public async Task ReadCount_Zero_Fails()
    {
        var now = DateTimeOffset.UtcNow;
        var command = new IngestRfidReadEventCommand("E2000017221101441890ABCD", Guid.NewGuid(), null, null, -55, 0, now, now);
        var result = await _validator.ValidateAsync(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == nameof(IngestRfidReadEventCommand.ReadCount));
    }
}
