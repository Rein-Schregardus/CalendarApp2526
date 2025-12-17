import type { NotificationType } from "@/types/NotificationType";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

interface NotificationContextType {
    notifications: NotificationType[];
    unreadCount: number;
    markAsSeen: (id: number) => void;
}

const NotificationsContext = createContext<NotificationContextType | null>(null);

export const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
    const [notifications, setNotifications] = useState<NotificationType[]>([]);

    // RETRIEVE FROM USERCONTEXT LATER!
    const userId = 1;

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await axios.get(`http://localhost:5005/notifications/user/${userId}`);

                console.log("Fetched notifications");
                setNotifications(res.data);
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            }
        }

        fetchNotifications();
    }, []);

    const unreadCount = 2;

    const markAsSeen = async (notificationId: Number) => {
        setNotifications(prev => 
            prev.map(n => (n.id === notificationId ? { ...n, isRead: true} : n))
        )


        // Todo: add to localstorage

        try {
            await axios.put(
                `http://localhost:5005/notifications/${notificationId}/user/${userId}/read`
            );
        } catch (err) {
            console.warn("Failed to sync seen state:", err);
        }
    }

    return (
        <NotificationsContext.Provider value={{ notifications, unreadCount, markAsSeen }}>
        {children}
        </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used inside NotificationsProvider");
  return ctx;
};