using Server.Dtos.Event;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Server.Services.Events
{
    public interface IEventService
    {
        Task<EventReadDto> CreateAsync(EventCreateDto dto, long userId);
        Task<EventReadDto?> GetByIdAsync(long id);
        Task<IEnumerable<EventReadDto>> GetAllAsync();
        Task<bool> UpdateAsync(long id, EventUpdateDto dto);
        Task<bool> DeleteAsync(long id);
    }
}
