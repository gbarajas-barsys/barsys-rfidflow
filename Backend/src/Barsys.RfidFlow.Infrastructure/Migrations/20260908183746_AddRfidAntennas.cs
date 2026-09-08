using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Barsys.RfidFlow.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddRfidAntennas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "rfid_antennas",
                schema: "rfidflow",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    reader_id = table.Column<Guid>(type: "uuid", nullable: false),
                    port_number = table.Column<int>(type: "integer", nullable: false),
                    name = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    location_id = table.Column<Guid>(type: "uuid", nullable: true),
                    zone = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: true),
                    power = table.Column<int>(type: "integer", nullable: false),
                    enabled = table.Column<bool>(type: "boolean", nullable: false),
                    tenant_id = table.Column<Guid>(type: "uuid", nullable: false),
                    created_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    created_by = table.Column<Guid>(type: "uuid", nullable: true),
                    updated_by = table.Column<Guid>(type: "uuid", nullable: true),
                    row_version = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_rfid_antennas", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "ix_rfid_antennas_tenant_id",
                schema: "rfidflow",
                table: "rfid_antennas",
                column: "tenant_id");

            migrationBuilder.CreateIndex(
                name: "ix_rfid_antennas_tenant_id_reader_id_port_number",
                schema: "rfidflow",
                table: "rfid_antennas",
                columns: new[] { "tenant_id", "reader_id", "port_number" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "rfid_antennas",
                schema: "rfidflow");
        }
    }
}
