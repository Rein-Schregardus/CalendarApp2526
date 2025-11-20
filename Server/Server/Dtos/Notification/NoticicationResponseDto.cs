using Server.Dtos.Event;
using Server.Enums;

namespace Server.Dtos.Notification
{
    public class NotificationResponseDto
    {
        public long Id { get; set; }

        public NotificationSenderDto? Sender { get; set; }

        public EventShortDto? Event { get; set; }

        public DateTime NotifiedAt { get; set; }

        // public List<NotificationReceiverDto> Receivers { get; set; } = new();

        public bool IsRead { get; set; } // for THIS user only
        public NotificationStatus Status { get; set; } // for THIS user only
    }
}
