using Microsoft.EntityFrameworkCore;
using Server.Db;
using Server.Dtos.Admin;
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
        public async Task<IEnumerable<AdminUserDto>> GetAllUsers()
        {
            return await _db.Users.Include(u => u.Role)
                .Select(u => new AdminUserDto
                {
                    Id = u.Id,
                    UserName = u.UserName,
                    FullName = u.FullName,
                    Email = u.Email,
                    RoleName = u.Role.RoleName
                })
                .ToListAsync();
        }

        public async Task<AdminUserDto?> GetUserById(long id)
        {
            var u = await _db.Users.Include(x => x.Role).FirstOrDefaultAsync(x => x.Id == id);
            if (u == null) return null;

            return new AdminUserDto
            {
                Id = u.Id,
                UserName = u.UserName,
                FullName = u.FullName,
                Email = u.Email,
                RoleName = u.Role.RoleName
            };
        }

        public async Task<AdminUserDto> CreateUser(AdminUserDto request)
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

            return new AdminUserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                FullName = user.FullName,
                Email = user.Email,
                RoleName = (await _db.Roles.FirstOrDefaultAsync(r => r.Id == user.RoleId))?.RoleName ?? string.Empty
            };
        }

        public async Task<AdminUserDto> UpdateUser(long id, AdminUserDto request)
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

            return new AdminUserDto
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

        // -------------------- Groups  --------------------

        public async Task<IEnumerable<AdminGroupDto>> GetGroups()
        {
            return await _db.Groups
                .Include(g => g.UserGroups)
                .ThenInclude(ug => ug.User)
                .ThenInclude(u => u.Role)
                .Select(g => new AdminGroupDto
                {
                    Id = g.Id,
                    GroupName = g.GroupName,
                    Users = g.UserGroups.Select(ug => new AdminUserDto
                    {
                        Id = ug.User.Id,
                        UserName = ug.User.UserName,
                        FullName = ug.User.FullName,
                        Email = ug.User.Email,
                        RoleName = ug.User.Role.RoleName
                    }).ToList()
                })
                .ToListAsync();
        }

        public async Task<AdminGroupDto?> GetGroupById(long id)
        {
            var g = await _db.Groups
                .Include(g => g.UserGroups)
                .ThenInclude(ug => ug.User)
                .ThenInclude(u => u.Role)
                .FirstOrDefaultAsync(g => g.Id == id);

            if (g == null) return null;

            return new AdminGroupDto
            {
                Id = g.Id,
                GroupName = g.GroupName,
                Users = g.UserGroups.Select(ug => new AdminUserDto
                {
                    Id = ug.User.Id,
                    UserName = ug.User.UserName,
                    FullName = ug.User.FullName,
                    Email = ug.User.Email,
                    RoleName = ug.User.Role.RoleName
                }).ToList()
            };
        }

        public async Task<AdminGroupDto> CreateGroup(AdminGroupDto dto)
        {
            var group = new Group
            {
                GroupName = dto.GroupName
            };

            _db.Groups.Add(group);
            await _db.SaveChangesAsync();

            dto.Id = group.Id;
            return dto;
        }

        public async Task<AdminGroupDto> UpdateGroup(long id, AdminGroupDto dto)
        {
            var group = await _db.Groups.FindAsync(id);
            if (group == null) throw new ArgumentException("Group not found");
            var userIds = dto.Users.Select(u => u.Id);

            group.GroupName = dto.GroupName;
            foreach (int userid in userIds)
            {
                await AddUserToGroup(id, userid);
            }

            await _db.SaveChangesAsync();
            return dto;
        }

        public async Task DeleteGroup(long id)
        {
            var group = await _db.Groups.FindAsync(id);
            if (group != null)
            {
                _db.Groups.Remove(group);
                await _db.SaveChangesAsync();
            }
        }

        public async Task AddUserToGroup(long groupId, long userId)
        {
            bool exists = await _db.UserGroups.AnyAsync(x => x.GroupId == groupId && x.UserId == userId);

            if (!exists)
            {
                _db.UserGroups.Add(new UserGroup
                {
                    GroupId = groupId,
                    UserId = userId
                });

                await _db.SaveChangesAsync();
            }
        }

        public async Task RemoveUserFromGroup(long groupId, long userId)
        {
            var ug = await _db.UserGroups
                .FirstOrDefaultAsync(x => x.GroupId == groupId && x.UserId == userId);

            if (ug != null)
            {
                _db.UserGroups.Remove(ug);
                await _db.SaveChangesAsync();
            }
        }

        public async Task<AdminGroupsByUsersDto?> GetGroupsByUser(long userId)
        {
            // Get user info
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null) return null;

            // Get groups where the user is a member
            var groups = await _db.Groups
                .Include(g => g.UserGroups)
                .ThenInclude(ug => ug.User)
                .Where(g => g.UserGroups.Any(ug => ug.UserId == userId))
                .Select(g => new AdminGroupDto
                {
                    Id = g.Id,
                    GroupName = g.GroupName,
                    Users = g.UserGroups.Select(ug => new AdminUserDto
                    {
                        Id = ug.User.Id,
                        UserName = ug.User.UserName,
                        FullName = ug.User.FullName,
                        Email = ug.User.Email,
                        RoleName = ug.User.Role.RoleName
                    }).ToList()
                })
                .ToListAsync();

            return new AdminGroupsByUsersDto
            {
                UserId = user.Id,
                UserName = user.UserName,
                Groups = groups
            };
        }
    }
}
