import { Media } from "./media1";

export interface Events {
  id?: string;
  title: string;
  content: string;
  hashtags?: string | null;
  document?: (string | null) | Media;
  start_date: string;
  end_date: string;
}
