using Server.Dtos.Auth;

namespace Server.DBAccess
{
    public interface IAuthRepository
    {
        Task<UserStatisticsDto> GetStatistics(long userId);

    }
}
