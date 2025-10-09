import { Search } from "lucide-react";
import { SEARCH_TYPES } from "../constants";

interface SearchFormProps {
  searchQuery: string;
  searchType: string;
  onSearchQueryChange: (query: string) => void;
  onSearchTypeChange: (type: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SearchForm({
  searchQuery,
  searchType,
  onSearchQueryChange,
  onSearchTypeChange,
  onSubmit,
}: SearchFormProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                placeholder="Tìm công nghệ, nhu cầu, chuyên gia, tổ chức, quỹ đầu tư, dự án, tin tức, sự kiện..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Tìm kiếm
          </button>
        </div>
        
        {/* Search Type Filters */}
        <div className="flex flex-wrap gap-2">
          {SEARCH_TYPES.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => onSearchTypeChange(type.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  searchType === type.value
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {type.label}
              </button>
            );
          })}
        </div>
      </form>
    </div>
  );
}
