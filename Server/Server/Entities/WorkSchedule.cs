using System.ComponentModel.DataAnnotations;

namespace Server.Entities
{
    public class WorkSchedule
    {
        [Key]
        public required long Id { get; set; }
        public required long UserId { get; set; }
        public User User { get; set; }

        public required DateTime Date { get; set; }
        public required TimeSpan StartTime { get; set; }
        public required TimeSpan EndTime { get; set; }
        public required AttendanceStatus Status { get; set; }
        public required DateTime CreatedAt { get; set; }
    }
}