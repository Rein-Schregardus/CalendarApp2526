namespace Server.Dtos.Admin
{
    public class AdminUserDto
    {
        public long Id { get; set; }
        public string UserName { get; set; } = "";
        public string FullName { get; set; } = "";
        public string Email { get; set; } = "";
        public long RoleId { get; set; }
        public string RoleName { get; set; } = "";
        public string? Password { get; set; }
    }
}
