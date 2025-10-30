using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Server.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Server.Db;
using Microsoft.EntityFrameworkCore;
using Server.Dtos.Auth;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Http.Connections;

namespace Server.Services.Auth
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly AppDbContext _db;
        private readonly SymmetricSecurityKey _authSigningKey;
        private readonly IConfiguration _configuration;

        public AuthenticationService(AppDbContext db,
                                     IConfiguration configuration,
                                     SymmetricSecurityKey authSigningKey)
        {
            _db = db;
            _configuration = configuration;
            _authSigningKey = authSigningKey;
        }

        public async Task<(string accessToken, string refreshToken)> Register(RegisterRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) && string.IsNullOrWhiteSpace(request.UserName))
                throw new ArgumentException("You must provide either a username or an email.");

            if (await _db.Users.AnyAsync(u =>
                (!string.IsNullOrEmpty(request.Email) && u.Email == request.Email) ||
                (!string.IsNullOrEmpty(request.UserName) && u.UserName == request.UserName)))
            {
                throw new ArgumentException("A user with this email or username already exists.");
            }

            var defaultRole = await _db.Roles.FirstOrDefaultAsync(r => r.RoleName == "User")
                ?? throw new Exception("Default role not found.");

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var user = new User
            {
                Email = request.Email ?? string.Empty,
                UserName = request.UserName ?? string.Empty,
                FullName = request.FullName,
                PasswordHash = passwordHash,
                CreatedAt = DateTime.UtcNow,
                RoleId = defaultRole.Id
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            var authClaims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Name, user.UserName),
                new(ClaimTypes.Email, user.Email),
                new(ClaimTypes.Role, defaultRole.RoleName),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var accessToken = GenerateAccessToken(authClaims);
            var refreshToken = GenerateRefreshToken();

            // (Optional but recommended) Save refresh token in DB for tracking
            await SaveRefreshTokenAsync(user.Id, refreshToken);

            return (accessToken, refreshToken);
        }

        public async Task<(string accessToken, string refreshToken)> Login(LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.UserName) && string.IsNullOrWhiteSpace(request.Email))
                throw new ArgumentException("You must provide either a username or an email.");

            IQueryable<User> query = _db.Users.Include(u => u.Role);

            User? user = null;

            if (!string.IsNullOrWhiteSpace(request.UserName) && !string.IsNullOrWhiteSpace(request.Email))
            {
                user = await query.FirstOrDefaultAsync(u =>
                    u.UserName == request.UserName && u.Email == request.Email);
            }
            else if (!string.IsNullOrWhiteSpace(request.UserName))
            {
                user = await query.FirstOrDefaultAsync(u => u.UserName == request.UserName);
            }
            else
            {
                user = await query.FirstOrDefaultAsync(u => u.Email == request.Email);
            }

            if (user is null)
                throw new ArgumentException("User not found.");

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                throw new ArgumentException("Invalid password.");

            var authClaims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Name, user.UserName),
                new(ClaimTypes.Email, user.Email),
                new(ClaimTypes.Role, user.Role.RoleName),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var accessToken = GenerateAccessToken(authClaims);
            var refreshToken = GenerateRefreshToken();

            await SaveRefreshTokenAsync(user.Id, refreshToken);

            return (accessToken, refreshToken);
        }

        /// <summary>
        /// Refreshes JWT tokens using a valid refresh token.
        /// </summary>
        public async Task<(string accessToken, string refreshToken)> Refresh(string refreshToken)
        {
            var storedToken = await _db.RefreshTokens
                .Include(rt => rt.User)
                .ThenInclude(u => u.Role)
                .FirstOrDefaultAsync(t => t.Token == refreshToken);

            if (storedToken == null || storedToken.IsRevoked || storedToken.ExpiresAt < DateTime.UtcNow)
                throw new UnauthorizedAccessException("Invalid or expired refresh token.");

            var user = storedToken.User ?? throw new UnauthorizedAccessException("Associated user not found.");

            // Revoke the old token
            storedToken.IsRevoked = true;
            _db.RefreshTokens.Update(storedToken);

            // Generate new tokens
            var authClaims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Name, user.UserName),
                new(ClaimTypes.Email, user.Email),
                new(ClaimTypes.Role, user.Role.RoleName),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var newAccessToken = GenerateAccessToken(authClaims);
            var newRefreshToken = GenerateRefreshToken();

            // Save new refresh token
            await SaveRefreshTokenAsync(user.Id, newRefreshToken);

            await _db.SaveChangesAsync();

            return (newAccessToken, newRefreshToken);
        }

        public async Task<IEnumerable<UserInfoDto>> GetAllUsers()
        {
            var users = await _db.Users
                .Include(u => u.Role)
                .Select(u => new UserInfoDto
                {
                    Id = u.Id,
                    Email = u.Email,
                    FullName = u.FullName,
                    Role = u.Role.RoleName
                })
                .ToListAsync();

            return users;
        }

        private string GenerateAccessToken(IEnumerable<Claim> authClaims)
        {
            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: DateTime.UtcNow.AddMinutes(15),
                claims: authClaims,
                signingCredentials: new SigningCredentials(
                    _authSigningKey,
                    SecurityAlgorithms.HmacSha256
                )
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateRefreshToken()
        {
            var randomBytes = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);
            return Convert.ToBase64String(randomBytes);
        }

        private async Task SaveRefreshTokenAsync(long userId, string refreshToken)
        {
            var token = new RefreshToken
            {
                UserId = userId,
                Token = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddDays(7),
                CreatedAt = DateTime.UtcNow,
                IsRevoked = false
            };
            _db.RefreshTokens.Add(token);
            await _db.SaveChangesAsync();
        }
    }
}
