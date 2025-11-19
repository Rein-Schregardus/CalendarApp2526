import { useEffect, useState } from "react";
import axios from "axios";

import type { NotificationType } from "@/types/NotificationType";

export function useNotifications() {
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const userId = 1;

    // GET notifications from backend
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5005/notifications/user/${userId}`
                );

                setNotifications(res.data);
            } catch (err) {
                console.error("Failed to fetch notifications:", err);
            }
        };

        fetchNotifications();
    }, []);

    const markAsSeen = async (notificationId: number) => {
        console.log("marked as seen")
        setNotifications(prev =>
            prev.map(n => (n.id === notificationId ? { ...n, hasRead: true } : n))
        );

        // localStorage sync
        const seenIds = JSON.parse(localStorage.getItem("seenNotifications") || "[]");
        if (!seenIds.includes(notificationId)) {
            seenIds.push(notificationId);
            localStorage.setItem("seenNotifications", JSON.stringify(seenIds));
        }

        try {
            await axios.put(`http://localhost:5005/notifications/${notificationId}/user/${userId}/read`);
        } catch (err) {
            console.warn("Failed to sync seen state:", err);
        }
    };

    return { notifications, markAsSeen };
}
