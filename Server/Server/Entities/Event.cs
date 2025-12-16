using System.ComponentModel.DataAnnotations;

namespace Server.Entities
{
    public class Event
    {
        [Key]
        public long Id { get; set; }

        [Required]
        public string Title { get; set; }

        public string? Description { get; set; }

        public required DateTime Start { get; set; } = DateTime.UtcNow;
        public int Duration { get; set; }

        public long? LocationId { get; set; }
        public Location? Location { get; set; }

        public required long CreatedBy { get; set; }
        public User Creator { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<EventAttendance> Attendances { get; set; } = new List<EventAttendance>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();

    }
}
