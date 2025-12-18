using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Server.Controllers
{
    [Authorize]
    [Route("officeAttendance")]
    public class OfficeAttendanceController: ControllerBase
    {
        [HttpPost("start")]
        public IActionResult StartSession()
        {

        }

        [HttpPost("stop")]
        public IActionResult StopSession()
        {

        }

        [HttpGet("me")]
        public IActionResult GetMyAttendanceNow()
        {

        }

        [HttpGet("myGroups")]
        public IActionResult GetMyGroups()
        {

        }

        private long GetUserId()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            return long.Parse(userId!);
        }
    }
}
