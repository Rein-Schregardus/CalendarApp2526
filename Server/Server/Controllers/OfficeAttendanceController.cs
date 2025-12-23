using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Server.Controllers
{
    [Authorize]
    [Route("officeAttendance")]
    public class OfficeAttendanceController: ControllerBase
    {
        private IOfficeAttendanceService _attendanceService;
        public OfficeAttendanceController(IOfficeAttendanceService attendanceService)
        {
            _attendanceService = attendanceService;
        }

        [HttpPost("start")]
        public async Task<IActionResult> StartSession()
        {
            bool isPresent = await _attendanceService.StartForUser(GetUserId());
            return Ok(isPresent);
        }

        [HttpPost("stop")]
        public async Task<IActionResult> StopSession()
        {
            bool isPresent = await _attendanceService.StopForUser(GetUserId());
            return Ok(isPresent);
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMyAttendanceNow()
        {
            bool isPresent = await _attendanceService.GetForUser(GetUserId());
            return Ok(isPresent);
        }

        [HttpGet("myGroups")]
        public async Task<IActionResult> GetMyGroups()
        {
            var myGroupAttendances = await _attendanceService.GetGroupForUser(GetUserId());
            return Ok(myGroupAttendances);
        }

        private long GetUserId()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            return long.Parse(userId!);
        }
    }
}
