using System.ComponentModel.DataAnnotations;

namespace Server.Entities
{
    public class Reservation
    {
        [Key]
        public required long Id { get; set; }

        public required long RoomId { get; set; }
        public Location Room { get; set; }

        public required long UserId { get; set; }
        public User User { get; set; }

        public DateTime BookingDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}