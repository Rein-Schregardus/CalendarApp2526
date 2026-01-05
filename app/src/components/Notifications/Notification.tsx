import avatar from "@/assets/avatar.png";
import type { NotificationType } from "@/types/NotificationType";
import { useNotifications } from "@/context/NotificationsContext";
import { useContext, useState } from "react";
import { GlobalModalContext } from "@/context/GlobalModalContext";
import ViewNotificationModal from "@/components/Modal/ViewNotificationModal";

interface NotificationProps
{
  notification: NotificationType;
  setNotification: React.Dispatch<React.SetStateAction<NotificationType | null>>;
}

const Notification = ({ notification, setNotification }: NotificationProps ) => {
  const { markAsSeen } = useNotifications();
    const modalContext = useContext(GlobalModalContext);

  const openNotification = () => {
    modalContext.setModal(<ViewNotificationModal setNotification={setNotification} notification={notification} />);
    markAsSeen(notification.id);
  }

  return (
    <button
      type="button"
      onClick={openNotification}
      className={`px-2 py-4 flex items-center gap-2 border-l-4 cursor-pointer ${
        notification.isRead
          ? "border-l-secondary bg-primary"
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