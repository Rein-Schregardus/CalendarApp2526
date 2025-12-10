using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Server.Entities
{
    [PrimaryKey(nameof(UserId), nameof(GroupId))]
    public class UserGroup
    {
        public long UserId { get; set; }
        public User User { get; set; } = null!;

        public long GroupId { get; set; }
        public Group Group { get; set; } = null!;
    }
}