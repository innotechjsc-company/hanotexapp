// Category types for HANOTEX platform

// Category interface
export interface Category {
  id: string;
  name: string;
  code: string;
  parent_id?: string;
  level: number;
  description?: string;
  created_at: Date;
}
