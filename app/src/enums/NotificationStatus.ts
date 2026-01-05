export const NotificationStatus = {
  Sent: 0,
  Accepted: 1,
  Declined: 2,
} as const;

export type NotificationStatus =
  typeof NotificationStatus[keyof typeof NotificationStatus];