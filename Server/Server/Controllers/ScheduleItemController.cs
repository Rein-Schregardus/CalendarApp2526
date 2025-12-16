using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Server.Controllers
{
    /// <summary>
    /// Controller to get events, 
    /// </summary>
    [Authorize]
    [Route("schedule")]
    public class ScheduleItemController: ControllerBase
    {
        IScheduleItemSerivce _sched;

        public ScheduleItemController(IScheduleItemSerivce sched)
        {
            _sched = sched;
        }

        [Route("between/{userId}/{start}/{end}")]
        public async Task<IActionResult> GetBetweenForUser(
             long userId,
             DateTime start,
             DateTime end)
        {
            return Ok(await _sched.GetBetweenForUser(userId, start, end));
        }
    }
}
