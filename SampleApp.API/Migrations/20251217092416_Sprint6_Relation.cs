using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace SampleApp.API.Migrations
{
    /// <inheritdoc />
    public partial class Sprint6_Relation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.CreateTable(
                name: "Relations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FollowedId = table.Column<int>(type: "integer", nullable: false),
                    FollowerId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Relations", x => x.Id);
                    table.CheckConstraint("CK_Relation_SelfFollow", "\"FollowedId\" <> \"FollowerId\"");
                    table.ForeignKey(
                        name: "FK_Relations_Users_FollowedId",
                        column: x => x.FollowedId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Relations_Users_FollowerId",
                        column: x => x.FollowerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Relations_FollowedId",
                table: "Relations",
                column: "FollowedId");

            migrationBuilder.CreateIndex(
                name: "IX_Relations_FollowerId",
                table: "Relations",
                column: "FollowerId");

            migrationBuilder.CreateIndex(
                name: "IX_Relations_FollowerId_FollowedId",
                table: "Relations",
                columns: new[] { "FollowerId", "FollowedId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Relations");

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
    }
}
