using Microsoft.EntityFrameworkCore;
using Server.Db;
using Server.Dtos.Event;
using Server.Entities;

namespace Server.Services.Events
{
    public class EventService : IEventService
    {
        private readonly AppDbContext _dbContext;

        public EventService(AppDbContext context)
        {
            _dbContext = context;
        }

        public async Task<EventReadDto> CreateAsync(EventCreateDto dto, long userId)
        {
            var entity = new Event
            {
                Title = dto.Title,
                Description = dto.Description,
                Date = dto.Date,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                LocationId = dto.LocationId,
                CreatedBy = userId,
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.Events.Add(entity);
            await _dbContext.SaveChangesAsync();

            return await GetByIdAsync(entity.Id) ?? throw new Exception("Error creating event.");
        }

        public async Task<EventReadDto?> GetByIdAsync(long id)
        {
            var ev = await _dbContext.Events
                .Include(e => e.Location)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (ev == null) return null;

            return MapToReadDto(ev);
        }

        public async Task<IEnumerable<EventReadDto>> GetAllAsync()
        {
            var events = await _dbContext.Events
                .Include(e => e.Location)
                .ToListAsync();

            return events.Select(MapToReadDto);
        }

        public async Task<IEnumerable<EventReadDto>?> GetFiltered(string? time, string? title, string? location, string? creator, string? attendee)
        {
            time = time?.ToLower();
            title = title?.ToLower();
            location = location?.ToLower();
            List<Func<Event, bool>> methodFilter = new();

            switch (time)
            {
                case null:
                    break;
                case "future":
                    methodFilter.Add(ev => ev.Date > DateTime.Now);
                    break;
                case "today":
                    
                    methodFilter.Add(ev => ev.Date.Date == DateTime.Today);
                    break;
                case "past":
                    methodFilter.Add(ev => ev.Date < DateTime.Now);
                    break;
                default:
                    break;

            }
            if (title != null)
            {
                methodFilter.Add(ev => ev.Title.ToLower().Contains(title));
            }
            if (location != null)
            {
                methodFilter.Add(ev => ev.Location != null && ev.Location!.LocationName.ToLower().Contains(location));
            }
            if (creator != null)
            {
                methodFilter.Add(ev => ev.Creator != null && ev.Creator.UserName.ToLower().Contains(creator));
            }
            if (attendee != null)
            {
                return null;
            }
            var events = _dbContext.Events.AsEnumerable().Where(ev => methodFilter.All(filter => filter(ev)));
            return events.Select(MapToReadDto);

        }

        public async Task<bool> UpdateAsync(long id, EventUpdateDto dto)
        {
            var ev = await _dbContext.Events.FindAsync(id);
            if (ev == null) return false;

            ev.Title = dto.Title;
            ev.Description = dto.Description;
            ev.Date = dto.Date;
            ev.StartTime = dto.StartTime;
            ev.EndTime = dto.EndTime;
            ev.LocationId = dto.LocationId;

            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(long id)
        {
            var ev = await _dbContext.Events.FindAsync(id);
            if (ev == null) return false;

            _dbContext.Events.Remove(ev);
            await _dbContext.SaveChangesAsync();
            return true;
        }
        private static EventReadDto MapToReadDto(Event ev)
        {
            return new EventReadDto
            {
                Id = ev.Id,
                Title = ev.Title,
                Description = ev.Description,
                Date = ev.Date,
                StartTime = ev.StartTime,
                EndTime = ev.EndTime,
                LocationId = ev.LocationId,
                LocationName = ev.Location?.LocationName ?? "No location",
                CreatedBy = ev.CreatedBy,
                CreatedAt = ev.CreatedAt
            };
        }
    }
}
