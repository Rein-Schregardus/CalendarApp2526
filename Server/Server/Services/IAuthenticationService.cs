using System.IdentityModel.Tokens.Jwt;
using Server.Dtos;

namespace Server.Services
{
    public interface IAuthenticationService
    {
        Task<string> Register(RegisterRequest request);
        Task<string> Login(LoginRequest request);
    }
}
