import { useState, useEffect } from "react";
import { SearchResult, SearchResponse, SearchPagination } from "../types";
import { buildSearchUrl, MIN_QUERY_LENGTH } from "../config";
import axios from "axios";

interface UseSearchProps {
  initialQuery: string;
  initialType: string;
}

interface UseSearchReturn {
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  pagination: SearchPagination;
  searchQuery: string;
  searchType: string;
  setSearchQuery: (query: string) => void;
  setSearchType: (type: string) => void;
  performSearch: (q: string, t: string, page?: number) => Promise<void>;
  handleSearch: (e: React.FormEvent) => void;
  handleTypeChange: (newType: string) => void;
}

export const useSearch = ({
  initialQuery,
  initialType,
}: UseSearchProps): UseSearchReturn => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchType, setSearchType] = useState(initialType);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<SearchPagination>({
    page: 1,
    total: 0,
    totalPages: 0,
  });

  const performSearch = async (q: string, t: string, page: number = 1) => {
    const trimmedQuery = q.trim();

    // Validate query length
    if (!trimmedQuery || trimmedQuery.length < MIN_QUERY_LENGTH) {
      setError(`Vui lòng nhập ít nhất ${MIN_QUERY_LENGTH} ký tự`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Build API URL using config
      const apiUrl = buildSearchUrl({
        query: trimmedQuery,
        type: t,
        page,
      });

      const response = await axios.get(apiUrl);

      const data: SearchResponse = response.data;

      if (data.success && data.data) {
        setResults(data.data.results);
        setPagination({
          page: data.data.page,
          total: data.data.total,
          totalPages: data.data.totalPages,
        });
      } else {
        setError(data.error || "Có lỗi xảy ra khi tìm kiếm");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Không thể kết nối đến server. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery, searchType);
    }
  }, [initialQuery, searchType]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const url = new URL(window.location.href);
      url.searchParams.set("q", searchQuery.trim());
      url.searchParams.set("type", searchType);
      window.history.pushState({}, "", url.toString());
      performSearch(searchQuery.trim(), searchType);
    }
  };

  const handleTypeChange = (newType: string) => {
    setSearchType(newType);
    if (searchQuery.trim()) {
      const url = new URL(window.location.href);
      url.searchParams.set("q", searchQuery.trim());
      url.searchParams.set("type", newType);
      window.history.pushState({}, "", url.toString());
      performSearch(searchQuery.trim(), newType);
    }
  };

  return {
    results,
    loading,
    error,
    pagination,
    searchQuery,
    searchType,
    setSearchQuery,
    setSearchType,
    performSearch,
    handleSearch,
    handleTypeChange,
  };
};
