import { User } from "./users";

// Loại thông báo
export type NotificationType =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "auction"
  | "transaction"
  | "technology"
  | "system"; // Phân loại thông báo

// Mức độ ưu tiên thông báo
export type NotificationPriority = "low" | "normal" | "high" | "urgent"; // Mức ưu tiên

export interface Notification {
  user: User;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  action_url: string;
  priority: NotificationPriority;
}
