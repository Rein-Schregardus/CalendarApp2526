using System.ComponentModel.DataAnnotations;
using Server.Enums;

namespace Server.Dtos.Locations
{
    public class UpdateLocationDto
    {
        [Required]
        public string LocationName { get; set; } = null!;

        [Required]
        [Range(1, int.MaxValue)]
        public int Capacity { get; set; }

        [Required]
        public LocationType Type { get; set; }
    }
}