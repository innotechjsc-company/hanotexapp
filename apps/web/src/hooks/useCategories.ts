import { useState, useEffect } from 'react';
import { getActiveCategories } from '@/api/categories';
import { Category } from '@/types/categories';

export interface CategoryOption {
  value: string;
  label: string;
}

export interface UseCategoriesReturn {
  categories: CategoryOption[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and format categories for form select fields
 * Fetches active categories and formats them for use in select components
 */
export const useCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch active categories with pagination
      const response = await getActiveCategories({ limit: 100 });
      
      if (response.success && response.data) {
        // Format categories for select component
        const formattedCategories: CategoryOption[] = response.data.map((category: Category) => ({
          value: category.id || category.code,
          label: category.name
        }));
        
        setCategories(formattedCategories);
      } else {
        setError('Failed to load categories');
        setCategories([]);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Network error while loading categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories
  };
};