using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Server.Tests.Helpers
{
    /// <summary>
    /// Helper to generate JWTs for testing, including expired tokens.
    /// </summary>
    public static class JwtTestHelper
    {
        public static string GenerateJwt(
            string username,
            string email,
            string role,
            SymmetricSecurityKey key,
            int expiresSeconds = 60)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddSeconds(expiresSeconds),
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
