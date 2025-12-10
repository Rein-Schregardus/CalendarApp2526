using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Db;
using Server.Dtos.Admin;
using Server.Dtos.Auth;
using Server.Dtos.Role;
using Server.Entities;
using Server.Services.Admin;

namespace Server.Controllers
{
    [ApiController]
    [Route("admin")]
    [Produces("application/json")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _service;
        private readonly AppDbContext _context;

        public AdminController(IAdminService service, AppDbContext context)
        {
            _service = service;
            _context = context;
        }

        // -------------------- USERS --------------------
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers() => Ok(await _service.GetAllUsers());

        [HttpGet("users/{id:long}")]
        public async Task<IActionResult> GetUser(long id)
        {
            var user = await _service.GetUserById(id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpPost("users")]
        public async Task<IActionResult> CreateUser([FromBody] RegisterRequest request)
        {
            var created = await _service.CreateUser(request);
            return CreatedAtAction(nameof(GetUser), new { id = created.Id }, created);
        }

        [HttpPut("users/{id:long}")]
        public async Task<IActionResult> UpdateUser(long id, [FromBody] RegisterRequest request)
        {
            try
            {
                var updated = await _service.UpdateUser(id, request);
                return Ok(updated);
            }
            catch (ArgumentException)
            {
                return NotFound();
            }
        }

        [HttpDelete("users/{id:long}")]
        public async Task<IActionResult> DeleteUser(long id)
        {
            await _service.DeleteUser(id);
            return NoContent();
        }

        // -------------------- ROLES --------------------
        [HttpGet("roles")]
        public async Task<IActionResult> GetRoles() => Ok(await _service.GetRoles());

        [HttpGet("roles/{id:long}")]
        public async Task<IActionResult> GetRole(long id)
        {
            var role = (await _service.GetRoles()).FirstOrDefault(r => r.Id == id);
            if (role == null) return NotFound();
            return Ok(role);
        }

        [HttpPost("roles")]
        public async Task<IActionResult> CreateRole([FromBody] RoleDto dto)
        {
            var created = await _service.CreateRole(dto);
            return CreatedAtAction(nameof(GetRole), new { id = created.Id }, created);
        }

        [HttpPut("roles/{id:long}")]
        public async Task<IActionResult> UpdateRole(long id, [FromBody] RoleDto dto)
        {
            try
            {
                var updated = await _service.UpdateRole(id, dto);
                return Ok(updated);
            }
            catch (ArgumentException)
            {
                return NotFound();
            }
        }

        [HttpDelete("roles/{id:long}")]
        public async Task<IActionResult> DeleteRole(long id)
        {
            await _service.DeleteRole(id);
            return NoContent();
        }

        // -------------------- GROUPS --------------------
        [HttpGet("groups")]
        public async Task<IActionResult> GetGroups()
            => Ok(await _service.GetGroups());

        [HttpGet("groups/{id:long}")]
        public async Task<IActionResult> GetGroup(long id)
        {
            var g = await _service.GetGroupById(id);
            if (g == null) return NotFound();
            return Ok(g);
        }

        [HttpPost("groups")]
        public async Task<IActionResult> CreateGroup([FromBody] AdminGroupDto dto)
        {
            var created = await _service.CreateGroup(dto);
            return CreatedAtAction(nameof(GetGroup), new { id = created.Id }, created);
        }

        [HttpPut("groups/{id:long}")]
        public async Task<IActionResult> UpdateGroup(long id, [FromBody] AdminGroupDto dto)
        {
            try
            {
                var updated = await _service.UpdateGroup(id, dto);
                return Ok(updated);
            }
            catch (ArgumentException)
            {
                return NotFound();
            }
        }

        [HttpDelete("groups/{id:long}")]
        public async Task<IActionResult> DeleteGroup(long id)
        {
            await _service.DeleteGroup(id);
            return NoContent();
        }

        // -------- USER ↔ GROUP LINKS --------
        [HttpPost("groups/{groupId:long}/users")]
        public async Task<IActionResult> AddUserToGroup(long groupId, [FromBody] AddUserToGroupDto dto)
        {
            await _service.AddUserToGroup(groupId, dto.UserId);
            return Ok();
        }

        [HttpDelete("groups/{groupId:long}/users/{userId:long}")]
        public async Task<IActionResult> RemoveUserFromGroup(long groupId, long userId)
        {
            await _service.RemoveUserFromGroup(groupId, userId);
            return NoContent();
        }

        // -------- logs --------
        [HttpGet("logs")]
        public async Task<IActionResult> GetLogs()
        {
            var logs = await _context.Logs
                .OrderByDescending(l => l.Time)
                .ToListAsync();
            return Ok(logs);
        }

        [HttpPost("logs")]
        public async Task<IActionResult> AddLog([FromBody] LogEntry log)
        {
            if (log.AdminId == 0 || string.IsNullOrWhiteSpace(log.Message))
                return BadRequest("AdminId and Message are required.");
            log.Time = DateTime.UtcNow;

            _context.Logs.Add(log);
            await _context.SaveChangesAsync();

            return Ok(log);
        }
    }
}
