import { Search } from "lucide-react";
import AnimatedIcon from "@/components/ui/AnimatedIcon";
import { SearchResult, SearchPagination } from "../types";
import { getTypeLabel } from "../utils";
import SearchResultCard from "./SearchResultCard";
import SearchPaginationComponent from "./SearchPagination";

interface SearchResultsProps {
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  pagination: SearchPagination;
  searchType: string;
  searchQuery: string;
  onPageChange: (page: number) => void;
}

export default function SearchResults({
  results,
  loading,
  error,
  pagination,
  searchType,
  searchQuery,
  onPageChange,
}: SearchResultsProps) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <AnimatedIcon animation="pulse" className="mx-auto mb-4">
          <Search className="h-12 w-12 text-blue-600" />
        </AnimatedIcon>
        <p className="text-gray-600">Đang tìm kiếm...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <Search className="h-12 w-12 mx-auto" />
        </div>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Không tìm thấy kết quả nào</p>
      </div>
    );
  }

  return (
    <>
      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-gray-600">
          Tìm thấy <span className="font-semibold text-blue-600">{pagination.total}</span> kết quả
          {searchType !== 'all' && ` trong ${getTypeLabel(searchType)}`}
        </p>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((result, index) => (
          <SearchResultCard
            key={`${result.type}-${result.id}`}
            result={result}
            index={index}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <SearchPaginationComponent
          pagination={pagination}
          searchQuery={searchQuery}
          searchType={searchType}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
}
