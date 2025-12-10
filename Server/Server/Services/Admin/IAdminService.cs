using Server.Dtos.Auth;
using Server.Dtos.Role;

namespace Server.Services.Admin
{
    public interface IAdminService
    {
        Task<IEnumerable<UserInfoDto>> GetAllUsers();
        Task<UserInfoDto?> GetUserById(long id);
        Task<UserInfoDto> CreateUser(RegisterRequest request);
        Task<UserInfoDto> UpdateUser(long id, RegisterRequest request);
        Task DeleteUser(long id);

        Task<IEnumerable<RoleDto>> GetRoles();
        Task<RoleDto?> GetRoleById(long id);
        Task<RoleDto> CreateRole(RoleDto dto);
        Task<RoleDto> UpdateRole(long id, RoleDto dto);
        Task DeleteRole(long id);
    }
}
