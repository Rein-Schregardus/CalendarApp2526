import avatar from "../assets/avatar.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between p-4">
      {/* Left container (currently empty) */}
      <div className="flex items-center"></div>

      {/* Right container */}
      <div className="w-full flex items-center justify-end gap-6">
        {/* Inbox icon with notification */}
        <div className="relative bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer hover:bg-[#e0e2e6]">
          <FontAwesomeIcon icon={faInbox} />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-[#0576ff] text-white rounded-full text-xs leading-4">
            4
          </div>
        </div>

        {/* User info */}
        <div className="flex flex-col text-right">
          <span className="text-xs font-medium leading-3">John Doe</span>
          <span className="text-[10px] text-gray-500">Employee</span>
        </div>

        {/* Avatar */}
        <img src={avatar} alt="User avatar" width={40} height={40} className="rounded-full" />
      </div>
    </div>
  );
};

export default Navbar;
