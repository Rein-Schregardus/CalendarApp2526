public interface IScheduleItemSerivce
{
    public Task<Dictionary<DateOnly, ReadScheduleItem[]>> GetBetweenForUser(long userId, DateTime start, DateTime end);
}

