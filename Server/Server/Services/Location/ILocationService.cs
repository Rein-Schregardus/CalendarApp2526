namespace Server.Services.Location
{
    public interface ILocationService
    {
        Task<IEnumerable<Entities.Location>> GetAllLocations();
        Task<Entities.Location?> GetLocationById(long id);
        Task<Entities.Location> CreateLocation(Entities.Location request);
        Task<bool> UpdateLocation(long id, Entities.Location request);
        Task<bool> DeleteLocation(long id);
        Task<IEnumerable<Entities.Location>> GetAvailable(DateTime? date, TimeSpan? start, TimeSpan? end);
    }
}
