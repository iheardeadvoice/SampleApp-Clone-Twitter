using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SampleApp.API.Migrations
{
    /// <inheritdoc />
    public partial class UseCollegeSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "01ip215");

            migrationBuilder.RenameTable(
                name: "Users",
                newName: "Users",
                newSchema: "01ip215");

            migrationBuilder.RenameTable(
                name: "Roles",
                newName: "Roles",
                newSchema: "01ip215");

            migrationBuilder.RenameTable(
                name: "Microposts",
                newName: "Microposts",
                newSchema: "01ip215");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameTable(
                name: "Users",
                schema: "01ip215",
                newName: "Users");

            migrationBuilder.RenameTable(
                name: "Roles",
                schema: "01ip215",
                newName: "Roles");

            migrationBuilder.RenameTable(
                name: "Microposts",
                schema: "01ip215",
                newName: "Microposts");
        }
    }
}
