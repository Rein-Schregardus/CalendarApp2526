using Microsoft.EntityFrameworkCore;
using Server.Db;
using Server.DBAccess;
using Server.Dtos.Auth;
using Server.Dtos.OfficeAttendance;
using Server.Entities;

namespace Server.DBAccess
{
    public class OfficeAttendanceRepository: IOfficeAttendanceRepository
    {
        private AppDbContext _db;
        public OfficeAttendanceRepository(AppDbContext db) 
        { 
            _db = db; 
        }

        public async Task<bool> StartForUser(long userId)
        {
            var attendance = _db.OfficeAttendances.FirstOrDefault(at => at.UserId == userId);
            if (attendance == null)
            {
                await _db.OfficeAttendances.AddAsync(new OfficeAttendance() { UserId = userId, IsPresent = true });
            }
            else
            {
                attendance.IsPresent = true;
            }
            await _db.SaveChangesAsync();
            return true;
        }


        public async Task<bool> StopForUser(long userId)
        {
            var attendance = _db.OfficeAttendances.FirstOrDefault(at => at.UserId == userId);
            if (attendance == null)
            {
                await _db.OfficeAttendances.AddAsync(new OfficeAttendance() { UserId = userId, IsPresent = false });
            }
            else
            {
                attendance.IsPresent = false;
            }
            await _db.SaveChangesAsync();
            return false;
        }

        public async Task<bool> GetForUser(long userId)
        {
            var attendance = _db.OfficeAttendances.FirstOrDefault(at => at.UserId == userId);
            if (attendance == null)
            {
                await _db.OfficeAttendances.AddAsync(new OfficeAttendance() { UserId = userId, IsPresent = false });
                await _db.SaveChangesAsync();
                return false;
            }
            return attendance.IsPresent;
        }

        /// <summary>
        /// Gets a dictionary with group name as the key and a list of userinfodto's as the value. 
        /// This represents all groups the userId is part of and then the attendance of all users in those groups.
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<Dictionary<string, List<ReadOfficeAttendance>>> GetGroupForUser(long userId)
        {
            var groupAttendances = await _db.Groups
                .Where(gr => gr.UserGroups.Any(us => us.UserId == userId))
                .SelectMany(gr => gr.UserGroups
                    .Where(us => us.UserId != userId)
                    .Select(us => new // create a anonymous type to include groupname
                    {
                        IsPresent = _db.OfficeAttendances // null check must be preformed
                            .FirstOrDefault(u => u.UserId == us.UserId) == null ? false : _db.OfficeAttendances.FirstOrDefault(u => u.UserId == us.UserId)!.IsPresent,
                        User = new UserInfoDto()
                        {
                            Id = us.Id,
                            Email = us.User.Email,
                            FullName = us.User.FullName,
                            Role = us.User.Role.RoleName!,
                        },
                        GroupName = us.Group.GroupName
                    }))
                .GroupBy(u => u.GroupName)
                .ToArrayAsync();

            Dictionary<string, List<ReadOfficeAttendance>> userGroups = new();
            foreach (var group in groupAttendances)
            {
                userGroups.Add(group.Key, new List<ReadOfficeAttendance>());
                foreach (var item in group)
                {
                    userGroups[group.Key].Add(new ReadOfficeAttendance()
                    {
                        IsPresent = item.IsPresent,
                        User = item.User,
                    });

                }
            }
            return userGroups;
        }
    }
}
