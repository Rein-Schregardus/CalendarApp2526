public interface ISchedualItemSerivce
{
    public Task<> GetBetweenForUser(long userId, DateOnly start, DateOnly end);
}

