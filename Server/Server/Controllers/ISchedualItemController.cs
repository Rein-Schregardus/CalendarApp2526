using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Server.Controllers
{
    /// <summary>
    /// Controller to get events, 
    /// </summary>
    [Authorize]
    public class SchedualItemController: ControllerBase
    {
        //ISchedualItemSerivce _sched;

        //public SchedualItemController (ISchedualItemSerivce sched)
        //{
        //    _sched = sched;
        //}

        //[Route("between/{userId}/{start}/{end}")]
        //public async Task<IActionResult> GetBetweenForUser(
        //    [FromQuery] long userId, 
        //    [FromQuery] DateOnly start, 
        //    [FromQuery] DateOnly end)
        //{
        //    return Ok(await _sched.GetBetweenForUser(userId, start, end));
        //}
    }
}
