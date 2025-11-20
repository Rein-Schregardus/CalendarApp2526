namespace Server.Dtos.Notification
{
    public class EventShortDto
    {
        public long Id { get; set; }
        public string Title { get; set; } = "";
        public DateTime Date { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
    }
}
