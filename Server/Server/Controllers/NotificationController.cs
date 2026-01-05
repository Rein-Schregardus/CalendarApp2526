using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Dtos.Notification;
using Server.Db;
using Server.Entities;
using Server.Enums;
using Server.Services.EventAttendances;

namespace Server.Controllers
{
    /// <summary>
    /// Handles Notifications and Event Invites
    /// </summary>
    [ApiController]
    [Route("notifications")]
    [Produces("application/json")]
    public class NotificationController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IEventAttendanceService _eventAttendanceService;

        public NotificationController(
            AppDbContext context,
            IEventAttendanceService eventAttendanceService
        )
        {
            _context = context;
            _eventAttendanceService = eventAttendanceService;
        }

        // -------------------------
        // Send notification
        // -------------------------
        [HttpPost]
        [HttpPost]
        public async Task<IActionResult> Send([FromBody] NotificationCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Validate sender
            var senderExists = await _context.Users.AnyAsync(u => u.Id == dto.SenderId);
            if (!senderExists)
                return BadRequest($"Sender with id {dto.SenderId} does not exist.");

            // Validate receivers
            if (dto.ReceiverIds == null || dto.ReceiverIds.Count == 0)
                return ValidationProblem("ReceiverIds must contain at least one value.");

            var receivers = await _context.Users
                .Where(u => dto.ReceiverIds.Contains(u.Id))
                .Select(u => new { u.Id, u.UserName })
                .ToListAsync();

            if (receivers.Count != dto.ReceiverIds.Count)
                return BadRequest("Some receivers do not exist.");

            // Optional event
            Event? linkedEvent = null;
            if (dto.EventId.HasValue)
            {
                linkedEvent = await _context.Events
                    .SingleOrDefaultAsync(e => e.Id == dto.EventId.Value);

                if (linkedEvent == null)
                    return BadRequest($"No event found with id {dto.EventId.Value}");

                // CHECK FOR EXISTING INVITES
                var alreadyInvited = await _context.NotificationReceivers
                    .Where(nr =>
                        nr.Notification.EventId == dto.EventId.Value &&
                        dto.ReceiverIds.Contains(nr.UserId))
                    .Select(nr => new
                    {
                        nr.UserId,
                        nr.User.UserName,
                        nr.Status
                    })
                    .Distinct()
                    .ToListAsync();

                if (alreadyInvited.Any())
                {
                    return BadRequest(new
                    {
                        Message = "One or more users already have an invite for this event.",
                        Conflicts = alreadyInvited.Select(u => new
                        {
                            UserId = u.UserId,
                            UserName = u.UserName,
                            Status = u.Status.ToString()
                        })
                    });
                }
            }

            // Create notification
            var notification = new Notification
            {
                SenderId = dto.SenderId,
                EventId = linkedEvent?.Id,
                Event = linkedEvent,
                Receivers = dto.ReceiverIds.Select(uid => new NotificationReceiver
                {
                    UserId = uid,
                    IsRead = false,
                    Status = NotificationStatus.Sent
                }).ToList()
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            return Ok(new { NotificationId = notification.Id });
        }


        // -------------------------
        // Get notifications for user
        // -------------------------
        [HttpGet("user/{userId:long}")]
        public async Task<IActionResult> GetAllForUser(long userId)
        {
            var notifications = await _context.NotificationReceivers
                .Where(nr => nr.UserId == userId)
                .Include(nr => nr.Notification)
                    .ThenInclude(n => n.Sender)
                .Include(nr => nr.Notification)
                    .ThenInclude(n => n.Event)
                .OrderByDescending(nr => nr.Notification.NotifiedAt)
                .ToListAsync();

            var response = notifications.Select(nr => MapNotification(nr));

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
                .SingleOrDefaultAsync();

            if (nr == null)
                return NotFound("Notification not found for this user.");

            return Ok(MapNotification(nr));
        }

        // -------------------------
        // Mark notification as read
        // -------------------------
        [HttpPut("{notificationId:long}/user/{userId:long}/read")]
        public async Task<IActionResult> MarkAsRead(long notificationId, long userId)
        {
            var entry = await _context.NotificationReceivers
                .SingleOrDefaultAsync(r => r.NotificationId == notificationId && r.UserId == userId);

            if (entry == null)
                return NotFound();

            entry.IsRead = true;
            await _context.SaveChangesAsync();

            return Ok();
        }

        // -------------------------
        // Accept an event invite
        // -------------------------
        [HttpPut("{notificationId:long}/user/{userId:long}/accept")]
        public async Task<IActionResult> AcceptInvite(long notificationId, long userId)
        {
            var receiver = await _context.NotificationReceivers
                .Include(r => r.Notification)
                .SingleOrDefaultAsync(r =>
                    r.NotificationId == notificationId &&
                    r.UserId == userId);

            if (receiver == null)
                return NotFound();

            if (receiver.Notification.EventId == null)
                return BadRequest("This notification is not an event invite.");

            if (receiver.Status != NotificationStatus.Sent)
                return BadRequest("Invite already answered.");

            // Mark as accepted
            receiver.Status = NotificationStatus.Accepted;
            receiver.IsRead = true;

            // Add user to event using existing attendance service
            await _eventAttendanceService.UserAttendEvent(
                userId,
                receiver.Notification.EventId.Value
            );

            await _context.SaveChangesAsync();
            return Ok();
        }

        // -------------------------
        // Decline an event invite
        // -------------------------
        [HttpPut("{notificationId:long}/user/{userId:long}/decline")]
        public async Task<IActionResult> DeclineInvite(long notificationId, long userId)
        {
            var receiver = await _context.NotificationReceivers
                .SingleOrDefaultAsync(r =>
                    r.NotificationId == notificationId &&
                    r.UserId == userId);

            if (receiver == null)
                return NotFound();

            if (receiver.Status != NotificationStatus.Sent)
                return BadRequest("Invite already answered.");

            receiver.Status = NotificationStatus.Declined;
            receiver.IsRead = true;

            await _context.SaveChangesAsync();
            return Ok();
        }

        // -------------------------
        // Map notification for frontend
        // -------------------------
        private static NotificationResponseDto MapNotification(NotificationReceiver nr)
        {
            return new NotificationResponseDto
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
                        Date = nr.Notification.Event.Start,
                        StartTime = nr.Notification.Event.Start.TimeOfDay,
                        EndTime = nr.Notification.Event.Start.AddMinutes(nr.Notification.Event.Duration).TimeOfDay
                    }
                    : null,

                NotifiedAt = nr.Notification.NotifiedAt,
                IsRead = nr.IsRead,
                Status = nr.Status
            };
        }
    }
}
