using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Db;
using Server.Entities;

namespace Server.Controllers
{
    /// <summary>
    /// Manages location data including creation, updating, deletion,
    /// retrieval, and availability checking.
    /// </summary>
    [ApiController]
    [Route("locations")]
    [Produces("application/json")]
    public class LocationController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LocationController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves all locations in the system.
        /// </summary>
        /// <returns>A list of all locations.</returns>
        /// <response code="200">Returns all locations.</response>
        /// <response code="500">Internal server error.</response>
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var locations = await _context.Locations.ToListAsync();
                return Ok(locations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// Retrieves a specific location by ID.
        /// </summary>
        /// <param name="id">The ID of the location.</param>
        /// <returns>The requested location.</returns>
        /// <response code="200">Location found.</response>
        /// <response code="404">Location not found.</response>
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOne(long id)
        {
            var location = await _context.Locations.FindAsync(id);
            if (location == null)
                return NotFound(new { message = "Location not found" });

            return Ok(location);
        }

        /// <summary>
        /// Creates a new location.
        /// </summary>
        /// <remarks>
        /// Requires location name, capacity, and location type.
        /// </remarks>
        /// <param name="model">The location data.</param>
        /// <returns>The created location.</returns>
        /// <response code="201">Location created successfully.</response>
        /// <response code="400">Invalid request data.</response>
        /// <response code="500">Internal server error.</response>
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Location model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                _context.Locations.Add(model);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetOne), new { id = model.Id }, model);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// Updates an existing location.
        /// </summary>
        /// <param name="id">The location ID.</param>
        /// <param name="model">Updated location data.</param>
        /// <returns>No content on success.</returns>
        /// <response code="204">Location updated successfully.</response>
        /// <response code="404">Location not found.</response>
        /// <response code="500">Internal server error.</response>
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, [FromBody] Location model)
        {
            var location = await _context.Locations.FindAsync(id);

            if (location == null)
                return NotFound(new { message = "Location not found" });

            try
            {
                location.LocationName = model.LocationName;
                location.Capacity = model.Capacity;
                location.Type = model.Type;

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// Deletes a location.
        /// </summary>
        /// <param name="id">The location ID.</param>
        /// <returns>No content on success.</returns>
        /// <response code="204">Location deleted successfully.</response>
        /// <response code="404">Location not found.</response>
        /// <response code="500">Internal server error.</response>
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            var location = await _context.Locations.FindAsync(id);
            if (location == null)
                return NotFound(new { message = "Location not found" });

            try
            {
                _context.Locations.Remove(location);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// Retrieves all locations available within a specific start and end date/time range.
        /// </summary>
        /// <remarks>
        /// A location is considered unavailable if an event overlaps the requested time window.
        /// </remarks>
        /// <param name="start">Start time.</param>
        /// <param name="end">End time.</param>
        /// <returns>A list of available locations.</returns>
        /// <response code="200">Returns list of available locations.</response>
        /// <response code="400">Time range invalid.</response>
        /// <response code="500">Internal server error.</response>
        [Authorize]
        [HttpGet("available")]
        public async Task<IActionResult> GetAvailable(DateTime date, TimeSpan start, TimeSpan end)
        {
            if (end <= start)
                return BadRequest(new { message = "End time must be greater than start time" });

            try
            {
                var conflictingIds = await _context.Events
                    .Where(e => (start < e.EndTime) && (end > e.StartTime))
                    .Select(e => e.LocationId)
                    .Distinct()
                    .ToListAsync();

                var available = await _context.Locations
                    .Where(l => !conflictingIds.Contains(l.Id))
                    .ToListAsync();

                return Ok(available);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}