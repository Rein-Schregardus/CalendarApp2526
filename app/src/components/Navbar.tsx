import { faPlus } from "@fortawesome/free-solid-svg-icons";

import DropdownButton from "./Dropdown/DropdownButton";
import DropdownItem from "./Dropdown/DropdownItem";
import { useContext } from "react";
import { UserContext } from "@/hooks/UserContext";
import { Link } from "react-router-dom";
import ProfilePicture from "./ProfilePicture";
import NotificationsButton from "./Notifications/NotificationsButton";
import NotificationsDropdown from "@/components/Notifications/NotificationsDropdown";
import { useNotifications } from "@/hooks/useNotifications";

interface NavbarProps
{
  openCrudModal: (type: "event" | "room" | "work") => void;
}

const Navbar = ({ openCrudModal }: NavbarProps) => {
  const userContext = useContext(UserContext);
  const {notifications} = useNotifications();

  return (
    <div className="flex items-center justify-between p-4">
      {/* Left container */}
      <DropdownButton
        label="New"
        icon={faPlus}
        className="flex items-center justify-evenly gap-2 bg-white cursor-pointer shadow-sm rounded-xl p-4"
      >
        <DropdownItem onClick={() => openCrudModal("event")}>Event</DropdownItem>
        <DropdownItem>Room Reservation</DropdownItem>
        <DropdownItem>Work Schedule</DropdownItem>
      </DropdownButton>
      {/* Right container */}
      <div className="w-full flex items-center justify-end gap-6">

        {/* Notifications Dropdown Button */}
        <NotificationsButton notifications={notifications.length}>
          <NotificationsDropdown/>
        </NotificationsButton>

        {/* User info */}
        <Link to="/profile" className="flex items-center gap-2 rounded-md px-2 hover:bg-secondary transition-colors duration-200">
          <div className="flex flex-col text-right">
            <span className="text-sm font-medium leading-3">{userContext?.getCurrUser()?.fullName}</span>
            <span className="text-xs text-gray-500">{userContext?.getCurrUser()?.role}</span>
          </div>

          <ProfilePicture userId={userContext?.getCurrUser()?.id || -1}  className="rounded-full h-11 w-11" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
