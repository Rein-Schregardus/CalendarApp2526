using Microsoft.EntityFrameworkCore;
using Server.Db;
using Server.Dtos.Event;
using Server.Entities;

namespace Server.Services.EventAttendances
{
    public class EventAttendanceService : IEventAttendanceService
    {
        private readonly AppDbContext _db;

        public EventAttendanceService(AppDbContext context)
        {
            _db = context;
        }


        public async Task<EventAttendanceDto?> UserAttendEvent(long userId, long eventId)
        {
            if (_db.EventAttendances.Any(ea => ea.UserId == userId && ea.EventId == eventId))
                return null;
            EventAttendance EventAttendance = new EventAttendance() { UserId = userId, EventId = eventId, RegisteredAt = DateTime.UtcNow};
            var returned = await _db.EventAttendances.AddAsync(EventAttendance);
            await _db.SaveChangesAsync();
            return await GetAttendance(eventId);

        }

        public async Task<EventAttendanceDto?> UserUnattendEvent(long UserId, long eventId)
        {
            EventAttendance? eventattendance = await _db.EventAttendances.FirstOrDefaultAsync(EventAttendance => EventAttendance.UserId == UserId && EventAttendance.EventId == eventId);
            if (eventattendance == null) return await GetAttendance(eventId);
            _db.EventAttendances.Remove(eventattendance);
            await _db.SaveChangesAsync();
            return await GetAttendance(eventId);
        }

        public async Task<EventAttendanceDto?> GetAttendance(long eventId)
        {
            EventAttendanceDto? eventAttendance = await _db.Events
                .Where(e => e.Id == eventId)
                .Select(e => new EventAttendanceDto() { EventId = e.Id, Attendees = e.Attendances.Select(at => at.User.Email).ToArray()})
                .FirstOrDefaultAsync();
            return eventAttendance;
        }
    }
}
