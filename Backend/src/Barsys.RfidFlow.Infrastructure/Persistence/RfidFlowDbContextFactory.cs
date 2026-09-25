using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Barsys.RfidFlow.Infrastructure.Persistence;

public class RfidFlowDbContextFactory
    : IDesignTimeDbContextFactory<RfidFlowDbContext>
{
    public RfidFlowDbContext CreateDbContext(
        string[] args)
    {
        var optionsBuilder =
            new DbContextOptionsBuilder<RfidFlowDbContext>();

        optionsBuilder
            .UseNpgsql(
                "Host=localhost;Port=5432;Database=rfidflow;Username=rfidflow;Password=rfidflow")
            .UseSnakeCaseNamingConvention();

        return new RfidFlowDbContext(
            optionsBuilder.Options);
    }
}