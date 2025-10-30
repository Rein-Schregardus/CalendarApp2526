﻿using System.IdentityModel.Tokens.Jwt;
using Server.Dtos.Auth;

namespace Server.Services.Auth
{
    public interface IAuthenticationService
    {
        Task<(string accessToken, string refreshToken)> Login(LoginRequest request);
        Task<(string accessToken, string refreshToken)> Register(RegisterRequest request);
        Task<(string accessToken, string refreshToken)> Refresh(string refreshToken);
        Task<IEnumerable<UserInfoDto>> GetAllUsers();
    }
}
