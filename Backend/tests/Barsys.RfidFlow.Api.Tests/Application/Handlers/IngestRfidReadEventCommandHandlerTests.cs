using Barsys.RfidFlow.Application.Common;
using Barsys.RfidFlow.Application.Features.Rfid.Commands;
using Barsys.RfidFlow.Api.Tests.Infrastructure;
using Barsys.RfidFlow.Domain.Entities;
using Barsys.RfidFlow.Infrastructure.Repositories;
using Xunit;

namespace Barsys.RfidFlow.Api.Tests.Application.Handlers;

public sealed class IngestRfidReadEventCommandHandlerTests
{
    [Fact]
    public async Task Handle_Persists_Read_Event()
    {
        var events = new InMemoryRepository<RfidReadEvent>();
        var handler = new IngestRfidReadEventCommandHandler(events, new StubTenantContextAccessor(TestConstants.TenantId));
        var now = DateTimeOffset.UtcNow;

        var ack = await handler.Handle(new IngestRfidReadEventCommand("E2000017221101441890ABCD", Guid.NewGuid(), null, null, -60, 2, now, now.AddSeconds(1)), CancellationToken.None);

        Assert.True(ack.Accepted);
        Assert.NotEqual(Guid.Empty, ack.EventId);
    }

    private sealed class StubTenantContextAccessor : ITenantContextAccessor
    {
        public StubTenantContextAccessor(Guid tenantId) => Current = new TenantContext(tenantId);
        public TenantContext Current { get; }
    }
}
