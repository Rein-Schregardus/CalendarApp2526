import type { NotificationType } from "@/types/NotificationType";
import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { UserContext } from "@/hooks/UserContext";

interface NotificationContextType {
    notifications: NotificationType[];
    unreadCount: number;
    markAsSeen: (id: number) => void;
}

const NotificationsContext = createContext<NotificationContextType | null>(null);


export const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
    const [notifications, setNotifications] = useState<NotificationType[]>([]);

      const userContext = useContext(UserContext);
    // TODO: get from UserContext later
    const userId = userContext.getCurrUser()?.id || -1;

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5005/notifications/user/${userId}`
                );
                setNotifications(res.data);
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            }
        };

        fetchNotifications();
    }, [userId]);

    /** ✅ Always accurate */
    const unreadCount = useMemo(
        () => notifications.filter(n => !n.isRead).length,
        [notifications]
    );

    const markAsSeen = async (notificationId: number) => {
        // optimistic update
        setNotifications(prev =>
            prev.map(n =>
                n.id === notificationId ? { ...n, isRead: true } : n
            )
        );

        try {
            await axios.put(
                `http://localhost:5005/notifications/${notificationId}/user/${userId}/read`
            );
        } catch (err) {
            console.warn("Failed to sync seen state:", err);
        }
    };

    return (
        <NotificationsContext.Provider
            value={{ notifications, unreadCount, markAsSeen }}
        >
            {children}
        </NotificationsContext.Provider>
    );
};

export const useNotifications = () => {
    const ctx = useContext(NotificationsContext);
    if (!ctx) {
        throw new Error("useNotifications must be used inside NotificationsProvider");
    }
    return ctx;
};
