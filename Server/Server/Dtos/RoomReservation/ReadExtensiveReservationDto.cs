namespace Server.Dtos.RoomReservation
{
    public class ReadExtensiveReservationDto
    {
        public long Id { get; set; }
        public required DateTime Start { get; set; } = DateTime.UtcNow;
        public int Duration { get; set; }
        public long? LocationId { get; set; }
        public required string LocationName { get; set; }
        public required long CreatorId { get; set; }
        public required string CreatorMail { get; set; }
    }
}
