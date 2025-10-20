using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Db;
using Server.Dtos.Event;
using Server.Entities;
using Server.Services.Events;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<EventReadDto>), 200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetAll()
        {
            var events = await _eventService.GetAllAsync();
            return Ok(events);
        }

        /// <summary>
        /// Retrieves a specific event by ID.
        /// </summary>
        /// <param name="id">The ID of the event.</param>
        /// <response code="200">Event found and returned.</response>
        /// <response code="404">Event not found.</response>
        /// <response code="401">Unauthorized. Authentication is required.</response>
        [HttpGet("{id:long}")]
        [ProducesResponseType(typeof(EventReadDto), 200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetById(long id)
        {
            var ev = await _eventService.GetByIdAsync(id);
            if (ev == null) return NotFound();
            return Ok(ev);
        }

        [HttpGet("GetFiltered")]
        [ProducesResponseType(typeof(EventReadDto), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult>  GetFiltered(string? time, string? title, string? location, string? creator)
        {
            var filteredEvents = await _eventService.GetFiltered(time, title, location, creator);
            if (filteredEvents is null) return NotFound();
            return Ok(filteredEvents);
        }

        /// <summary>
        /// Creates a new event.
        /// </summary>
        /// <param name="dto">Event creation data transfer object.</param>
        /// <remarks>
        /// LocationId is optional. If provided, it must reference an existing location.
        /// </remarks>
        /// <response code="201">Event created successfully.</response>
        /// <response code="400">Invalid LocationId provided.</response>
        /// <response code="401">Unauthorized. Authentication is required.</response>
        [HttpPost]
        [ProducesResponseType(typeof(EventReadDto), 201)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> Create([FromBody] EventCreateDto dto)
        {
            if (dto.LocationId.HasValue)
            {
                var locationExists = await _context.Locations.AnyAsync(l => l.Id == dto.LocationId.Value);
                if (!locationExists)
                    return BadRequest($"Location with ID {dto.LocationId.Value} does not exist.");
            }

            // Get authenticated user ID from JWT claims
            var username = User.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value;
            var email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(username) && string.IsNullOrEmpty(email))
                return Unauthorized("Invalid JWT claims.");

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserName == username || u.Email == email);

            if (user == null)
                return Unauthorized("User does not exist.");

            var userId = user.Id;

            var ev = await _eventService.CreateAsync(dto, userId);
            return CreatedAtAction(nameof(GetById), new { id = ev.Id }, ev);
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
        [HttpPut("{id:long}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> Update(long id, [FromBody] EventUpdateDto dto)
        {
            if (dto.LocationId.HasValue)
            {
                var locationExists = await _context.Locations.AnyAsync(l => l.Id == dto.LocationId.Value);
                if (!locationExists)
                    return BadRequest($"Location with ID {dto.LocationId.Value} does not exist.");
            }

            var success = await _eventService.UpdateAsync(id, dto);
            if (!success) return NotFound();
            return NoContent();
        }

        /// <summary>
        /// Deletes an event by ID.
        /// </summary>
        /// <param name="id">The ID of the event to delete.</param>
        /// <response code="204">Event deleted successfully.</response>
        /// <response code="404">Event not found.</response>
        /// <response code="401">Unauthorized. Authentication is required.</response>
        [HttpDelete("{id:long}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> Delete(long id)
        {
            var success = await _eventService.DeleteAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}
