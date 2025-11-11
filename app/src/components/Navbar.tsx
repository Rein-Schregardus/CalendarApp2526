import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faInbox } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

import avatar from "../assets/avatar.png";

import type { NotificationType } from "@/types/NotificationType";

import DropdownButton from "./Dropdown/DropdownButton";
import DropdownItem from "./Dropdown/DropdownItem";
import NotificationsButton from "./Notifications/NotificationsButton";
import NotificationsDropdown from "@/components/Notifications/NotificationsDropdown";
import { useNotifications } from "@/hooks/useNotifications";

interface NavbarProps 
{
  openCrudModal: (type: "event" | "room" | "work") => void;
}

const Navbar = ({ openCrudModal }: NavbarProps) => {

  const {notifications, markAsSeen} = useNotifications();

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
          <NotificationsDropdown notifications={notifications}/>
        </NotificationsButton>

        {/* User info */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col text-right">
            <span className="text-sm font-medium leading-3">John Doe</span>
            <span className="text-xs text-gray-600 font-bold">Employee</span>
          </div>

          <img src={avatar} alt="User avatar" width={44} height={44} className="rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
