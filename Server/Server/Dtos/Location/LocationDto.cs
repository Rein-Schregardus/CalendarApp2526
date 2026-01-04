using Server.Enums;

namespace Server.Dtos.Locations
{
    public class LocationDto
    {
        public long Id { get; set; }
        public string LocationName { get; set; } = null!;
        public int Capacity { get; set; }
        public LocationType Type { get; set; }
    }
}
