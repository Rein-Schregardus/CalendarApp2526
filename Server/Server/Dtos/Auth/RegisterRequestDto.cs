using System.ComponentModel.DataAnnotations;

namespace Server.Dtos.Auth
{
    public class RegisterRequest
    {
        public required string FullName { get; set; }
        public required string UserName { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public long RoleId { get; set; }
    }
}
