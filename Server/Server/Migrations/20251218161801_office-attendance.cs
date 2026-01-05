using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class officeattendance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WorkSchedules_Users_UserId",
                table: "WorkSchedules");

            migrationBuilder.DropForeignKey(
                name: "FK_WorkTimes_Users_UserId",
                table: "WorkTimes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_WorkTimes",
                table: "WorkTimes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_WorkSchedules",
                table: "WorkSchedules");

            migrationBuilder.RenameTable(
                name: "WorkTimes",
                newName: "WorkTime");

            migrationBuilder.RenameTable(
                name: "WorkSchedules",
                newName: "WorkSchedule");

            migrationBuilder.RenameIndex(
                name: "IX_WorkTimes_UserId",
                table: "WorkTime",
                newName: "IX_WorkTime_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_WorkSchedules_UserId",
                table: "WorkSchedule",
                newName: "IX_WorkSchedule_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_WorkTime",
                table: "WorkTime",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_WorkSchedule",
                table: "WorkSchedule",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "OfficeAttendances",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<long>(type: "bigint", nullable: false),
                    IsPresent = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OfficeAttendances", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OfficeAttendances_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OfficeAttendances_UserId",
                table: "OfficeAttendances",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_WorkSchedule_Users_UserId",
                table: "WorkSchedule",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_WorkTime_Users_UserId",
                table: "WorkTime",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WorkSchedule_Users_UserId",
                table: "WorkSchedule");

            migrationBuilder.DropForeignKey(
                name: "FK_WorkTime_Users_UserId",
                table: "WorkTime");

            migrationBuilder.DropTable(
                name: "OfficeAttendances");

            migrationBuilder.DropPrimaryKey(
                name: "PK_WorkTime",
                table: "WorkTime");

            migrationBuilder.DropPrimaryKey(
                name: "PK_WorkSchedule",
                table: "WorkSchedule");

            migrationBuilder.RenameTable(
                name: "WorkTime",
                newName: "WorkTimes");

            migrationBuilder.RenameTable(
                name: "WorkSchedule",
                newName: "WorkSchedules");

            migrationBuilder.RenameIndex(
                name: "IX_WorkTime_UserId",
                table: "WorkTimes",
                newName: "IX_WorkTimes_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_WorkSchedule_UserId",
                table: "WorkSchedules",
                newName: "IX_WorkSchedules_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_WorkTimes",
                table: "WorkTimes",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_WorkSchedules",
                table: "WorkSchedules",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_WorkSchedules_Users_UserId",
                table: "WorkSchedules",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_WorkTimes_Users_UserId",
                table: "WorkTimes",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
