public interface ISchedualItemSerivce
{
    public Task<Dictionary<DateOnly, ReadScheduleItem[]>> GetBetweenForUser(long userId, DateTime start, DateTime end);
}

