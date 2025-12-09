namespace Server.Dtos.Auth
{
    public class ChangePasswordDto
    {
        public required string oldPassword { get; set; }
        public required string newPassword { get; set; }

    }
}
