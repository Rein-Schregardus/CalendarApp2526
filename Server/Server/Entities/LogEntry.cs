namespace Server.Entities
{
    public class LogEntry
    {
        public int Id { get; set; }
        public int AdminId { get; set; }
        public string Message { get; set; } = string.Empty;
        public DateTime Time { get; set; } = DateTime.UtcNow;
    }
}
