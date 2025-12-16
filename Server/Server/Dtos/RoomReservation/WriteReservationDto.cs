namespace Server.Dtos.RoomReservation
{
    public class WriteReservationDto
    {
            public required DateTime Start { get; set; }
            public required int Duration { get; set; }
            public required long LocationId { get; set; }
            public required long CreatorId { get; set; }
            public DateTime CreatedAt { get; set; }

    }
}
