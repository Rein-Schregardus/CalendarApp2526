using Server.Dtos.Auth;

namespace Server.Dtos.OfficeAttendance
{
    public class ReadOfficeAttendance
    {
        public bool IsPresent { get; set; }
        public UserInfoDto User { get; set; }
    }
}
