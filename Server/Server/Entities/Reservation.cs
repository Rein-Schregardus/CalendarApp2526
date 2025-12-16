using System.ComponentModel.DataAnnotations;

namespace Server.Entities
{
    public class Reservation: IDbEntity<long>
    {
        [Key]
        public long Id { get; set; }

        public required long RoomId { get; set; }
        public Location Room { get; set; }

        public required long UserId { get; set; }
        public User User { get; set; }

        public DateTime Start { get; set; }
        public int Duration { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}