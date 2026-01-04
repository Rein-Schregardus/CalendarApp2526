import { useContext, useEffect, useState } from "react";
import axios from "axios";

import type { NotificationType } from "@/types/NotificationType";
import { UserContext } from "./UserContext";

export function useNotifications() {
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    
    const userContext = useContext(UserContext);
    const userId = userContext.getCurrUser()?.id;

    // GET notifications from backend
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5005/notifications/user/${userId}`
                );

                console.log("fetching notifications.")

                const data: NotificationType[] = res.data;

                setNotifications(data);
                setUnreadCount(data.filter(n => !n.isRead).length);
            } catch (err) {
                console.error("Failed to fetch notifications:", err);
            }
        };

        fetchNotifications();
    }, []);

    const markAsSeen = async (notificationId: number) => {
        setNotifications(prev => {
            const notif = prev.find(n => n.id === notificationId);

            // If it's already read, do nothing (local + API)
            if (!notif || notif.isRead) return prev;

            // Otherwise mark it locally
            setUnreadCount(count => Math.max(count - 1, 0));

            return prev.map(n =>
                n.id === notificationId ? { ...n, isRead: true } : n
            );
        });

        try {
            console.log("fetching...")
            await axios.put(
                `http://localhost:5005/notifications/${notificationId}/user/${userId}/read`
            );
        } catch (err) {
            console.warn("Failed to sync seen state:", err);
        }
    };

    return { notifications, unreadCount, markAsSeen };
}
