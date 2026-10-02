using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Barsys.RfidFlow.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSerializedUnits : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_serialized_units_tenant_id_epc",
                schema: "rfidflow",
                table: "serialized_units");

            migrationBuilder.DropIndex(
                name: "ix_serialized_units_tenant_id_vin",
                schema: "rfidflow",
                table: "serialized_units");

            migrationBuilder.CreateIndex(
                name: "ix_serialized_units_tenant_id_epc",
                schema: "rfidflow",
                table: "serialized_units",
                columns: new[] { "tenant_id", "epc" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_serialized_units_tenant_id_vin",
                schema: "rfidflow",
                table: "serialized_units",
                columns: new[] { "tenant_id", "vin" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_serialized_units_tenant_id_epc",
                schema: "rfidflow",
                table: "serialized_units");

            migrationBuilder.DropIndex(
                name: "ix_serialized_units_tenant_id_vin",
                schema: "rfidflow",
                table: "serialized_units");

            migrationBuilder.CreateIndex(
                name: "ix_serialized_units_tenant_id_epc",
                schema: "rfidflow",
                table: "serialized_units",
                columns: new[] { "tenant_id", "epc" });

            migrationBuilder.CreateIndex(
                name: "ix_serialized_units_tenant_id_vin",
                schema: "rfidflow",
                table: "serialized_units",
                columns: new[] { "tenant_id", "vin" });
        }
    }
}
