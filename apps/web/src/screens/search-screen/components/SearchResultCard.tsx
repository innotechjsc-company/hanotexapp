import Link from "next/link";
import {
  ArrowRight,
  DollarSign,
  MapPin,
  Calendar,
  Building,
} from "lucide-react";
import { SearchResult } from "../types";
import { getTypeIcon, getTypeLabel, getTypeColor } from "../utils";
import { Tag } from "antd";

interface SearchResultCardProps {
  result: SearchResult;
  index: number;
}

export default function SearchResultCard({
  result,
  index,
}: SearchResultCardProps) {
  const TypeIcon = getTypeIcon(result.type);
  
  // Override URL for project type to navigate to fundraising detail page
  const cardUrl = result.type === 'project' 
    ? `/funds/fundraising/${result.id}`
    : result.url;

  return (
    <Link
      href={cardUrl}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${getTypeColor(result.type)}`}>
              <TypeIcon className="h-5 w-5" />
            </div>
            <div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${getTypeColor(result.type)}`}
              >
                {getTypeLabel(result.type)}
              </span>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {result.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {result.description}
        </p>

        {/* Metadata */}
        {result.metadata && Object.keys(result.metadata).length > 0 && (
          <div className="space-y-2 mt-3">
            {/* Category */}
            {result.metadata.category && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Tag className="h-4 w-4" />
                <span>{String(result.metadata.category)}</span>
              </div>
            )}

            {/* Location */}
            {result.metadata.location && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{String(result.metadata.location)}</span>
              </div>
            )}

            {/* Price/Budget */}
            {(result.metadata.price || result.metadata.budget) && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <DollarSign className="h-4 w-4" />
                <span>
                  {String(result.metadata.price || result.metadata.budget)}
                </span>
              </div>
            )}

            {/* Deadline */}
            {result.metadata.deadline && (
              <div className="flex items-center gap-2 text-sm text-orange-600">
                <Calendar className="h-4 w-4" />
                <span>{String(result.metadata.deadline)}</span>
              </div>
            )}

            {/* Organization */}
            {result.metadata.organization && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building className="h-4 w-4" />
                <span>{String(result.metadata.organization)}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
