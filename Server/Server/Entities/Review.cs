using System.ComponentModel.DataAnnotations;

namespace Server.Entities
{
    public class Review
    {
        [Key]
        public required long Id { get; set; }

        public required long EventId { get; set; }
        public Event Event { get; set; }

        public required long UserId { get; set; }
        public User User { get; set; }

        public int? Rating { get; set; }
        public required string Comment { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}