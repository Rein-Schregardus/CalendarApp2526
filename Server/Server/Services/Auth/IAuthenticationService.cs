using System.IdentityModel.Tokens.Jwt;
using Server.Dtos.Auth;

namespace Server.Services.Auth
{
    public interface IAuthenticationService
    {
        Task<(string accessToken, string refreshToken)> Login(LoginRequest request);
        Task<(string accessToken, string refreshToken)> Register(RegisterRequest request);
        Task UpdateUser(long id, RegisterRequest request);
        Task<(string accessToken, string refreshToken)> Refresh(string refreshToken);
        Task<IEnumerable<UserInfoDto>> GetAllUsers();
        Task<UserInfoDto?> GetUserById(long id);
        Task<bool> IsProfilePictureLegal(IFormFile pfp);
        Task<bool> SaveProfilePicture(IFormFile pfp, long userId);
        Task<UserStatisticsDto> GetStatistics(long userId);
    }
}
