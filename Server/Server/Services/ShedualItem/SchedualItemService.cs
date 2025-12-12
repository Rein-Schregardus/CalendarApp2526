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
            .Where(ev => ev.Start >= start && ev.Start <= end)
            .Select(ev => new ReadSchedualItem()
            {
                Id = ev.Id,
                Title = ev.Title,
                Color = "green-300",
                Start = ev.Start,
                Duration = ev.Duration,
                Type = Server.Enums.SchedualItemType.Event
            })
            .ToListAsync();

        var SchedualDict = SchedualedEvents
            .GroupBy(item => DateOnly.FromDateTime(item.Start))
            .ToDictionary(gr => gr.Key, g => g.ToArray());

        return SchedualDict;
    }

    public ReadSchedualItem EventToSchedualItem(Event ev)
    {
        var item = new ReadSchedualItem()
        {
            Id = ev.Id,
            Title = ev.Title,
            Color = "green-300",
            Start = ev.Start,
            Duration = ev.Duration,
            Type = Server.Enums.SchedualItemType.Event
        };
        return item;
    }
}

