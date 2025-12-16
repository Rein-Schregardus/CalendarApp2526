using Microsoft.EntityFrameworkCore;
using Server.Db;
using Server.Entities;

public class SchedualItemService: ISchedualItemSerivce
{
    private AppDbContext _db;

    public SchedualItemService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Dictionary<DateOnly, ReadSchedualItem[]>> GetBetweenForUser(long userId, DateTime start, DateTime end)
    {
        start = start.ToUniversalTime();
        end = end.ToUniversalTime();
        var SchedualedEvents = await _db.Events
            .Where(
                ev => ev.Start >= start && 
                ev.Start <= end && 
                (ev.Attendances.Any(u => u.UserId == userId) || ev.Creator.Id == userId)
            )
            .Select(ev => new ReadSchedualItem()
            {
                Id = ev.Id,
                Title = ev.Title,
                Start = ev.Start,
                Duration = ev.Duration,
                Type = Server.Enums.SchedualItemType.Event
            })
            .ToListAsync();

        SchedualedEvents.AddRange(await _db.Reservations
            .Where(
                re => re.Start >= start &&
                re.Start <= end &&
                (re.UserId == userId)
            )
            .Select(re => new ReadSchedualItem()
            {
                Id = re.Id,
                Start = re.Start,
                Title = $"Reservation for {re.RoomId}",
                Duration = re.Duration,
                Type = Server.Enums.SchedualItemType.RoomReservation

            })
            .ToListAsync()
            );

        var SchedualDict = SchedualedEvents
            .GroupBy(item => DateOnly.FromDateTime(item.Start))
            .ToDictionary(gr => gr.Key, g => g.ToArray());

        return SchedualDict;
    }
}

