using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Server.Entities;

namespace Server.Db;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    //
    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }

    //
    public DbSet<Group> Groups { get; set; }
    public DbSet<UserGroup> UserGroups { get; set; }

    // 
    public DbSet<Event> Events { get; set; }
    public DbSet<EventAttendance> EventAttendances { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<Location> Locations { get; set; }
    public DbSet<Reservation> Reservations { get; set; }

    //
    public DbSet<WorkSchedule> WorkSchedules { get; set; }
    public DbSet<WorkTime> WorkTimes { get; set; }
}
