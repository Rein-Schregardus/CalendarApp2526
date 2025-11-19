using Server.Dtos.Event;

namespace Server.Services.EventAttendances
{
    public interface IEventAttendanceService
    {

        Task<EventAttendanceDto?> UserAttendEvent(long userId, long eventId);

        Task<EventAttendanceDto?> UserUnattendEvent(long userId, long eventId);

        Task<EventAttendanceDto?> GetAttendance(long eventId);
    }
}
