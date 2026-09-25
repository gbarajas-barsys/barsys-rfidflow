using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Barsys.RfidFlow.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class TenantBranding : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "password_hash",
                schema: "rfidflow",
                table: "users",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "logo_url",
                schema: "rfidflow",
                table: "tenants",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "primary_color",
                schema: "rfidflow",
                table: "tenants",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "secondary_color",
                schema: "rfidflow",
                table: "tenants",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "barcode_enabled",
                schema: "rfidflow",
                table: "items",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "rfid_strategy",
                schema: "rfidflow",
                table: "items",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "brand",
                schema: "rfidflow",
                table: "assets",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "model",
                schema: "rfidflow",
                table: "assets",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "part_number",
                schema: "rfidflow",
                table: "assets",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "print_jobs",
                schema: "rfidflow",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    asset_id = table.Column<Guid>(type: "uuid", nullable: true),
                    item_id = table.Column<Guid>(type: "uuid", nullable: true),
                    epc = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    encoding_type = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    label_template = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    label_template_id = table.Column<Guid>(type: "uuid", nullable: true),
                    printer_name = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    status = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    is_reprint = table.Column<bool>(type: "boolean", nullable: false),
                    original_print_job_id = table.Column<Guid>(type: "uuid", nullable: true),
                    reprint_reason = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    requested_by_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    printed_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    failure_reason = table.Column<string>(type: "text", nullable: true),
                    attempt_count = table.Column<int>(type: "integer", nullable: false),
                    processed_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    tenant_id = table.Column<Guid>(type: "uuid", nullable: false),
                    created_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    created_by = table.Column<Guid>(type: "uuid", nullable: true),
                    updated_by = table.Column<Guid>(type: "uuid", nullable: true),
                    row_version = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_print_jobs", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "rfid_label_templates",
                schema: "rfidflow",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    code = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    template_type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    zpl_template = table.Column<string>(type: "text", nullable: false),
                    label_width = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    label_height = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    is_default = table.Column<bool>(type: "boolean", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    tenant_id = table.Column<Guid>(type: "uuid", nullable: false),
                    created_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    created_by = table.Column<Guid>(type: "uuid", nullable: true),
                    updated_by = table.Column<Guid>(type: "uuid", nullable: true),
                    row_version = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_rfid_label_templates", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "rfid_printers",
                schema: "rfidflow",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    ip_address = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    port = table.Column<int>(type: "integer", nullable: false),
                    model = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    is_default = table.Column<bool>(type: "boolean", nullable: false),
                    is_enabled = table.Column<bool>(type: "boolean", nullable: false),
                    tenant_id = table.Column<Guid>(type: "uuid", nullable: false),
                    created_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    created_by = table.Column<Guid>(type: "uuid", nullable: true),
                    updated_by = table.Column<Guid>(type: "uuid", nullable: true),
                    row_version = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_rfid_printers", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "ix_print_jobs_tenant_id",
                schema: "rfidflow",
                table: "print_jobs",
                column: "tenant_id");

            migrationBuilder.CreateIndex(
                name: "ix_print_jobs_tenant_id_asset_id",
                schema: "rfidflow",
                table: "print_jobs",
                columns: new[] { "tenant_id", "asset_id" });

            migrationBuilder.CreateIndex(
                name: "ix_rfid_label_templates_tenant_id",
                schema: "rfidflow",
                table: "rfid_label_templates",
                column: "tenant_id");

            migrationBuilder.CreateIndex(
                name: "ix_rfid_label_templates_tenant_id_code",
                schema: "rfidflow",
                table: "rfid_label_templates",
                columns: new[] { "tenant_id", "code" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_rfid_printers_tenant_id",
                schema: "rfidflow",
                table: "rfid_printers",
                column: "tenant_id");

            migrationBuilder.CreateIndex(
                name: "ix_rfid_printers_tenant_id_name",
                schema: "rfidflow",
                table: "rfid_printers",
                columns: new[] { "tenant_id", "name" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "print_jobs",
                schema: "rfidflow");

            migrationBuilder.DropTable(
                name: "rfid_label_templates",
                schema: "rfidflow");

            migrationBuilder.DropTable(
                name: "rfid_printers",
                schema: "rfidflow");

            migrationBuilder.DropColumn(
                name: "password_hash",
                schema: "rfidflow",
                table: "users");

            migrationBuilder.DropColumn(
                name: "logo_url",
                schema: "rfidflow",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "primary_color",
                schema: "rfidflow",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "secondary_color",
                schema: "rfidflow",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "barcode_enabled",
                schema: "rfidflow",
                table: "items");

            migrationBuilder.DropColumn(
                name: "rfid_strategy",
                schema: "rfidflow",
                table: "items");

            migrationBuilder.DropColumn(
                name: "brand",
                schema: "rfidflow",
                table: "assets");

            migrationBuilder.DropColumn(
                name: "model",
                schema: "rfidflow",
                table: "assets");

            migrationBuilder.DropColumn(
                name: "part_number",
                schema: "rfidflow",
                table: "assets");
        }
    }
}
