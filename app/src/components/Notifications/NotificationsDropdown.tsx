import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox } from "@fortawesome/free-solid-svg-icons";

import type { NotificationType } from "@/types/NotificationType";

import Notification from "@/components/Notifications/Notification";
import { useNotifications } from "@/context/NotificationsContext";

interface NotificationDropdownProps {
  setNotification: React.Dispatch<React.SetStateAction<NotificationType | null>>;
}

const NotificationsDropdown = ({ setNotification }: NotificationDropdownProps) => {
  const { notifications } = useNotifications();

  const visibleNotifications = notifications.slice(0, 4);

  return (
    <div className="bg-primary flex flex-col w-[320px] rounded-md">
      <span className="px-6 py-3 text-center text-gray-600 font-semibold border-b border-b-gray-secondary">
        Notifications
      </span>

      <div className="flex flex-col bg-secondary">
        {notifications.length === 0 ? (
          <div className="border-b text-gray-400 text-center py-3 flex flex-col items-center">
            <FontAwesomeIcon className="text-xl" icon={faInbox} />
            <span className="text-sm">Empty</span>
          </div>
        ) : (
          visibleNotifications.map(n => (
            <Notification
              key={n.id}
              notification={n}
              setNotification={setNotification}
            />
          ))
        )}
      </div>

        <button className="text-accent font-semibold py-2 border-t border-t-gray-secondary hover:bg-gray-50">
          See all
        </button>
    </div>
  );
};

export default NotificationsDropdown;
