import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox } from "@fortawesome/free-solid-svg-icons";

import type { Notification } from "@/types/Notification";

interface NotificationsDropdownProps {
  notifications: Notification[];
}

const NotificationsDropdown = ({ notifications }: NotificationsDropdownProps) => {
  return (
    <div className="bg-white flex flex-col w-[256px] rounded-md">
      <span className="w-full px-6 py-3 text-center text-gray-600 font-semibold border-b border-gray-200">
        Notifications
      </span>

      {/* Notifications Container */}
      <div className="flex flex-col">
        {notifications.length <= 0 ? (
          <div className="border-b text-gray-400 border-gray-200 w-full text-center py-3 flex flex-col items-center">
            <FontAwesomeIcon className="text-xl" icon={faInbox} />
            <span className="text-sm">Empty</span>
          </div>
        ) : (
          notifications.map((notification, i) => (
            <div key={i} className="border-b border-gray-200 px-6 py-3">
              NOTIFICATION
            </div>
          ))
        )}
      </div>

      <button type="button" className="text-accent font-semibold py-2 cursor-pointer">
        See all
      </button>
    </div>
  );
};

export default NotificationsDropdown;
