namespace Server.Dtos.Event
{
    public class EventCreateDto
    {
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public DateTime Date { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }

        public long? LocationId { get; set; }
    }
}
