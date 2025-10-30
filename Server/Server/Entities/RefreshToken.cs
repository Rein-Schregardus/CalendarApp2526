using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Entities
{
    public class RefreshToken
    {
        [Key]
        public long Id { get; set; }

        [Required]
        public string Token { get; set; } = string.Empty;

        public DateTime ExpiresAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsRevoked { get; set; } = false;

        [Required]
        public long UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public User User { get; set; } = null!;
    }
}
