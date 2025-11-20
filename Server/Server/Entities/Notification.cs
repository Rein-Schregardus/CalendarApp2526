using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Entities
{
    public class Notification
    {
        [Key]
        public long Id { get; set; }

        // The user who triggered/sent the notification
        public long? SenderId { get; set; }
        [ForeignKey(nameof(SenderId))]
        public User? Sender { get; set; }

        // The event related to this notification (optional)
        public long? EventId { get; set; }
        [ForeignKey(nameof(EventId))]
        public Event? Event { get; set; }

        [Required]
        public DateTime NotifiedAt { get; set; } = DateTime.UtcNow;

        // Notification Receivers Table
        public ICollection<NotificationReceiver> Receivers { get; set; } = new List<NotificationReceiver>();
    }
}
