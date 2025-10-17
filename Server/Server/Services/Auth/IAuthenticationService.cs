using System.IdentityModel.Tokens.Jwt;
using Server.Dtos.Auth;

namespace Server.Services.Auth
{
    public interface IAuthenticationService
    {
        Task<string> Register(RegisterRequest request);
        Task<(string Token, UserInfoDto User)> Login(LoginRequest request);
    }
}
