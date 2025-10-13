import avatar from "../assets/avatar.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox, faPlus } from "@fortawesome/free-solid-svg-icons";

import SmallButton from "./SmallButton";
import DropdownButton from "./Dropdown/DropdownButton";
import DropdownItem from "./Dropdown/DropdownItem";

interface NavbarProps 
{
  openCrudModal: (type: "event" | "room" | "work") => void;
}

const Navbar = ({ openCrudModal }: NavbarProps) => {
  return (
    <div className="flex items-center justify-between p-4">
      {/* Left container */}
      <DropdownButton
        label="New"
        icon={faPlus}
        className="flex items-center justify-evenly gap-2 bg-white cursor-pointer shadow-lg rounded-xl p-4"
      >
        <DropdownItem onClick={() => openCrudModal("event")}>Event</DropdownItem>
        <DropdownItem>Room Reservation</DropdownItem>
        <DropdownItem>Work Schedule</DropdownItem>
      </DropdownButton>
          
      {/* Right container */}
      <div className="w-full flex items-center justify-end gap-6">
        {/* Inbox icon with notification */}
        <SmallButton notifications={5}>
          <FontAwesomeIcon icon={faInbox} />
        </SmallButton>

        {/* User info */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col text-right">
            <span className="text-sm font-medium leading-3">John Doe</span>
            <span className="text-xs text-gray-500">Employee</span>
          </div>

          <img src={avatar} alt="User avatar" width={44} height={44} className="rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
