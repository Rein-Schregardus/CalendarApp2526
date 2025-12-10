using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Dtos.Auth;
using Server.Dtos.Role;
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

        public AdminController(IAdminService service)
        {
            _service = service;
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
        // Can implement same pattern for groups in the future
    }
}
