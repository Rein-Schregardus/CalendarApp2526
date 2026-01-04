import type { NotificationType } from "../../types/NotificationType";
import Modal from "./Modal";

type ViewNotificationModalProps = {
  notification: NotificationType | null;
  setNotification: React.Dispatch<React.SetStateAction<NotificationType | null>>;
};

const ViewNotificationModal = ({ notification, setNotification }: ViewNotificationModalProps) => {
  if (!notification) return null; // no modal shown

  return (
    <Modal
      // setOpenModal={() => setNotification(null)}   // closes the modal
      title={`${notification.sender.fullName} invited you to an event`}
      size="lg"
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-600">
          <strong>Time:</strong> {notification.notifiedAt.toLocaleString()}
        </p>
      </div>
    </Modal>
  );
};

export default ViewNotificationModal;
