import type { TUserAttendance } from "@/types/TUserAttendance";
import AttendanceTag from "./AttendanceTag";

type GroupOfficeAttendance = {
  groupHeader: string
  groupAttendance: TUserAttendance[]
}

const GroupOfficeAttendance = ({groupHeader, groupAttendance}: GroupOfficeAttendance) => {
  return (
  <div className="bg-primary rounded-md shadow-md w-70">
    <p className="font-light text-lg text-center w-full border-b-2 border-secondary rounded-t-md mb-2 text-wrap">{groupHeader}</p>
    <ul>
      {
    groupAttendance.sort((u1, u2) => u1.user.fullName < u2.user.fullName? -1: 1).sort(gr => gr.isPresent? -1: 1).map(at =>
      <div className="flex justify-around m-0.5 ">
        <div>
          <p className=" font-semibold w-46 truncate">{at.user.email}</p>
          <p className="text-sm">{at.user.fullName}</p>
        </div>
        <AttendanceTag isPresent={at.isPresent}/>
      </div>
    )
  }
    </ul>
  </div>
  )
}

export default GroupOfficeAttendance;