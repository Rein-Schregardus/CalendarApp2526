using Microsoft.EntityFrameworkCore;
using Server.Db;
using Server.DBAccess;
using Server.Dtos.OfficeAttendance;

public class OfficeAttendanceService: IOfficeAttendanceService
{
    private IOfficeAttendanceRepository _officeRepo;

    public OfficeAttendanceService(AppDbContext db)
    {
        _officeRepo = new OfficeAttendanceRepository(db);
    }

    public async Task<bool> GetForUser(long userId)
    {
        return await _officeRepo.GetForUser(userId);
    }

    public async Task<Dictionary<string, List<ReadOfficeAttendance>>> GetGroupForUser(long userId)
    {
        return await _officeRepo.GetGroupForUser(userId);
    }

    public async Task<bool> StartForUser(long userId)
    {
        return await _officeRepo.StartForUser(userId);
    }

    public async Task<bool> StopForUser(long userId)
    {
        return await _officeRepo.StopForUser(userId);
    }
}

