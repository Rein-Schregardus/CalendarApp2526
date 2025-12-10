using Server.Dtos.Admin;
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


        Task<IEnumerable<AdminGroupDto>> GetGroups();
        Task<AdminGroupDto?> GetGroupById(long id);
        Task<AdminGroupDto> CreateGroup(AdminGroupDto dto);
        Task<AdminGroupDto> UpdateGroup(long id, AdminGroupDto dto);
        Task DeleteGroup(long id);

        Task AddUserToGroup(long groupId, long userId);
        Task RemoveUserFromGroup(long groupId, long userId);
    }
}
