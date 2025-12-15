using System.ComponentModel.DataAnnotations;

namespace Server.Entities
{
    public class RoomReservation
    {
        [Key]
        public long Id { get; set; }
        public required DateTime Start { get; set; } = DateTime.UtcNow;
        public int Duration { get; set; }

        public long? LocationId { get; set; }
        public Location? Location { get; set; }

        public required long CreatorId { get; set; }
        public User Creator { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
