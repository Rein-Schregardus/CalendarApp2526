using Server.Enums;
namespace Server.Dtos.Notification
{
 
    public class NotificationReadDto
    {
        public long? SenderId { get; set; }
        public long? EventId { get; set; }

        public List<long>? ReceiverIds { get; set; }
    }
}
