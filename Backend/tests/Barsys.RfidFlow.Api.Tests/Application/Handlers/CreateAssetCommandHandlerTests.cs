using Barsys.RfidFlow.Application.Common;
using Barsys.RfidFlow.Application.Features.Assets.Commands;
using Barsys.RfidFlow.Api.Tests.Infrastructure;
using Barsys.RfidFlow.Domain.Entities;
using Barsys.RfidFlow.Infrastructure.Repositories;
using Xunit;

namespace Barsys.RfidFlow.Api.Tests.Application.Handlers;

public sealed class CreateAssetCommandHandlerTests
{
    [Fact]
    public async Task Handle_Creates_Asset_With_Tenant()
    {
        var repository = new InMemoryRepository<Asset>();
        var tenant = new StubTenantContextAccessor(TestConstants.TenantId);
        var handler = new CreateAssetCommandHandler(repository, tenant);

        var created = await handler.Handle(new CreateAssetCommand("A-200", "Tablet RFID", null, null, "SN-200"), CancellationToken.None);

        Assert.NotEqual(Guid.Empty, created.Id);
        Assert.Equal(TestConstants.TenantId, created.TenantId);
        Assert.Equal("A-200", created.AssetNumber);
    }

    private sealed class StubTenantContextAccessor : ITenantContextAccessor
    {
        public StubTenantContextAccessor(Guid tenantId) => Current = new TenantContext(tenantId);
        public TenantContext Current { get; }
    }
}
