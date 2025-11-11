import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

import avatar from "@/assets/avatar.png";

import type { NotificationType } from "@/types/NotificationType";
import { useNotifications } from "@/hooks/useNotifications";

interface NotificationProps {
  notification: NotificationType,
}

const Notification = ({ notification }: NotificationProps) => {
  const {notifications, markAsSeen} = useNotifications();

  return (
    <button type="button" onClick={() => markAsSeen(0)} className={`px-2 py-4 flex justify-start items-center gap-2 border-l-4 cursor-pointer ${notification.hasRead ? "border-l-gray-100 bg-gray-100" : " border-l-accent bg-primary"}`}>
      <img src={avatar} alt="User avatar" width={44} height={44} className="rounded-full" />

      <div className="flex flex-col text-start">
        <span className="text-sm font-semibold">{notification.title}</span>
        <span className="text-xs">This is subtext</span>
      </div>
    </button>
  );
};

export default Notification;
