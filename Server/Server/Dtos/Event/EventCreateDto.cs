namespace Server.Dtos.Event
{
    public class EventCreateDto
    {
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public DateTime Start { get; set; }
        public int Duration { get; set; }

        public long? LocationId { get; set; }
    }
}
