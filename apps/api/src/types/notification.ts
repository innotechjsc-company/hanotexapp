// Notification types for HANOTEX platform

// Notification interface
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type?: string;
  is_read: boolean;
  created_at: Date;
}
