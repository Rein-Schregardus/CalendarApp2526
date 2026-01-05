using System.ComponentModel.DataAnnotations;
using Server.Enums;

namespace Server.Entities
{
    public class Location : IDbEntity<long>
    {
        [Key]
        public long Id { get; set; }
        public required string LocationName { get; set; }
        public required int Capacity { get; set; }
        public required LocationType Type { get; set; }

        public ICollection<Event> Events { get; set; }
        public ICollection<Reservation> Reservations { get; set; }
    }
}