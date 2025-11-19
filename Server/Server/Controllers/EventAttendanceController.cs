using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Db;
using Server.Entities;
using Server.Services.EventAttendances;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    [Authorize] //all endpoints require authentication
    public class EventAttendanceController: ControllerBase
    {
        private IEventAttendanceService _eventAttendanceService;

        public EventAttendanceController(IEventAttendanceService eventAttendanceService)
        {
            _eventAttendanceService = eventAttendanceService;
        }

        [HttpPost]
        public async Task<IActionResult> MeAttendEvent(long EventId)
        {
            string? userIdstr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userIdstr == null)
                return BadRequest("User could not be found in database");
            if (!long.TryParse(userIdstr, out var userId))
                return StatusCode(500, "Id is non numeric");
            var user = await _eventAttendanceService.UserAttendEvent(userId, EventId);
            return Ok(user);
        }

        
        [HttpDelete]
        public async Task<IActionResult> MeUnnattendEvent(long EventId)
        {
            string? userIdstr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userIdstr == null)
                return BadRequest("User could not be found in database");
            if (!long.TryParse(userIdstr, out var userId))
                return StatusCode(500, "Id is non numeric");
            var user = await _eventAttendanceService.UserUnattendEvent(userId, EventId);
            return Ok(user);
        }

        //[HttpPost]
        //[Authorize(Roles = "Admin")]
        //public Task<IActionResult> UserAttendEvent(long UserId, long EventId)
        //{
        //    throw new NotImplementedException();
        //}

        //[HttpDelete]
        //[Authorize(Roles = "Admin")]
        //public Task<IActionResult> UserUnattendEvent(long UserId, long EventId)
        //{
        //    throw new NotImplementedException();
        //}

        [HttpGet]
        public async Task<IActionResult> Attendance(long EventId)
        {
            var EventAttendance = await _eventAttendanceService.GetAttendance(EventId);
            return Ok(EventAttendance);
        }
    }
}
