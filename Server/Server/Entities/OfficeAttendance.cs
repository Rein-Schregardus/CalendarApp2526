namespace Server.Entities
{
    public class OfficeAttendance: IDbEntity<long>
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public User User { get; set; }
        public bool IsPresent { get; set; }
    }
}
