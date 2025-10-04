using System.ComponentModel.DataAnnotations;

namespace Server.Entities
{
    public class Event
    {
        [Key]
        public required long Id { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public required DateTime Date { get; set; }
        public required TimeSpan StartTime { get; set; }
        public required TimeSpan EndTime { get; set; }

        public long LocationId { get; set; }
        public Location Location { get; set; }

        public required long CreatedBy { get; set; }
        public required User Creator { get; set; }

        public required DateTime CreatedAt { get; set; }

        public ICollection<EventAttendance> Attendances { get; set; }
        public ICollection<Review> Reviews { get; set; }
    }
}
