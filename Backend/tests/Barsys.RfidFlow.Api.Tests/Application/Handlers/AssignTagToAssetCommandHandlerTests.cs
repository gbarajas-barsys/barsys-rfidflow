using Barsys.RfidFlow.Application.Common;
using Barsys.RfidFlow.Application.Features.Assets.Commands;
using Barsys.RfidFlow.Api.Tests.Infrastructure;
using Barsys.RfidFlow.Domain.Entities;
using Barsys.RfidFlow.Infrastructure.Repositories;
using Xunit;

namespace Barsys.RfidFlow.Api.Tests.Application.Handlers;

public sealed class AssignTagToAssetCommandHandlerTests
{
    [Fact]
    public async Task Handle_Assigns_Tag_To_Existing_Asset()
    {
        var assets = new InMemoryRepository<Asset>();
        var tags = new InMemoryRepository<RfidTag>();
        var tenant = new StubTenantContextAccessor(TestConstants.TenantId);
        var asset = await assets.AddAsync(new Asset { TenantId = TestConstants.TenantId, AssetNumber = "A-300", Name = "Activo" });
        var handler = new AssignTagToAssetCommandHandler(assets, tags, tenant);

        var result = await handler.Handle(new AssignTagToAssetCommand(asset.Id, "E2000017221101441890ABCD", null, false), CancellationToken.None);

        Assert.True(result.Succeeded);
        Assert.Equal("E2000017221101441890ABCD", result.Data!.Epc);
    }

    [Fact]
    public async Task Handle_Returns_NotFound_When_Asset_Does_Not_Exist()
    {
        var handler = new AssignTagToAssetCommandHandler(new InMemoryRepository<Asset>(), new InMemoryRepository<RfidTag>(), new StubTenantContextAccessor(TestConstants.TenantId));
        var result = await handler.Handle(new AssignTagToAssetCommand(Guid.NewGuid(), "E2000017221101441890ABCD", null, false), CancellationToken.None);
        Assert.False(result.Succeeded);
        Assert.Equal("NOT_FOUND", result.ErrorCode);
    }

    private sealed class StubTenantContextAccessor : ITenantContextAccessor
    {
        public StubTenantContextAccessor(Guid tenantId) => Current = new TenantContext(tenantId);
        public TenantContext Current { get; }
    }
}
