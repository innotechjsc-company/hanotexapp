/**
 * Notification type definition
 */

import { User } from "./users";

export type NotificationType =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "auction"
  | "transaction"
  | "technology"
  | "system";

export type NotificationPriority = "low" | "normal" | "high" | "urgent";

export interface Notification {
  id?: string;
  user: string | User; // User who receives the notification
  title: string; // Required title
  message: string;
  type: NotificationType;
  is_read: boolean;
  action_url?: string; // Optional URL for clickable notifications
  link?: string; // Legacy field for backward compatibility
  priority?: NotificationPriority; // Optional with default value
  createdAt: string;
  updatedAt: string;
}
