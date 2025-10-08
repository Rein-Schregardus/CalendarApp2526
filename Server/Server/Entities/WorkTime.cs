using System.ComponentModel.DataAnnotations;

namespace Server.Entities
{
    public class WorkTime
    {
        [Key]
        public required long Id { get; set; }
        public required DayOfWeek DayOfWeek { get; set; }
        public required TimeSpan StartTime { get; set; }
        public required TimeSpan EndTime { get; set; }

        public required long UserId { get; set; }
        public User User { get; set; }
    }
}