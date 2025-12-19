import type { TUser } from "@/types/TUser";
import type { TUserAttendance } from "@/types/TUserAttendance";

type GroupOfficeAttendance = {
  groupHeader: string
  groupAttendance: TUserAttendance[]
}

const GroupOfficeAttendance = ({groupHeader, groupAttendance}: GroupOfficeAttendance) => {
  return (
  <div className="bg-primary rounded-md shadow-md w-50">
    <p className="font-light text-lg text-center w-full border-b-2 border-secondary rounded-t-md mb-2 text-wrap">{groupHeader}</p>
    <ul>
      {
    groupAttendance.sort((u1, u2) => u1.user.fullName < u2.user.fullName? -1: 1).sort(gr => gr.isPresent? -1: 1).map(at =>
      <div className="flex justify-around m-0.5 font-semibold">
        <p className="w-20 truncate">{at.user.email}</p>
        <p className=" rounded-md w-18 p-1 text-center text-primary" style={{backgroundColor: at.isPresent?"#65943b": "oklch(47% 0.157 37.304)"}}>{at.isPresent? "present" : "absent"}</p>
      </div>
    )
  }
    </ul>
  </div>
  )
}

export default GroupOfficeAttendance;