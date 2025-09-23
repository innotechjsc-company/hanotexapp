import { Media } from "./media1";

export interface News {
  title: string;
  content: string;
  hashtags: string;
  document: Media;
  createdAt?: string;
  updatedAt?: string;
}
