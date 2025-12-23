
using Server.Dtos.Auth;
using Server.Dtos.OfficeAttendance;

public interface IOfficeAttendanceService
{
    public Task<bool> StartForUser(long userId);
    public Task<bool> StopForUser(long userId);
    public Task<bool> GetForUser(long userId);
    public Task<Dictionary<string, List<ReadOfficeAttendance>>> GetGroupForUser(long userId);
}

