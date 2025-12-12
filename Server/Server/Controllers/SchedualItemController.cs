using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Server.Controllers
{
    /// <summary>
    /// Controller to get events, 
    /// </summary>
    [Authorize]
    [Route("schedual")]
    public class SchedualItemController: ControllerBase
    {
        ISchedualItemSerivce _sched;

        public SchedualItemController(ISchedualItemSerivce sched)
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
