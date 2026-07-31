using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Barsys.RfidFlow.Infrastructure.Migrations;

public partial class InitialCreate : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(File.ReadAllText(Path.Combine(AppContext.BaseDirectory, "database", "schema.sql")));
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql("DROP SCHEMA IF EXISTS rfidflow CASCADE;");
    }
}
