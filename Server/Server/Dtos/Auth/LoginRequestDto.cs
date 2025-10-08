using System.ComponentModel.DataAnnotations;

namespace Server.Dtos.Auth
{
    public class LoginRequest
    {
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public required string Password { get; set; }
    }
}
