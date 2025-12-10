using Microsoft.EntityFrameworkCore;
using Server.Db;
using Server.Dtos.Auth;
using Server.Dtos.Role;
using Server.Entities;

namespace Server.Services.Admin
{
    public class AdminService : IAdminService
    {
        private readonly AppDbContext _db;

        public AdminService(AppDbContext db)
        {
            _db = db;
        }

        // -------------------- USERS --------------------
        public async Task<IEnumerable<UserInfoDto>> GetAllUsers()
        {
            return await _db.Users.Include(u => u.Role)
                .Select(u => new UserInfoDto
                {
                    Id = u.Id,
                    UserName = u.UserName,
                    FullName = u.FullName,
                    Email = u.Email,
                    RoleName = u.Role.RoleName
                })
                .ToListAsync();
        }

        public async Task<UserInfoDto?> GetUserById(long id)
        {
            var u = await _db.Users.Include(x => x.Role).FirstOrDefaultAsync(x => x.Id == id);
            if (u == null) return null;

            return new UserInfoDto
            {
                Id = u.Id,
                UserName = u.UserName,
                FullName = u.FullName,
                Email = u.Email,
                RoleName = u.Role.RoleName
            };
        }

        public async Task<UserInfoDto> CreateUser(RegisterRequest request)
        {
            var user = new User
            {
                UserName = request.UserName ?? string.Empty,
                FullName = request.FullName ?? string.Empty,
                Email = request.Email ?? string.Empty,
                RoleId = request.RoleId,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password ?? string.Empty),
                CreatedAt = DateTime.UtcNow
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return new UserInfoDto
            {
                Id = user.Id,
                UserName = user.UserName,
                FullName = user.FullName,
                Email = user.Email,
                RoleName = (await _db.Roles.FirstOrDefaultAsync(r => r.Id == user.RoleId))?.RoleName ?? string.Empty
            };
        }

        public async Task<UserInfoDto> UpdateUser(long id, RegisterRequest request)
        {
            var user = await _db.Users.FirstOrDefaultAsync(x => x.Id == id);
            if (user == null) throw new ArgumentException("User not found");

            user.UserName = request.UserName ?? user.UserName;
            user.FullName = request.FullName ?? user.FullName;
            user.Email = request.Email ?? user.Email;
            if (request.RoleId != 0) user.RoleId = request.RoleId;
            if (!string.IsNullOrEmpty(request.Password))
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            _db.Users.Update(user);
            await _db.SaveChangesAsync();

            var roleName = (await _db.Roles.FirstOrDefaultAsync(r => r.Id == user.RoleId))?.RoleName ?? string.Empty;

            return new UserInfoDto
            {
                Id = user.Id,
                UserName = user.UserName,
                FullName = user.FullName,
                Email = user.Email,
                RoleName = roleName
            };
        }

        public async Task DeleteUser(long id)
        {
            var user = await _db.Users.FirstOrDefaultAsync(x => x.Id == id);
            if (user != null)
            {
                _db.Users.Remove(user);
                await _db.SaveChangesAsync();
            }
        }

        // -------------------- ROLES --------------------
        public async Task<IEnumerable<RoleDto>> GetRoles()
        {
            return await _db.Roles
                .Select(r => new RoleDto
                {
                    Id = r.Id,
                    RoleName = r.RoleName
                })
                .ToListAsync();
        }

        public async Task<RoleDto?> GetRoleById(long id)
        {
            var role = await _db.Roles.FirstOrDefaultAsync(r => r.Id == id);
            if (role == null) return null;

            return new RoleDto { Id = role.Id, RoleName = role.RoleName };
        }

        public async Task<RoleDto> CreateRole(RoleDto dto)
        {
            var role = new Role { RoleName = dto.RoleName };
            _db.Roles.Add(role);
            await _db.SaveChangesAsync();

            dto.Id = role.Id;
            return dto;
        }

        public async Task<RoleDto> UpdateRole(long id, RoleDto dto)
        {
            var role = await _db.Roles.FirstOrDefaultAsync(r => r.Id == id);
            if (role == null) throw new ArgumentException("Role not found");

            role.RoleName = dto.RoleName;
            _db.Roles.Update(role);
            await _db.SaveChangesAsync();

            return dto;
        }

        public async Task DeleteRole(long id)
        {
            var role = await _db.Roles.FirstOrDefaultAsync(r => r.Id == id);
            if (role != null)
            {
                _db.Roles.Remove(role);
                await _db.SaveChangesAsync();
            }
        }
    }
}
