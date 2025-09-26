/**
 * Notification type definition
 */

import { User } from "./users";

export interface Notification {
  id?: string;
  user: string | User; // User who receives the notification
  type: "system" | "message" | "auction" | "offer" | "event";
  title?: string; // Optional title
  message: string;
  link?: string; // Optional link to the relevant page
  is_read: boolean;
  createdAt: string;
  updatedAt: string;
}
