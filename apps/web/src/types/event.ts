import { Media } from "./media1";

export interface Event {
  id: string;
  image: Media;
  title: string;
  content: string;
  hashtags: string;
  document: Media;
  start_date: string;
  end_date: string;
  location: string;
  status: string;
  url: string;
  createdAt?: string;
  updatedAt?: string;
}
