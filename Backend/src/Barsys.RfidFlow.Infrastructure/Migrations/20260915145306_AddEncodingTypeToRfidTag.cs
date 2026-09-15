using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Barsys.RfidFlow.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddEncodingTypeToRfidTag : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "encoding_type",
                schema: "rfidflow",
                table: "rfid_tags",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "encoding_type",
                schema: "rfidflow",
                table: "rfid_tags");
        }
    }
}
