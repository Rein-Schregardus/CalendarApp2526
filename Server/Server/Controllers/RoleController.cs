using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Db;
using Server.Dtos.Role;
using Server.Services.Roles;

namespace Server.Controllers
{
    /// <summary>
    /// Handles role management.
    /// Provides endpoints for creating, reading, updating, and deleting roles.
    /// </summary>
    [ApiController]
    [Route("roles")]
    [Produces("application/json")]
    [Authorize]
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;
        private readonly AppDbContext _context;

        public RoleController(IRoleService roleService, AppDbContext context)
        {
            _roleService = roleService;
            _context = context;
        }

        /// <summary>
        /// Retrieves all roles.
        /// </summary>
        /// <remarks>
        /// Returns a list of all roles available in the system.
        /// </remarks>
        /// <response code="200">List of roles returned successfully.</response>
        /// <response code="401">Unauthorized. Authentication is required.</response>
        /// <response code="500">Internal server error.</response>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var roles = await _roleService.GetAllAsync();
                return Ok(roles);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// Retrieves a specific role by ID.
        /// </summary>
        /// <param name="id">The ID of the role.</param>
        /// <response code="200">Role found and returned.</response>
        /// <response code="404">Role not found.</response>
        /// <response code="401">Unauthorized. Authentication is required.</response>
        /// <response code="500">Internal server error.</response>
        [HttpGet("{id:long}")]
        public async Task<IActionResult> GetById(long id)
        {
            try
            {
                var role = await _roleService.GetByIdAsync(id);
                if (role == null) return NotFound();
                return Ok(role);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// Creates a new role.
        /// </summary>
        /// <param name="dto">Role data transfer object.</param>
        /// <remarks>
        /// The system initializes with two default roles:
        /// 1. **User** – standard application user  
        /// 2. **Admin** – full administrative privileges
        /// </remarks>
        /// <response code="201">Returns the newly created role.</response>
        /// <response code="400">If the role data is invalid or already exists.</response>
        /// <response code="500">Internal server error.</response>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] RoleDto dto)
        {
            try
            {
                var role = await _roleService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = role.Id }, role);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// Updates an existing role.
        /// </summary>
        /// <param name="id">The ID of the role to update.</param>
        /// <param name="dto">Role data transfer object.</param>
        /// <remarks>
        /// ⚠️ Modifying or removing the **User** or **Admin** role may prevent new users from being assigned a valid role.
        /// </remarks>
        /// <response code="204">Role updated successfully.</response>
        /// <response code="400">Invalid role data or update request.</response>
        /// <response code="404">Role not found.</response>
        /// <response code="401">Unauthorized access.</response>
        /// <response code="500">Internal server error.</response>
        [HttpPut("{id:long}")]
        public async Task<IActionResult> Update(long id, [FromBody] RoleDto dto)
        {
            try
            {
                var success = await _roleService.UpdateAsync(id, dto);
                if (!success) return NotFound();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// Deletes a role by ID.
        /// </summary>
        /// <param name="id">The ID of the role to delete.</param>
        /// <remarks>
        /// ⚠️ Deleting default roles such as **User** or **Admin** is strongly discouraged.  
        /// Removing these roles can break authentication and authorization across the system.
        /// </remarks>
        /// <response code="204">Role deleted successfully.</response>
        /// <response code="404">Role not found.</response>
        /// <response code="401">Unauthorized. Authentication is required.</response>
        /// <response code="500">Internal server error.</response>
        [HttpDelete("{id:long}")]
        public async Task<IActionResult> Delete(long id)
        {
            try
            {
                var success = await _roleService.DeleteAsync(id);
                if (!success) return NotFound();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}
