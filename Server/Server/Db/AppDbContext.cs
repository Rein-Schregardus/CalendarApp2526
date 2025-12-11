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
    public DbSet<RefreshToken> RefreshTokens { get; set; }

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
    
    //
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<NotificationReceiver> NotificationReceivers { get; set; }

    //
    public DbSet<LogEntry> Logs { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Event>()
            .HasOne(e => e.Creator)
            .WithMany()
            .HasForeignKey(e => e.CreatedBy)
            .HasConstraintName("FK_Events_Users_CreatorId") // DB FK constraint
            .OnDelete(DeleteBehavior.Restrict);

        // Map CreatedBy property to the actual column name in DB
        modelBuilder.Entity<Event>()
            .Property(e => e.CreatedBy)
            .HasColumnName("CreatedBy");


        modelBuilder.Entity<Role>().HasData(
            new Role { Id = 1, RoleName = "Admin" },
            new Role { Id = 2, RoleName = "User" }
        );
    }
}
