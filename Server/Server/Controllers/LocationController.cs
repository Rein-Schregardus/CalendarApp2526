using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Db;
using Server.Dtos.Locations;
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
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var locations = await _context.Locations.ToListAsync();

            var result = locations.Select(l => new LocationDto
            {
                Id = l.Id,
                LocationName = l.LocationName,
                Capacity = l.Capacity,
                Type = l.Type
            });

            return Ok(result);
        }

        /// <summary>
        /// Retrieves a specific location by ID.
        /// </summary>
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOne(long id)
        {
            var location = await _context.Locations.FindAsync(id);

            if (location == null)
                return NotFound(new { message = "Location not found" });

            var dto = new LocationDto
            {
                Id = location.Id,
                LocationName = location.LocationName,
                Capacity = location.Capacity,
                Type = location.Type
            };

            return Ok(dto);
        }

        /// <summary>
        /// Creates a new location.
        /// </summary>
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateLocationDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var location = new Location
            {
                LocationName = dto.LocationName,
                Capacity = dto.Capacity,
                Type = dto.Type
            };

            _context.Locations.Add(location);
            await _context.SaveChangesAsync();

            var result = new LocationDto
            {
                Id = location.Id,
                LocationName = location.LocationName,
                Capacity = location.Capacity,
                Type = location.Type
            };

            return CreatedAtAction(nameof(GetOne), new { id = location.Id }, result);
        }

        /// <summary>
        /// Updates an existing location.
        /// </summary>
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, [FromBody] UpdateLocationDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var location = await _context.Locations.FindAsync(id);

            if (location == null)
                return NotFound(new { message = "Location not found" });

            location.LocationName = dto.LocationName;
            location.Capacity = dto.Capacity;
            location.Type = dto.Type;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Deletes a location.
        /// </summary>
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            var location = await _context.Locations.FindAsync(id);

            if (location == null)
                return NotFound(new { message = "Location not found" });

            _context.Locations.Remove(location);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Retrieves all locations available within a specific start and end date/time range.
        /// </summary>
        [Authorize]
        [HttpGet("available")]
        public async Task<IActionResult> GetAvailable(
            DateTime start,
            DateTime end,
            long? excludeEventId)
        {
            start = start.ToUniversalTime();
            end = end.ToUniversalTime();

            if (end <= start)
                return BadRequest(new { message = "End time must be greater than start time" });

            List<long?> conflictingIds = await _context.Events
                .Where(e => e.Id != excludeEventId)
                .Where(e => start < e.Start.AddMinutes(e.Duration) && end > e.Start)
                .Select(e => e.LocationId)
                .Distinct()
                .ToListAsync();

            conflictingIds.AddRange(await _context.Reservations
                .Where(r => start < r.Start.AddMinutes(r.Duration) && end > r.Start)
                .Select(r => new long?(r.RoomId))
                .Distinct()
                .ToListAsync());

            var available = await _context.Locations
                .Where(l => !conflictingIds.Contains(l.Id))
                .ToListAsync();

            var result = available.Select(l => new LocationDto
            {
                Id = l.Id,
                LocationName = l.LocationName,
                Capacity = l.Capacity,
                Type = l.Type
            });

            return Ok(result);
        }
    }
}
