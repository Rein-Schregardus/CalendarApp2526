using Server.Dtos.OfficeAttendance;

namespace Server.DBAccess
{
    public interface IOfficeAttendanceRepository
    {
        public Task<bool> StartForUser(long userId);
        public Task<bool> StopForUser(long userId);
        public Task<bool> GetForUser(long userId);
        public Task<Dictionary<string, List<ReadOfficeAttendance>>> GetGroupForUser(long userId);
    }
}
