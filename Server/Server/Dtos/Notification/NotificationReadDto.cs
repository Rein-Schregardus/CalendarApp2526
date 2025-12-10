namespace Server.Dtos.Notification
{

    public class NotificationReadDto
    {
        public long? SenderId { get; set; }
        public long? EventId { get; set; }

        public List<long>? ReceiverIds { get; set; }
        public Entities.Event? Event { get; set; }
        public DateTime NotifiedAt { get; set; }
        public bool isRead { get; set; }
    }
}
