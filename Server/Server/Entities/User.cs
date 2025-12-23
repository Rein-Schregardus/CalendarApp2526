using System.ComponentModel.DataAnnotations;

namespace Server.Entities
{
    public class User: IDbEntity<long>
    {
        [Key]
        public long Id { get; set; }
        public required string FullName { get; set; }
        public required string UserName { get; set; }
        public required string Email { get; set; }
        public required string PasswordHash { get; set; }
        public required DateTime CreatedAt { get; set; }

        public long RoleId { get; set; }
        public Role Role { get; set; }

        public ICollection<UserGroup> UserGroups { get; set; }
        public ICollection<WorkTime> WorkTimes { get; set; }
        public ICollection<WorkSchedule> WorkSchedules { get; set; }
        public ICollection<EventAttendance> EventAttendances { get; set; }
        public ICollection<Review> Reviews { get; set; }
        public ICollection<Reservation> Reservations { get; set; }
    }
}


