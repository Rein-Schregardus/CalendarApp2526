using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Server.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Server.Db;
using Microsoft.EntityFrameworkCore;
using Server.Dtos.Auth;

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

        public async Task<string> Register(RegisterRequest request)
        {
            // Must provide Email or Username
            if (string.IsNullOrWhiteSpace(request.Email) && string.IsNullOrWhiteSpace(request.UserName))
                throw new ArgumentException("You must provide either a username or an email.");

            // Check duplicates
            if (await _db.Users.AnyAsync(u =>
                !string.IsNullOrEmpty(request.Email) && u.Email == request.Email ||
                !string.IsNullOrEmpty(request.UserName) && u.UserName == request.UserName))
            {
                throw new ArgumentException("A user with this email or username already exists.");
            }

            // Assign role
            var defaultRole = await _db.Roles.FirstOrDefaultAsync(r => r.RoleName == "User");
            if (defaultRole == null)
                throw new Exception("Default role not found.");

            // Hash password
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

            // Build JWT claims right here instead of re-calling Login()
            var authClaims = new List<Claim>
            {
                new(ClaimTypes.Name, user.UserName),
                new(ClaimTypes.Email, user.Email),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new(ClaimTypes.Role, defaultRole.RoleName)
            };

            var token = GetToken(authClaims);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<string> Login(LoginRequest request)
        {
            // Must provide Email or Username
            if (string.IsNullOrWhiteSpace(request.UserName) && string.IsNullOrWhiteSpace(request.Email))
                throw new ArgumentException("You must provide either a username or an email.");

            // Base query
            IQueryable<User> query = _db.Users.Include(u => u.Role);

            User? user = null;

            if (!string.IsNullOrWhiteSpace(request.UserName) && !string.IsNullOrWhiteSpace(request.Email))
            {
                // Both provided
                user = await query.FirstOrDefaultAsync(u =>
                    u.UserName == request.UserName && u.Email == request.Email);
            }
            else if (!string.IsNullOrWhiteSpace(request.UserName))
            {
                // Username only
                user = await query.FirstOrDefaultAsync(u => u.UserName == request.UserName);
            }
            else
            {
                // Email only
                user = await query.FirstOrDefaultAsync(u => u.Email == request.Email);
            }

            if (user is null)
                throw new ArgumentException("User not found.");

            // Always verify password
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                throw new ArgumentException("Invalid password.");

            // Build JWT claims
            var authClaims = new List<Claim>
            {
                new(ClaimTypes.Name, user.UserName),
                new(ClaimTypes.Email, user.Email),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new(ClaimTypes.Role, user.Role.RoleName)
            };

            var token = GetToken(authClaims);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        private JwtSecurityToken GetToken(IEnumerable<Claim> authClaims)
        {
            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddHours(3),
                claims: authClaims,
                signingCredentials: new SigningCredentials(_authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return token;
        }
    }
}
