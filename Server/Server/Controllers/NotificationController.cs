using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Dtos.Notification;
using Server.Db;
using Server.Entities;
using Server.Enums;
using Microsoft.AspNetCore.Mvc.ActionConstraints;

namespace Server.Controllers
{
    /// <summary>
    /// Handles Notifications
    /// Provides endpoints for ...
    /// </summary>
    [ApiController]
    [Route("notifications")]
    [Produces("application/json")]
    public class NotificationController : ControllerBase
    {

        private readonly AppDbContext _context;

        public NotificationController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Send([FromBody] NotificationSendDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (dto.ReceiverIds == null || dto.ReceiverIds.Count == 0)
                return ValidationProblem("ReceiverIds must contain at least one value.");

            var validCount = await _context.Users.CountAsync(u => dto.ReceiverIds.Contains(u.Id));
            if (validCount != dto.ReceiverIds.Count)
                return BadRequest("Some receivers do not exist.");

            if (dto.EventId.HasValue)
            {
                var eventExists = await _context.Events
                    .AnyAsync(e => e.Id == dto.EventId.Value);

                if (!eventExists)
                    return BadRequest($"No event found with id {dto.EventId.Value}");
            }

            var notification = new Notification
            {
                SenderId = dto.SenderId,
                EventId = dto.EventId,
                Status = NotificationStatus.Sent,
                Receivers = dto.ReceiverIds.Select(uid => new NotificationReceiver
                {
                    UserId = uid,
                    IsRead = false
                }).ToList()
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            return Ok(new { NotificationId = notification.Id });
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetAllForUser()
        {
            return Ok();
        }
        
        [HttpGet("{notificationId:long}/user/{userId}")]
        public async Task<IActionResult> GetForUser()
        {
            return Ok();
        }

        [HttpPut("{notificationId:long}/user/{userId:long}/read")]
        public async Task<IActionResult> MarkAsRead(long notificationId, long userId)
        {
            var entry = await _context.NotificationReceivers.SingleOrDefaultAsync(r => r.NotificationId == notificationId && r.UserId == userId);

            if (entry == null)
                return NotFound();

            entry.IsRead = true;
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
