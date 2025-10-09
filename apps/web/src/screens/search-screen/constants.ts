import { 
  Search, 
  Clock, 
  Building, 
  TrendingUp,
  FolderOpen,
  Newspaper,
  CalendarDays,
  Landmark
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface SearchTypeConfig {
  value: string;
  label: string;
  icon: LucideIcon;
}

export const SEARCH_TYPES: SearchTypeConfig[] = [
  { value: 'all', label: 'Tất cả', icon: Search },
  { value: 'technology', label: 'Công nghệ', icon: TrendingUp },
  { value: 'demand', label: 'Nhu cầu', icon: Clock },
  { value: 'company', label: 'Công ty', icon: Building },
  { value: 'research-institution', label: 'Viện nghiên cứu', icon: Landmark },
  { value: 'project', label: 'Dự án', icon: FolderOpen },
  { value: 'news', label: 'Tin tức', icon: Newspaper },
  { value: 'event', label: 'Sự kiện', icon: CalendarDays },
];

export const TYPE_COLORS: Record<string, string> = {
  technology: 'bg-blue-100 text-blue-800',
  demand: 'bg-green-100 text-green-800',
  project: 'bg-purple-100 text-purple-800',
  news: 'bg-orange-100 text-orange-800',
  event: 'bg-pink-100 text-pink-800',
};
