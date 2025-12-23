using Microsoft.EntityFrameworkCore;
using Server.Db;
using Server.Dtos.Auth;

namespace Server.DBAccess
{
    public class AuthRepository : IAuthRepository
    {
        private readonly AppDbContext _db;
        private readonly IOfficeAttendanceRepository _officeAttendanceRepository;

        public AuthRepository(AppDbContext db)
        {
            _db = db;
            _officeAttendanceRepository = new OfficeAttendanceRepository(db);
        }

        public async Task<UserStatisticsDto> GetStatistics(long userId)
        {
            char[] delimiterChars = [' ', ',', '.', ':', '\t', '\n'];

            // general
            var AccountCreated = (await _db.Users.FindAsync(userId)).CreatedAt;
            var YearsOfService = (int)(await _db.Users.FindAsync(userId)).CreatedAt.Subtract(DateTime.UtcNow).TotalDays / 365;
                var InOffice = await _officeAttendanceRepository.GetForUser(userId);

            // events
            var EventsAttended = await _db.EventAttendances.Where(evat => evat.UserId == userId).CountAsync();
            var EventsCreated = await _db.Events.Where(ev => ev.Creator.Id == userId).CountAsync();
            var InvitesAccepted = await _db.NotificationReceivers.Where(nr => nr.Status == Enums.NotificationStatus.Accepted).CountAsync();
            var WordsTypedInEventDesciption =  _db.Events.Where(ev => ev.CreatedBy == userId).AsEnumerable().SelectMany(ev => ev.Description.Split(delimiterChars)).Count();
            int BiggestEventAttendedSize = await _db.EventAttendances.Where(ea => ea.UserId == userId).Select(ea => ea.Event).Distinct().DefaultIfEmpty().MaxAsync(ev => ev.Attendances.Count());
            string BiggestEventAttendedName = (await _db.EventAttendances.Where(ea => ea.UserId == userId).Select(ea => ea.Event).OrderByDescending(e => e.Attendances.Count()).FirstOrDefaultAsync())?.Title ?? "";

            // reservations
            var TotalRoomsReserved = await _db.Reservations.Where(re => re.UserId == userId).CountAsync();
            var ReservedTime = new TimeSpan(0, await _db.Reservations.Where(re => re.UserId == userId).Select(re => re.Duration).SumAsync(), 0);
            var LongestReservation = new TimeSpan(0, await _db.Reservations.Where(re => re.UserId == userId).Select(re => re.Duration).DefaultIfEmpty().MaxAsync(), 0);

            // groups
            var InGroups = await _db.Groups.Where(gr => gr.UserGroups.Any(ug => ug.UserId == userId)).CountAsync();
            int LargestGroupSize = await _db.Groups.Where(gr => gr.UserGroups.Any(ug => ug.UserId == userId)).Select(gr => gr.UserGroups.Count()).DefaultIfEmpty().MaxAsync();
            string LargestGroupName = (await _db.Groups.Where(gr => gr.UserGroups.Any(ug => ug.UserId == userId)).OrderByDescending(g => g.UserGroups.Count()).FirstOrDefaultAsync())?.GroupName ?? "";

            return new UserStatisticsDto()
            {
                AccountCreated = AccountCreated,
                YearsOfService = YearsOfService,
                InOffice = InOffice,
                EventsCreated = EventsCreated,
                EventsAttended = EventsAttended,
                InvitesAccepted = InvitesAccepted,
                WordsTypedInEventDesciption = WordsTypedInEventDesciption,
                BiggestEventAttendedName = BiggestEventAttendedName,
                BiggestEventAttendedSize = BiggestEventAttendedSize,
                TotalRoomsReserved = TotalRoomsReserved,
                ReservedTime    = ReservedTime,
                LongestReservation = LongestReservation,
                InGroups = InGroups,
                LargestGroupName = LargestGroupName,
                LargestGroupSize = LargestGroupSize,
            };
        }
    }
}
