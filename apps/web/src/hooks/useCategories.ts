import { useCallback, useEffect, useState } from "react";
import { getAllCategories } from "@/api/categories";
import { Category } from "@/types/categories";

export interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseCategoriesOptions {
  /**
   * Điều khiển việc tự động fetch khi hook được khởi tạo.
   * Mặc định là true để giữ nguyên hành vi cũ.
   */
  enabled?: boolean;
}

/**
 * Custom hook to fetch and format categories for form select fields
 * Fetches active categories and formats them for use in select components
 */
export const useCategories = (
  options: UseCategoriesOptions = {}
): UseCategoriesReturn => {
  const { enabled = true } = options;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch active categories with pagination
      const response = await getAllCategories({ limit: 100 });

      console.log("Categories API response:", response);

      if (response.docs && Array.isArray(response.docs)) {
        // Format categories for select component
        setCategories(response.docs as unknown as Category[]);
      } else if (response.data && Array.isArray(response.data)) {
        // Fallback for different response format
        setCategories(response.data as unknown as Category[]);
      } else {
        console.warn("Categories response structure:", response);
        setError("Failed to load categories - unexpected response format");
        setCategories([]);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Network error while loading categories");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    fetchCategories();
  }, [enabled, fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
};
