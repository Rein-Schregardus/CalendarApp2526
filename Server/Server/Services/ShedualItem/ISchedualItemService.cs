public interface ISchedualItemSerivce
{
    public Task<Dictionary<DateOnly, ReadSchedualItem[]>> GetBetweenForUser(long userId, DateTime start, DateTime end);
}

