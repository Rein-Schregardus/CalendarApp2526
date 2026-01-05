import { useContext, useState, useEffect } from "react";
import type { NotificationType } from "../../types/NotificationType";
import Modal from "./Modal";
import { UserContext } from "@/hooks/UserContext";
import { NotificationStatus } from "@/enums/NotificationStatus";

type ViewNotificationModalProps = {
  notification: NotificationType | null;
  setNotification: React.Dispatch<React.SetStateAction<NotificationType | null>>;
};

const API_BASE = "http://localhost:5005";

const ViewNotificationModal = ({
  notification,
  setNotification,
}: ViewNotificationModalProps) => {
  const { getCurrUserAsync } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  // Local state to track status inside modal
  const [localNotification, setLocalNotification] = useState<NotificationType | null>(notification);

  // Sync if parent notification changes (e.g., reopening)
  useEffect(() => {
    setLocalNotification(notification);
  }, [notification]);

  if (!localNotification) return null;

  const hasEvent = localNotification.event !== null;

  const handleAction = async (action: "accept" | "decline") => {
    setLoading(true);

    try {
      const user = await getCurrUserAsync();
      if (!user) throw new Error("User not authenticated");

      const response = await fetch(
        `${API_BASE}/notifications/${localNotification.id}/user/${user.id}/${action}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to process invitation");
      }

      // Update local state immediately
      setLocalNotification(prev =>
        prev
          ? {
              ...prev,
              status:
                action === "accept"
                  ? NotificationStatus.Accepted
                  : NotificationStatus.Declined,
              isRead: true,
            }
          : prev
      );
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = () => {
    if (localNotification.status === NotificationStatus.Accepted) return "Accepted!";
    if (localNotification.status === NotificationStatus.Declined) return "Declined!";
    return null;
  };

  return (
    <Modal
      title={
        hasEvent
          ? `${localNotification.sender.fullName} invited you to an event`
          : "Notification"
      }
      size="lg"
    >
      <div className="flex flex-col gap-6">
        <div className="text-sm text-gray-500">
          Received at {new Date(localNotification.notifiedAt).toLocaleString()}
        </div>

        <div className="text-base text-gray-800">
          {hasEvent ? (
            <>
              <p className="font-medium">
                You have been invited to the following event:
              </p>

              <div className="mt-3 rounded-lg border bg-gray-50 p-4">
                <p className="text-lg font-semibold">{localNotification.event?.title}</p>

                <div className="mt-2 text-sm text-gray-600 flex flex-col gap-1">
                  <span>{localNotification.event?.date}</span>
                  <span>
                    {localNotification.event?.startTime} - {localNotification.event?.endTime}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <p>This is a notification.</p>
          )}
        </div>

        {hasEvent && localNotification.status === NotificationStatus.Sent && (
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              disabled={loading}
              onClick={() => handleAction("decline")}
              className="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Decline
            </button>

            <button
              disabled={loading}
              onClick={() => handleAction("accept")}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Accept
            </button>
          </div>
        )}

        {hasEvent && localNotification.status !== NotificationStatus.Sent && (
          <div className="rounded-md bg-gray-100 p-3 text-sm text-gray-600">
            {getStatusLabel()}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ViewNotificationModal;
