using System.ComponentModel.DataAnnotations;

namespace Server.Entities
{
    public class EventAttendance
    {
        [Key]
        public long Id { get; set; }
        public required long UserId { get; set; }
        public User User { get; set; }
        public required long EventId { get; set; }
        public Event Event { get; set; }
        public required DateTime RegisteredAt { get; set; }
        public DateTime? CancelledAt { get; set; }
    }
}
