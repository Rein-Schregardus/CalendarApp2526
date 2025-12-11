using Microsoft.EntityFrameworkCore;
using Server.Db;
using Server.Services.Location;

namespace Server.Services.LocationService
{
    public class LocationService : ILocationService
    {
        private readonly AppDbContext _db;

        public LocationService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<Entities.Location>> GetAllLocations()
        {
            return await _db.Locations.ToListAsync();
        }

        public async Task<Entities.Location?> GetLocationById(long id)
        {
            return await _db.Locations.FindAsync(id);
        }

        public async Task<Entities.Location> CreateLocation(Entities.Location request)
        {
            if (string.IsNullOrWhiteSpace(request.LocationName))
                throw new ArgumentException("Location name cannot be empty.");

            if (request.Capacity <= 0)
                throw new ArgumentException("Capacity must be greater than zero.");

            _db.Locations.Add(request);
            await _db.SaveChangesAsync();

            return request;
        }

        public async Task<bool> UpdateLocation(long id, Entities.Location request)
        {
            var existing = await _db.Locations.FindAsync(id);
            if (existing == null)
                return false;

            if (string.IsNullOrWhiteSpace(request.LocationName))
                throw new ArgumentException("Location name cannot be empty.");

            if (request.Capacity <= 0)
                throw new ArgumentException("Capacity must be greater than zero.");

            existing.LocationName = request.LocationName;
            existing.Capacity = request.Capacity;
            existing.Type = request.Type;

            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteLocation(long id)
        {
            var location = await _db.Locations.FindAsync(id);
            if (location == null)
                return false;

            _db.Locations.Remove(location);
            await _db.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<Entities.Location>> GetAvailable(DateTime? date, TimeSpan? start, TimeSpan? end)
        {
            var query = _db.Locations.Include(l => l.Events).AsQueryable();

            if (date.HasValue && start.HasValue && end.HasValue)
            {
                query = query.Where(l => !l.Events.Any(e =>
                    e.Date.Date == date.Value.Date &&
                    start.Value < e.EndTime &&
                    end.Value > e.StartTime
                ));
            }

            return await query.ToListAsync();
        }

    }
}
