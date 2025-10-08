using Server.Dtos.Role;

namespace Server.Services.Roles
{
    public interface IRoleService
    {
        Task<RoleDto> CreateAsync(RoleDto dto);
        Task<RoleDto?> GetByIdAsync(long id);
        Task<IEnumerable<RoleDto>> GetAllAsync();
        Task<bool> UpdateAsync(long id, RoleDto dto);
        Task<bool> DeleteAsync(long id);
    }
}
