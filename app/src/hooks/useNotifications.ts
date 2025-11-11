import type { NotificationType } from "@/types/NotificationType";
import { useEffect, useState } from "react";

const notificationsData: NotificationType[] = [
    { id: 0, title: "Dani Jurjevic Invited you to an event", hasRead: false},
    { id: 1, title: "Rein Schregardus Invited you to an event", hasRead: false},
    { id: 2, title: "Peter Zoetekouw Invited you to an event", hasRead: false},
];

export function useNotifications()
{

    const [notifications, setNotifications] = useState<NotificationType[]>(notificationsData)

    const markAsSeen = async (id: number) => {
        setNotifications(prev => prev.map(n => (n.id === id ? { ...n, seen: true } : n)));

        const seenIds = JSON.parse(localStorage.getItem("seenNotifications") || "[]");
        if (!seenIds.includes(id))
        {
            seenIds.push(id);
            localStorage.setItem("seenNotifications", JSON.stringify(seenIds));
        }


        try {
            await fetch(`/notifications/${id}/mark-seen`, { method: "POST" });
        } catch (err) {
            console.warn("Failed to sync seen state:", err);
        }
    }

    return { notifications, markAsSeen };
}