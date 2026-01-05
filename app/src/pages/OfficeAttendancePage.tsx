import NavSideBar from "@/components/NavSideBar";
import GroupOfficeAttendance from "@/components/OfficeAttendance/GroupOfficeAttendance";
import SetAttendance from "@/components/OfficeAttendance/SetAttendance";
import type { TUserAttendance } from "@/types/TUserAttendance";
import { useEffect, useState } from "react";

  const fetchGroupAttendance = async() => {

    const response = await fetch(`http://localhost:5005/officeAttendance/myGroups`, { credentials: "include" });

    const body = await response.json();
    const mapped: Map<string, TUserAttendance[]> = new Map<string, TUserAttendance[]>();

    Object.entries(body).forEach(([groupName, attendanceData]) => {

      const typedAttendanceData = (attendanceData as any[]).map(a => ({
        user: a.user,
        isPresent: a.isPresent
      })) as TUserAttendance[];

      mapped.set(groupName, typedAttendanceData);
    })
    return mapped;
  }

const officeAttendancePage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [groupAttendance, setGroupAttendance] = useState<Map<string, TUserAttendance[]>>();

  useEffect(() => {
    const getAsync = async() => {
      setGroupAttendance(await fetchGroupAttendance());
      setIsLoading(false);
    }
    getAsync();
  },
  [])


    return (
    <div className="h-screen flex overflow-clip">
      {/* Sidebar */}
      <NavSideBar />

      {/* Main Content */}
      <div className="w-full bg-background flex flex-wrap p-4 overflow-auto">
        {/* right side */}
        <div className="flex flex-wrap gap-4 px-4 justify-between">
                  <div className="w-60">
                    <SetAttendance/>
        </div>

        {

          groupAttendance &&
          [... groupAttendance.keys()].map(key =>
            <GroupOfficeAttendance groupHeader={key} groupAttendance={groupAttendance.get(key) ?? []}/>
          )
        }
        </div>
      </div>
    </div>
  );
}

export default officeAttendancePage;