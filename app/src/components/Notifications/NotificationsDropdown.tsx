import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox } from "@fortawesome/free-solid-svg-icons";

import Notification from "@/components/Notifications/Notification";
import { useNotifications } from "@/context/NotificationsContext";

const NotificationsDropdown = () => {
  const { notifications } = useNotifications();

  return (
    <div className="bg-white flex flex-col w-[320px] rounded-md">
      <span className="px-6 py-3 text-center text-gray-600 font-semibold border-b border-b-gray-200">
        Notifications
      </span>

      <div className="flex flex-col bg-secondary">
        {notifications.length === 0 ? (
          <div className="border-b text-gray-400 text-center py-3 flex flex-col items-center">
            <FontAwesomeIcon className="text-xl" icon={faInbox} />
            <span className="text-sm">Empty</span>
          </div>
        ) : (
          notifications.map(n => <Notification key={n.id} notification={n} />)
        )}
      </div>

      <button className="text-accent font-semibold py-2 border-t border-t-gray-200 hover:bg-gray-50">
        See all
      </button>
    </div>
  );
};

export default NotificationsDropdown;
