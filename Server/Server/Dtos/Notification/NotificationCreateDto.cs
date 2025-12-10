using Server.Enums;
namespace Server.Dtos.Notification
{

    public class NotificationCreateDto
    {
        public long SenderId { get; set; }
        public long? EventId { get; set; }

        // Optionally include receiver IDs if you want to create NotificationReceiver links here
        public List<long>? ReceiverIds { get; set; }
    }
}
