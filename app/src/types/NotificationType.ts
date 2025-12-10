export type NotificationType = {
  id: number;

  sender: {
    id: number;
    fullName: string;
    userName: string;
  };

  event: {
    id: number;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
  } | null;

  notifiedAt: string;
  isRead: boolean;
  status: number;
};
