import { Search } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { SEARCH_TYPES, TYPE_COLORS } from "./constants";

export const getTypeIcon = (type: string): LucideIcon => {
  const typeConfig = SEARCH_TYPES.find(t => t.value === type);
  return typeConfig?.icon || Search;
};

export const getTypeLabel = (type: string): string => {
  const typeConfig = SEARCH_TYPES.find(t => t.value === type);
  return typeConfig?.label || type;
};

export const getTypeColor = (type: string): string => {
  return TYPE_COLORS[type] || 'bg-gray-100 text-gray-800';
};
