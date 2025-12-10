namespace Server.Dtos.Admin
{
    public class AdminGroupDto
    {
        public long Id { get; set; }
        public string GroupName { get; set; } = "";
        public string? Description { get; set; }
    }
}
