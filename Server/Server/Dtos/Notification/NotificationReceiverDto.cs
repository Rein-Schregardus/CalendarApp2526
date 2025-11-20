using Server.Enums;

namespace Server.Dtos.Notification
{
    public class NotificationReceiverDto
    {
        public long UserId { get; set; }
        public string FullName { get; set; } = "";
        public string UserName { get; set; } = "";
        public bool IsRead { get; set; }
        public NotificationStatus Status { get; set; }
    }
}
