using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FileSharePlatform.Migrations
{
    /// <inheritdoc />
    public partial class AddShareToken : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ShareToken",
                table: "Files",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ShareToken",
                table: "Files");
        }
    }
}
