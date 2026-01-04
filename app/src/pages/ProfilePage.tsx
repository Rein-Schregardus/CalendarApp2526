import NavSideBar from "@/components/NavSideBar";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/hooks/UserContext";
import ThemeButton from "@/components/ThemeButton";
import FileModal from "@/components/Modal/FileModal";
import ProfilePicture from "@/components/ProfilePicture";
import {ScheduleColorSetting} from "@/components/ScheduleColorSettings";
import { GlobalModalContext } from "@/context/GlobalModalContext";
import { parseISO } from "date-fns";

const GetInsights = async() => {
  const response = await fetch("http://localhost:5005/auth/statistics", {credentials: "include"});
  const body = await response.json();
  return body;
}

const ProfilePage = () => {
  const modalContext = useContext(GlobalModalContext);
  const userContext = useContext(UserContext);
  const [pageBottom, setPageBottom] = useState<"settings" | "insights" | "help">("settings");
  const unSelectedBottomPageButton = "bg-secondary font-mono text-l rounded-t-xl w-[100%] max-w-50 h-8 hover:h-12 transition-all duration-200 cursor-pointer";
  const selectedBottomPageButton = "bg-accent text-primary font-mono text-l rounded-t-xl w-[100%] max-w-50 h-8 hover:h-12 transition-all duration-200 cursor-pointer"

  const [stats, setStatisitcs] = useState<any>();

  useEffect(() => {
    const get = async() => {
      const stats = await GetInsights();
      setStatisitcs(stats);
    }
    get();
  },
  [])

  return (
    <div className="flex h-screen">
      <NavSideBar />

      <div className="flex flex-col min-h-screen h-[100%] w-[100%] bg-background overflow-auto">
        <div className="max-w-300 w-[100%] bg-primary self-center shadow-xl">

          {/* Profile Header */}
          <h1 className="font-light text-2xl p-3 text-primary bg-accent hidden md:block">
            Profile {currUser?.fullName ?? ""}
          </h1>

          {/* User Top Section */}
          <div className="flex p-4 shadow-md">
            <div className="flex items-center justify-center sm:mx-10">
              <ProfilePicture
                userId={currUser?.id ?? -1}
                className="rounded-full w-20 h-20 sm:w-40 sm:h-40"
              />
            </div>

            <div className="flex flex-col justify-center">
              <div>
              <p><strong>User Name:</strong> {userContext.getCurrUser()?.fullName}</p>
              <p><strong>Full Name:</strong> {userContext.getCurrUser()?.fullName}</p>
              <p><strong>Email:</strong> {userContext.getCurrUser()?.email}</p>
              </div>

              <div className="py-3 flex flex-col justify-center gap-1">
                <strong className="bg-secondary p-1 rounded-md cursor-pointer" onClick={() => modalContext.setModal(<FileModal />)}>Change photo</strong>
              </div>
            </div>
          </div>

          {/* Section Buttons */}
          <div className="flex justify-around items-end h-14 lg:justify-start sm:gap-3 border-b-3 border-accent sm:px-3">
            <button
              className={pageBottom === "settings" ? selectedBottomPageButton : unSelectedBottomPageButton}
              onClick={() => setPageBottom("settings")}
            >
              Settings
            </button>
            <button
              className={pageBottom === "insights" ? selectedBottomPageButton : unSelectedBottomPageButton}
              onClick={() => setPageBottom("insights")}
            >
              Insights
            </button>
            <button
              className={pageBottom === "help" ? selectedBottomPageButton : unSelectedBottomPageButton}
              onClick={() => setPageBottom("help")}
            >
              Help
            </button>
          </div>

          {/* Section Content */}
          <div className="p-3">
            {pageBottom === "settings" && <div>
              <ul>
                <li><ThemeButton></ThemeButton></li>
                <li><ScheduleColorSetting/></li>
              </ul>
            </div>}
            {pageBottom === "insights" && <div>
              <strong>Statistics</strong>
              {stats &&
              <ul>
                <li className="font-bold pt-2">General</li>
                <li>account created: {parseISO(stats.accountCreated).toLocaleDateString()}</li>
                <li>years of service: {stats.yearsOfService}</li>
                <li>in the office: {stats.inOffice ? "Yes": "No"}</li>
                <li className="font-bold pt-2">Events</li>
                <li>events attended: {stats.eventsAttended}</li>
                <li>events created: {stats.eventsCreated}</li>
                <li>invites accepted: {stats.invitesAccepted}</li>
                <li>Words typed in event descriptions: {stats.wordsTypedInEventDesciption}</li>
                <li>Biggest event attended: {stats.biggestEventAttendedName || "no events attended, yet"}, {stats.biggestEventAttendedSize} ppl</li>
                <li className="font-bold pt-2">Reservations</li>
                <li>Rooms reserved: {stats.totalRoomsReserved}</li>
                <li>Reserved time: {stats.reservedTime}</li>
                <li>Longest reservation: {stats.longestReservation}</li>
                <li className="font-bold pt-2">Groups</li>
                <li>In groups: {stats.inGroups}</li>
                <li>Largest group: {stats.largestGroupName}, {stats.largestGroupSize} ppl</li>
                <li className="font-bold pt-2">Other</li>
                <li>days since last incident: {stats.daysSinceIncident}</li>
              </ul>
}
            </div>}
            {pageBottom === "help" && <div>
              <p>
                Tough cookies. You are having issues. Here are some steps that might reslove your issue.
              </p>
              <p>Have you tried turing it of and back on again? if yes. That you should contact support. We hired them for these types of things.</p>
              <strong>Support</strong>
              <p>06 7764 4332</p>
              <p>contact@suport.com</p>
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
