import NavSideBar from "@/components/NavSideBar";
import avatar from "../assets/avatar.png";
import { useContext } from "react";
import { UserContext } from "@/hooks/UserContext";

const ProfilePage = () => {
  const userContext = useContext(UserContext);

  return (
    <div className="flex">
      <NavSideBar />
      <div className="flex flex-col min-h-screen h-[100%] w-[100%] bg-secondary">
        <div className=" max-w-300 w-[100%] bg-primary self-center shadow-xl">
          {/* Static profile part */}
          <h1 className="font-light text-3xl p-3 text-primary bg-accent hidden md:block">Profile {userContext.getCurrUser()?.fullName}</h1>
          <div className="flex p-4 shadow-md">
            <div className="flex items-center justify-center sm:mx-10">
              <img src={avatar} alt="User avatar" className="rounded-full max-w-20 max-h-20 sm:max-w-40 sm:max-h-40" />
            </div>
            <div className="flex flex-col justify-center">
              <div>
              <p><strong>User Name:</strong> {userContext.getCurrUser()?.fullName}</p>
              <p><strong>Full Name:</strong> {userContext.getCurrUser()?.fullName}</p>
              <p><strong>Email:</strong> {userContext.getCurrUser()?.email}</p>
              </div>
              <div className="py-3 flex flex-col justify-center gap-1">
                <strong className="bg-secondary p-1 rounded-md">Change Password</strong>
                <strong className="bg-secondary p-1 rounded-md">Change photo</strong>
              </div>
            </div>
          </div>
          <div className="flex justify-around items-end h-15 lg:justify-start md: sm:gap-3 border-b-3 border-accent sm:px-3">
            <button className="bg-secondary font-mono text-xl p-1 rounded-t-xl w-[100%] max-w-50 h-10 hover:h-12 transition-all duration-200">Settings</button>
            <button className="bg-secondary font-mono text-xl p-1 rounded-t-xl w-[100%] max-w-50 h-10 hover:h-12 transition-all duration-200">Insights</button>
            <button className="bg-secondary font-mono text-xl p-1 rounded-t-xl w-[100%] max-w-50 h-10 hover:h-12 transition-all duration-200">Help</button>
          </div>
          {/* Interchangable bottom */}
          <div className="p-3">
            <ul>
              <li>Do Notifications</li>
              <li>Theme Bright</li>
              <li>Report a bug!</li>
              <li></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage;