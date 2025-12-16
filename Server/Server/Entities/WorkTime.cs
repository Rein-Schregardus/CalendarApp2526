using System.ComponentModel.DataAnnotations;

namespace Server.Entities
{
    public class WorkTime
    {
        [Key]
        public required long Id { get; set; }
        public required DayOfWeek DayOfWeek { get; set; }
        public required DateTime Start { get; set; }
        public required DateTime End { get; set; }

        public required long UserId { get; set; }
        public User User { get; set; }
    }
}