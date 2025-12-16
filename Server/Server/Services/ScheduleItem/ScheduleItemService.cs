using Microsoft.EntityFrameworkCore;
using Server.Db;
using Server.Dtos.Event;
using Server.Entities;
using Server.Dtos.RoomReservation;

public class ScheduleItemService: ISchedualItemSerivce
{
    private AppDbContext _db;

    public ScheduleItemService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Dictionary<DateOnly, ReadScheduleItem[]>> GetBetweenForUser(long userId, DateTime start, DateTime end)
    {
        start = start.ToUniversalTime();
        end = end.ToUniversalTime();
        var SchedualedEvents = await _db.Events
            .Where(
                ev => ev.Start >= start && 
                ev.Start <= end && 
                (ev.Attendances.Any(u => u.UserId == userId) || ev.Creator.Id == userId)
            )
            .Select(ev => new ReadScheduleItem()
            {
                Id = ev.Id,
                Title = ev.Title,
                Start = ev.Start,
                Duration = ev.Duration,
                Type = Server.Enums.SchedualItemType.Event,
                Payload = new EventReadDto() { 
                    Id = ev.Id,
                    Title = ev.Title,
                    Description = ev.Description,
                    Start = ev.Start,
                    Duration = ev.Duration,
                    LocationId = ev.LocationId,
                    LocationName = ev.Location.LocationName,
                    CreatedBy = ev.Creator.Email,
                    CreatedAt = ev.CreatedAt
                }
            })
            .ToListAsync();

        SchedualedEvents.AddRange(await _db.Reservations
            .Where(
                re => re.Start >= start &&
                re.Start <= end &&
                (re.UserId == userId)
            )
            .Select(re => new ReadScheduleItem()
            {
                Id = re.Id,
                Start = re.Start,
                Title = $"{re.Room.LocationName}: Reservation",
                Duration = re.Duration,
                Type = Server.Enums.SchedualItemType.RoomReservation,
                Payload = new ReadExtensiveReservationDto()
                {
                    Id = re.Id,
                    Start = re.Start,
                    Duration = re.Duration,
                    CreatorId = re.UserId,
                    CreatorMail = re.User.Email,
                    LocationId = re.RoomId,
                    LocationName = re.Room.LocationName,
                }

            })
            .ToListAsync()
            );

        var SchedualDict = SchedualedEvents
            .GroupBy(item => DateOnly.FromDateTime(item.Start))
            .ToDictionary(gr => gr.Key, g => g.ToArray());

        return SchedualDict;
    }
}