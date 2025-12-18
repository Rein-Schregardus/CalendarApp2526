namespace Server.Entities
{
    public class OfficeAttendance
    {
        public long Id { get; set; }
        public long userId { get; set; }
        public User User { get; set; }
        public DateTime? Start { get; set; }
        public DateTime? End { get; set; }
    }
}
