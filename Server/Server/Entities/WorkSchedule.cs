using System.ComponentModel.DataAnnotations;
using Server.Enums;

namespace Server.Entities
{
    public class WorkSchedule
    {
        [Key]
        public required long Id { get; set; }
        public required long UserId { get; set; }
        public User User { get; set; }

        public required DateTime Start { get; set; }
        public required DateTime End { get; set; }
        public required AttendanceStatus Status { get; set; }
        public required DateTime CreatedAt { get; set; }
    }
}