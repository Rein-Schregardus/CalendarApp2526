using System.IdentityModel.Tokens.Jwt;
using Server.Dtos.Auth;

namespace Server.Services.Auth
{
    public interface IAuthenticationService
    {
        Task<string> Register(RegisterRequest request);
        Task<string> Login(LoginRequest request);
        Task<IEnumerable<UserInfoDto>> GetAllUsers();
    }
}
