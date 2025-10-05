using System.ComponentModel.DataAnnotations;

namespace Server.Entities
{
    public class Group
    {
        [Key]
        public required long Id { get; set; }
        public required string GroupName { get; set; }

        public ICollection<UserGroup> UserGroups { get; set; }
    }
}