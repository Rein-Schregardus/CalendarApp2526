using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Entities
{
    public class NotificationReceiver
    {
        [Key]
        public long Id { get; set; }

        // FK to User
        [Required]
        public long UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public User User { get; set; } = null!;

        // FK to Notification
        [Required]
        public long NotificationId { get; set; }
        [ForeignKey(nameof(NotificationId))]
        public Notification Notification { get; set; } = null!;

        // Per-user read status
        public bool IsRead { get; set; } = false;
    }
}
