namespace Server.Dtos.Event
{
    public class EventReadDto
    {
        public long Id { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public DateTime Start { get; set; }
        public int Duration { get; set; }
        public long? LocationId { get; set; }
        public string LocationName { get; set; } = "No location";
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
