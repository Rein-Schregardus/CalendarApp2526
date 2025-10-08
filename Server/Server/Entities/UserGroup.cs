using System.ComponentModel.DataAnnotations;

namespace Server.Entities
{
    public class UserGroup
    {
        [Key]
        public required long Id { get; set; }

        public required long UserId { get; set; }
        public User User { get; set; }

        public required long GroupId { get; set; }
        public Group Group { get; set; }
    }
}