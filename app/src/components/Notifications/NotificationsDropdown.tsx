import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox } from "@fortawesome/free-solid-svg-icons";

import Notification from "@/components/Notifications/Notification";
import { useNotifications } from "@/hooks/useNotifications";


const NotificationsDropdown = () => {
  
  const {notifications, markAsSeen} = useNotifications();

  return (
    <div className="bg-white flex flex-col w-[320px] rounded-md">
      <span className="w-full px-6 py-3 text-center text-gray-600 font-semibold border-b border-gray-200">
        Notifications
      </span>

      {/* Notifications Container */}
      <div className="flex flex-col gap-[1px] bg-secondary">
        {notifications.length <= 0 ? (
          <div className="border-b text-gray-400 border-gray-200 w-full text-center py-3 flex flex-col items-center">
            <FontAwesomeIcon className="text-xl" icon={faInbox} />
            <span className="text-sm">Empty</span>
          </div>
        ) : (
          notifications.map((notification, i) => (
            <Notification key={i} notification={notification} />
          ))
        )}
      </div>

      <button type="button" className="text-accent font-semibold py-2 cursor-pointer border-t border-t-gray-200 hover:bg-gray-50">
        See all
      </button>
    </div>
  );
};

export default NotificationsDropdown;
