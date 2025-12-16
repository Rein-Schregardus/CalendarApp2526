using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Db;
using Server.Dtos.RoomReservation;
using Server.Services.RoomReservations;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    [Authorize] //all endpoints require authentication
    public class ReservationController : ControllerBase
    {
        private readonly IReservationService _reservationService;

        public ReservationController(IReservationService reservationService)
        {
            _reservationService = reservationService;
        }

        /// <summary>
        /// Retrieves all reservations.
        /// </summary>
        /// <remarks>
        /// Returns a list of all reservations with optional location information.
        /// </remarks>
        /// <response code="200">List of reservations returned successfully.</response>
        /// <response code="401">Unauthorized. Authentication is required.</response>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<ReadReservationDto>), 200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetAll()
        {
            var reservations = await _reservationService.GetAll();
            return Ok(reservations);
        }

        /// <summary>
        /// Retrieves a specific reservation by ID.
        /// </summary>
        /// <param name="id">The ID of the reservation.</param>
        /// <response code="200">reservation found and returned.</response>
        /// <response code="404">reservation not found.</response>
        /// <response code="401">Unauthorized. Authentication is required.</response>
        [HttpGet("{id:long}")]
        [ProducesResponseType(typeof(ReadReservationDto), 200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetById(long id)
        {
            var ev = await _reservationService.GetById(id);
            if (ev == null) return NotFound();
            return Ok(ev);
        }

        /// <summary>
        /// Creates a new reservation.
        /// </summary>
        /// <param name="dto">reservation creation data transfer object.</param>
        /// <remarks>
        /// LocationId is optional. If provided, it must reference an existing location.
        /// </remarks>
        /// <response code="201">reservation created successfully.</response>
        /// <response code="400">Invalid LocationId provided.</response>
        /// <response code="401">Unauthorized. Authentication is required.</response>
        [HttpPost]
        [ProducesResponseType(typeof(ReadReservationDto), 201)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> Create([FromBody] WriteReservationDto dto)
        {
            var allowed = await _reservationService.IsReservationLegal(dto);
            if (!allowed.Item1)
            {
                return BadRequest(allowed.Item2);
            }

            long userId = long.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value);

            var ev = await _reservationService.Create(dto);
            return CreatedAtAction(nameof(GetById), new { id = ev.Id }, ev);
        }

        /// <summary>
        /// Updates an existing reservation.
        /// </summary>
        /// <param name="id">The ID of the reservation to update.</param>
        /// <param name="dto">reservation update data transfer object.</param>
        /// <remarks>
        /// LocationId is optional. If provided, it must reference an existing location.
        /// </remarks>
        /// <response code="204">reservation updated successfully.</response>
        /// <response code="400">Invalid LocationId provided.</response>
        /// <response code="404">reservation not found.</response>
        /// <response code="401">Unauthorized. Authentication is required.</response>
        [HttpPut("{id:long}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> Update(long id, [FromBody] WriteReservationDto dto)
        {

            //var locationExists = await _context.Locations.AnyAsync(l => l.Id == dto.LocationId.Value);
            //if (!locationExists)
            //    return BadRequest($"Location with ID {dto.LocationId} does not exist.");
            var allowed = await _reservationService.IsReservationLegal(dto, id);
            if (!allowed.Item1)
            {
                return BadRequest(allowed.Item2);
            }
            var success = await _reservationService.Update(id, dto);
            if (success == null) return NotFound();
            return NoContent();
        }

        /// <summary>
        /// Deletes an reservation by ID.
        /// </summary>
        /// <param name="id">The ID of the reservation to delete.</param>
        /// <response code="204">reservation deleted successfully.</response>
        /// <response code="404">reservation not found.</response>
        /// <response code="401">Unauthorized. Authentication is required.</response>
        [HttpDelete("{id:long}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> Delete(long id)
        {
            var success = await _reservationService.Delete(id);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}
