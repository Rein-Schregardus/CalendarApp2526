import avatar from "@/assets/avatar.png";
import type { NotificationType } from "@/types/NotificationType";
import { useNotifications } from "@/context/NotificationsContext";
import { useState } from "react";

interface NotificationProps 
{
  notification: NotificationType;
  setOpenNotificationModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Notification = ({ notification, setOpenNotificationModal}: NotificationProps ) => {
  const { markAsSeen } = useNotifications();

  const toggleNotification = () => {
    setOpenNotificationModal(true);
    markAsSeen(notification.id)
  }

  return (
    <button
      type="button"
      onClick={toggleNotification}
      className={`px-2 py-4 flex items-center gap-2 border-l-4 cursor-pointer ${
        notification.isRead
          ? "border-l-gray-200 bg-gray-100"
          : "border-l-accent bg-primary"
      }`}
    >
      <img src={avatar} alt="User avatar" width={44} height={44} className="rounded-full" />

      <div className="flex flex-col text-left">
        <span className="text-sm font-semibold">
          {notification.sender.fullName} invited you to an event
        </span>
        <span className="text-xs">This is subtext</span>
      </div>
    </button>
  );
};

export default Notification;
