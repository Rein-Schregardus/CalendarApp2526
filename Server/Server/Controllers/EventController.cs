using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Db;
using Server.Dtos.Event;
using Server.Services.Events;
using System.Security.Claims;

namespace Server.Controllers
{
    /// <summary>
    /// Handles event management.
    /// Provides endpoints for creating, reading, updating, and deleting events.
    /// </summary>
    [ApiController]
    [Route("events")]
    [Produces("application/json")]
    [Authorize] //all endpoints require authentication
    public class EventsController : ControllerBase
    {
        private readonly IEventService _eventService;
        private readonly AppDbContext _context;

        public EventsController(IEventService eventService, AppDbContext context)
        {
            _eventService = eventService;
            _context = context;
        }

        /// <summary>
        /// Retrieves all events.
        /// </summary>
        /// <remarks>
        /// Returns a list of all events with optional location information.
        /// </remarks>
        /// <response code="200">List of events returned successfully.</response>
        /// <response code="401">Unauthorized. Authentication is required.</response>
        /// <response code="500">Internal server error.</response>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var events = await _eventService.GetAllAsync();
                return Ok(events);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// Retrieves a specific event by ID.
        /// </summary>
        /// <param name="id">The ID of the event.</param>
        /// <response code="200">Event found and returned.</response>
        /// <response code="404">Event not found.</response>
        /// <response code="401">Unauthorized. Authentication is required.</response>
        /// <response code="500">Internal server error.</response>
        [HttpGet("{id:long}")]
        public async Task<IActionResult> GetById(long id)
        {
            var ev = await _eventService.GetByIdAsync(id);
            if (ev == null) return NotFound();
            return Ok(ev);
        }

        [HttpGet("GetFiltered")]
        [ProducesResponseType(typeof(EventReadDto), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetFiltered(string? time, string? title, string? location, string? creator, string? attendee)
        {
            var filteredEvents = await _eventService.GetFiltered(time, title, location, creator, attendee);
            if (filteredEvents is null) return NotFound();
            return Ok(filteredEvents);
        }

        /// <summary>
        /// Creates a new event.
        /// </summary>
        /// <param name="dto">Event creation data transfer object.</param>
        /// <remarks>
        /// LocationId is optional. If provided, it must reference an existing location.
        /// The authenticated user is assigned as the event creator.
        /// </remarks>
        /// <response code="201">Event created successfully.</response>
        /// <response code="400">Invalid LocationId provided.</response>
        /// <response code="401">Unauthorized. Authentication is required.</response>
        /// <response code="500">Internal server error.</response>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] EventCreateDto dto)
        {
            try
            {
                if (dto.LocationId.HasValue)
                {
                    var locationExists = await _context.Locations.AnyAsync(l => l.Id == dto.LocationId.Value);
                    if (!locationExists)
                        return BadRequest($"Location with ID {dto.LocationId.Value} does not exist.");
                }

                var userId = GetAuthenticatedUserId();
                if (userId == null)
                    return Unauthorized("Invalid JWT claims.");

                var ev = await _eventService.CreateAsync(dto, userId.Value);
                return CreatedAtAction(nameof(GetById), new { id = ev.Id }, ev);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// Updates an existing event.
        /// </summary>
        /// <param name="id">The ID of the event to update.</param>
        /// <param name="dto">Event update data transfer object.</param>
        /// <remarks>
        /// LocationId is optional. If provided, it must reference an existing location.
        /// </remarks>
        /// <response code="204">Event updated successfully.</response>
        /// <response code="400">Invalid LocationId provided.</response>
        /// <response code="404">Event not found.</response>
        /// <response code="401">Unauthorized. Authentication is required.</response>
        /// <response code="500">Internal server error.</response>
        [HttpPut("{id:long}")]
        public async Task<IActionResult> Update(long id, [FromBody] EventUpdateDto dto)
        {
            try
            {
                if (dto.LocationId.HasValue)
                {
                    var locationExists = await _context.Locations.AnyAsync(l => l.Id == dto.LocationId.Value);
                    if (!locationExists)
                        return BadRequest($"Location with ID {dto.LocationId.Value} does not exist.");
                }

            var success = await _eventService.UpdateAsync(id, dto);
            if (success == null) return NotFound();
            return Ok(success);
        }

        /// <summary>
        /// Deletes an event by ID.
        /// </summary>
        /// <param name="id">The ID of the event to delete.</param>
        /// <response code="204">Event deleted successfully.</response>
        /// <response code="404">Event not found.</response>
        /// <response code="401">Unauthorized. Authentication is required.</response>
        /// <response code="500">Internal server error.</response>
        [HttpDelete("{id:long}")]
        public async Task<IActionResult> Delete(long id)
        {
            try
            {
                var success = await _eventService.DeleteAsync(id);
                if (!success) return NotFound();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// Helper method to get the authenticated user's ID from JWT claims.
        /// </summary>
        private long? GetAuthenticatedUserId()
        {
            var username = User.FindFirstValue(ClaimTypes.Name);
            var email = User.FindFirstValue(ClaimTypes.Email);

            if (string.IsNullOrEmpty(username) && string.IsNullOrEmpty(email))
                return null;

            var user = _context.Users.FirstOrDefault(u => u.UserName == username || u.Email == email);
            return user?.Id;
        }
    }
}
