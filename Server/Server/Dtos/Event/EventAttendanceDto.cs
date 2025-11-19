namespace Server.Dtos.Event
{
    public class EventAttendanceDto
    {
        public required long EventId { get; set; }
        public required string[] Attendees { get; set; }
    }
}
