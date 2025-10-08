using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Db;
using Server.Dtos.Role;
using Server.Services.Roles;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    [Authorize] //all endpoints require authentication
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
        /// Returns a list of all roles
        /// </remarks>
        /// <response code="200">List of roles returned successfully.</response>
        /// <response code="401">Unauthorized. Authentication is required.</response>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<RoleDto>), 200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetAll()
        {
            var roles = await _roleService.GetAllAsync();
            return Ok(roles);
        }

        /// <summary>
        /// Retrieves a specific role by ID.
        /// </summary>
        /// <param name="id">The ID of the role.</param>
        /// <response code="200">Role found and returned.</response>
        /// <response code="404">Role not found.</response>
        /// <response code="401">Unauthorized. Authentication is required.</response>
        [HttpGet("{id:long}")]
        [ProducesResponseType(typeof(RoleDto), 200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetById(long id)
        {
            var r = await _roleService.GetByIdAsync(id);
            if (r == null) return NotFound();
            return Ok(r);
        }

        /// <summary>
        /// Creates a new role.
        /// </summary>
        /// <param name="dto">Role data transfer object.</param>
        /// <remarks>
        /// The database is initialized with two default roles for convenience:
        /// 1. **User** – standard application user  
        /// 2. **Admin** – full administrative privileges
        /// </remarks>
        /// <response code="201">Returns the newly created role.</response>
        /// <response code="400">If the role data is invalid or the role already exists.</response>
        /// <response code="500">If an unexpected error occurs on the server.</response>
        [HttpPost]
        [ProducesResponseType(typeof(RoleDto), 201)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> Create([FromBody] RoleDto dto)
        {
            var r = await _roleService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), r);
        }

        /// <summary>
        /// Updates an existing role.
        /// </summary>
        /// <param name="dto">Role data transfer object.</param>
        /// <remarks>
        /// The database is initialized with two default roles for convenience:
        /// 1. **User** – standard application user  
        /// 2. **Admin** – full administrative privileges  
        ///
        /// When a new user registers without explicitly specifying a role,  
        /// the **User** role is automatically assigned by default.
        ///
        /// ⚠️ **Warning:**  
        /// Modifying or removing the **User** role can cause issues with the registration process  
        /// and may prevent new users from being assigned a valid role.
        /// </remarks>
        /// <response code="204">Role updated successfully.</response>
        /// <response code="400">Invalid role data or update request.</response>
        /// <response code="401">Unauthorized access.</response>
        /// <response code="404">Role not found.</response>
        [HttpPut("{id:long}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Update(long id, [FromBody] RoleDto dto)
        {
            var success = await _roleService.UpdateAsync(id, dto);
            if (!success)
                return NotFound();

            return NoContent();
        }

        /// <summary>
        /// Deletes a role by ID.
        /// </summary>
        /// <param name="id">The ID of the role to delete.</param>
        /// <remarks>
        /// The database is initialized with two default roles for convenience:
        /// 1. **User** – standard application user  
        /// 2. **Admin** – full administrative privileges  
        /// 
        /// ⚠️ **Warning:**  
        /// Deleting default roles such as **User** or **Admin** is strongly discouraged.  
        /// - The **User** role is automatically assigned to new users upon registration.  
        /// - Removing these roles can cause authentication and authorization issues across the system.  
        /// </remarks>
        /// <response code="204">Role deleted successfully.</response>
        /// <response code="401">Unauthorized. Authentication is required or insufficient permissions.</response>
        /// <response code="404">Role not found.</response>
        [HttpDelete("{id:long}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(401)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Delete(long id)
        {
            var success = await _roleService.DeleteAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }

    }
}
