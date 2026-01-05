namespace Server.Dtos.Admin
{
    public class AdminGroupsByUsersDto
    {
        public long UserId { get; set; }
        public string UserName { get; set; }
        public List<AdminGroupDto> Groups { get; set; }
    }
}
