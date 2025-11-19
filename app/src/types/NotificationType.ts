export type NotificationType = {
  id: number;
  sender: {
    id: number;
    fullName: string;
    userName: string;
  };
  event: any | null; // Refactor Type Any to event type later
  notifiedAt: string;
  isRead: boolean;
  status: number;
};
