namespace Server.Dtos.Auth
{
    public class UserInfoDto
    {
        public long Id { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string UserName { get; set; }
        public string RoleName { get; set; }
    }
}
