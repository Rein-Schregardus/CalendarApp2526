import type { UserType } from "./UserType";

export type NotificationType = {
  id: number;
  sendingUser?: UserType;
  title?: string;
  description?: string;
  hasRead: boolean;
  date?: string;
};