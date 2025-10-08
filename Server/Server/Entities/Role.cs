using System.ComponentModel.DataAnnotations;

namespace Server.Entities
{
    public class Role
    {
        [Key]
        public long Id { get; set; }
        public required string RoleName { get; set; }

        public ICollection<User> Users { get; set; }
    }
}
