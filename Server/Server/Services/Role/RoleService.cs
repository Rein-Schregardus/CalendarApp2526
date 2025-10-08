using Microsoft.EntityFrameworkCore;
using Server.Db;
using Server.Dtos.Role;
using Server.Entities;

namespace Server.Services.Roles
{
    public class RoleService : IRoleService
    {
        private readonly AppDbContext _dbContext;

        public RoleService(AppDbContext context)
        {
            _dbContext = context;
        }

        public async Task<RoleDto> CreateAsync(RoleDto dto)
        {
            var entity = new Role
            {
                RoleName = dto.RoleName
            };

            _dbContext.Roles.Add(entity);
            await _dbContext.SaveChangesAsync();

            return await GetByIdAsync(entity.Id) ?? throw new Exception("Error creating role.");
        }

        public async Task<RoleDto?> GetByIdAsync(long id)
        {
            var r = await _dbContext.Roles
                .FirstOrDefaultAsync(x => x.Id == id);

            if (r == null) return null;

            return MapToDto(r);
        }

        public async Task<IEnumerable<RoleDto>> GetAllAsync()
        {
            var roles = await _dbContext.Roles
                .ToListAsync();

            return roles.Select(MapToDto);
        }

        public async Task<bool> UpdateAsync(long id, RoleDto dto)
        {
            var r = await _dbContext.Roles.FindAsync(id);
            if (r == null) return false;

            r.RoleName = dto.RoleName;

            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(long id)
        {
            var r = await _dbContext.Roles.FindAsync(id);
            if (r == null) return false;

            _dbContext.Roles.Remove(r);
            await _dbContext.SaveChangesAsync();
            return true;
        }
        private static RoleDto MapToDto(Role r)
        {
            return new RoleDto
            {
                Id = r.Id,
                RoleName = r.RoleName
            };
        }
    }
}
