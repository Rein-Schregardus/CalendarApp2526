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
                Start = dto.Start.ToUniversalTime(),
                Duration = dto.Duration,
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
                .Include(e => e.Creator)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (ev == null) return null;

            return MapToReadDto(ev);
        }

        public async Task<IEnumerable<EventReadDto>> GetAllAsync()
        {
            var events = await _dbContext.Events
                .Include(e => e.Location)
                .Include(e => e.Creator)
                .ToListAsync();

            return events.Select(MapToReadDto);
        }

        public async Task<IEnumerable<EventReadDto>?> GetFiltered(string? time, string? title, string? location, string? creator, string? attendee)
        {
            time = time?.ToLower();
            title = title?.ToLower();
            location = location?.ToLower();
            creator = creator?.ToLower();
            attendee = attendee?.ToLower();
            IQueryable<Event> query = _dbContext.Set<Event>();
            //IQueryable<Event> queryRes = query;


            switch (time)
            {
                case null:
                    break;
                case "future":
                    query = query.Where(ev => ev.Start > DateTime.UtcNow);
                    break;
                case "today":
                    // causes issues when server and clients are in different time zones
                    query = query.Where(ev => ev.Start.ToLocalTime().Date == DateTime.Today.Date); 
                    break;
                case "past":
                    query = query.Where(ev => ev.Start < DateTime.UtcNow);
                    break;
                default:
                    break;

            }
            if (title != null)
            {
                query = query.Where(ev => ev.Title.ToLower().Contains(title));
            }
            if (location != null)
            {
                query = query.Where(ev => ev.Location != null && ev.Location!.LocationName.ToLower().Contains(location));
            }
            if (creator != null)
            {
                query = query.Where(ev => ev.Creator != null && ev.Creator.Email.ToLower().Contains(creator));
            }
            if (attendee != null)
            {
                query = query.Where(ev => ev.Attendances != null && ev.Attendances.Any(evat => evat.User.Email.ToLower().Contains(attendee)));
            }
            var events = await query.Include(e => e.Creator).OrderBy(e => e.Start).ToArrayAsync();
            return events.Select(MapToReadDto);

        }

        public async Task<bool> UpdateAsync(long id, EventUpdateDto dto)
        {
            var ev = await _dbContext.Events.FindAsync(id);
            if (ev == null) return false;

            ev.Title = dto.Title;
            ev.Description = dto.Description;
            ev.Start = dto.Start;
            ev.Duration = dto.Duration;
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
                Start = ev.Start,
                Duration = ev.Duration,
                LocationId = ev.LocationId,
                LocationName = ev.Location?.LocationName ?? "No location",
                CreatedBy = ev.Creator?.Email,
                CreatedAt = ev.CreatedAt
            };
        }
    }
}
