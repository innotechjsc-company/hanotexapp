import { SearchPagination } from "../types";

interface SearchPaginationProps {
  pagination: SearchPagination;
  searchQuery: string;
  searchType: string;
  onPageChange: (page: number) => void;
}

export default function SearchPaginationComponent({
  pagination,
  onPageChange,
}: SearchPaginationProps) {
  return (
    <div className="flex justify-center mt-8">
      <div className="flex gap-2">
        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              page === pagination.page
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}
