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
        public async Task<IActionResult> Send([FromBody] NotificationCreateDto dto)
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

        [HttpGet("user/{userId:long}")]
        public async Task<IActionResult> GetAllForUser(long userId)
        {
            var notifications = await _context.NotificationReceivers
                .Where(nr => nr.UserId == userId)
                .Include(nr => nr.Notification)
                    .ThenInclude(n => n.Sender)
                .Include(nr => nr.Notification)
                    .ThenInclude(n => n.Event)
                .Include(nr => nr.Notification)
                    .ThenInclude(n => n.Receivers)
                        .ThenInclude(r => r.User)
                .OrderByDescending(nr => nr.Notification.NotifiedAt)
                .ToListAsync();

            var response = notifications.Select(nr => new NotificationResponseDto
            {
                Id = nr.NotificationId,

                Sender = nr.Notification.Sender != null
                    ? new NotificationSenderDto
                    {
                        Id = nr.Notification.Sender.Id,
                        FullName = nr.Notification.Sender.FullName,
                        UserName = nr.Notification.Sender.UserName
                    }
                    : null,

                Event = nr.Notification.Event != null
                    ? new EventShortDto
                    {
                        Id = nr.Notification.Event.Id,
                        Title = nr.Notification.Event.Title,
                        Date = nr.Notification.Event.Date,
                        StartTime = nr.Notification.Event.StartTime,
                        EndTime = nr.Notification.Event.EndTime
                    }
                    : null,

                NotifiedAt = nr.Notification.NotifiedAt,

                // Respond with all Receivers as well?

                // Receivers = nr.Notification.Receivers.Select(r => new NotificationReceiverDto
                // {
                //     UserId = r.UserId,
                //     FullName = r.User.FullName,
                //     UserName = r.User.UserName,
                //     IsRead = r.IsRead,
                //     Status = r.Status
                // }).ToList(),

                IsRead = nr.IsRead,
                Status = nr.Status
            });

            return Ok(response);
        }


        [HttpGet("{notificationId:long}/user/{userId:long}")]
        public async Task<IActionResult> GetForUser(long notificationId, long userId)
        {
            var nr = await _context.NotificationReceivers
                .Where(r => r.NotificationId == notificationId && r.UserId == userId)
                .Include(r => r.Notification)
                    .ThenInclude(n => n.Sender)
                .Include(r => r.Notification)
                    .ThenInclude(n => n.Event)
                .Include(r => r.Notification)
                    .ThenInclude(n => n.Receivers)
                        .ThenInclude(x => x.User)
                .SingleOrDefaultAsync();

            if (nr == null)
                return NotFound("Notification not found for this user.");

            var response = new NotificationResponseDto
            {
                Id = nr.NotificationId,

                Sender = nr.Notification.Sender != null
                    ? new NotificationSenderDto
                    {
                        Id = nr.Notification.Sender.Id,
                        FullName = nr.Notification.Sender.FullName,
                        UserName = nr.Notification.Sender.UserName
                    }
                    : null,

                Event = nr.Notification.Event != null
                    ? new EventShortDto
                    {
                        Id = nr.Notification.Event.Id,
                        Title = nr.Notification.Event.Title,
                        Date = nr.Notification.Event.Date,
                        StartTime = nr.Notification.Event.StartTime,
                        EndTime = nr.Notification.Event.EndTime
                    }
                    : null,

                NotifiedAt = nr.Notification.NotifiedAt,

                // Respond with all Receivers as well?

                // Receivers = nr.Notification.Receivers.Select(r => new NotificationReceiverDto
                // {
                //     UserId = r.UserId,
                //     FullName = r.User.FullName,
                //     UserName = r.User.UserName,
                //     IsRead = r.IsRead,
                //     Status = r.Status
                // }).ToList(),

                IsRead = nr.IsRead,
                Status = nr.Status
            };

            return Ok(response);
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
