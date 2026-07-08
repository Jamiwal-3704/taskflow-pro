using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskFlowPro.API.Migrations
{
    /// <inheritdoc />
    public partial class AddColorHexToTasks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ColorHex",
                table: "TodoTasks",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ColorHex",
                table: "TodoTasks");
        }
    }
}
