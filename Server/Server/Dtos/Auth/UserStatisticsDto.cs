namespace Server.Dtos.Auth
{
    public class UserStatisticsDto
    {
        // general
        public DateTime AccountCreated { get; set; }
        public int YearsOfService { get; set; }
        public bool InOffice { get; set; }

        // events
        public int EventsAttended { get; set; }
        public int EventsCreated { get; set; }
        public int InvitesAccepted { get; set; }
        public int WordsTypedInEventDesciption { get; set; }
        public int BiggestEventAttendedSize { get; set; }
        public string BiggestEventAttendedName { get; set; }

        // reservations
        public int TotalRoomsReserved { get; set; }
        public TimeSpan ReservedTime { get; set; }
        public TimeSpan LongestReservation { get; set; }

        // groups
        public int InGroups { get; set; }
        public int LargestGroupSize { get; set; }
        public string LargestGroupName { get; set; }

        // other

        public int DaysSinceIncident { get; set; } = new Random().Next(0, 10);
    }
}
