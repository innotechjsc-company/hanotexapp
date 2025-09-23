import { Media } from "./media1";

export interface News {
  id?: string;
  image: Media;
  title: string;
  content: string;
  hashtags?: string | null;
  document?: (string | null) | Media;
  views: number;
  likes: number;
  isLiked: boolean;
  updatedAt: string;
  createdAt: string;
}
