namespace Server.Dtos.RoomReservation
{
    public class ReadReservationDto
    {
        public long Id { get; set; }
        public required DateTime Start { get; set; } = DateTime.UtcNow;
        public int Duration { get; set; }
        public long? LocationId { get; set; }
        public required long CreatorId { get; set; }
    }
}
