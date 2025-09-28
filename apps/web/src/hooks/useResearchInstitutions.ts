import { useState, useEffect, useCallback } from 'react';
import { ResearchInstitution, InstitutionType } from '@/types/research-institutions';
import {
  getResearchInstitutions,
  ResearchInstitutionFilters,
  PaginationParams
} from '@/api/research-institution';
import { ApiResponse } from '@/api/client';

export interface UseResearchInstitutionsParams extends ResearchInstitutionFilters, PaginationParams {}

export const useResearchInstitutions = (params: UseResearchInstitutionsParams = {}) => {
  const [institutions, setInstitutions] = useState<ResearchInstitution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  const fetchInstitutions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: ResearchInstitutionFilters = {
        institution_type: params.institution_type,
        is_active: params.is_active,
        search: params.search,
      };

      const paginationParams: PaginationParams = {
        page: params.page || 1,
        limit: params.limit || 10,
        sort: params.sort || '-createdAt',
      };

      const response: ApiResponse<ResearchInstitution[]> = await getResearchInstitutions(
        filters,
        paginationParams
      );

      if (response.docs || response.data) {
        // PayloadCMS returns docs array for collections
        let institutionsData: ResearchInstitution[] = [];
        if (response.docs && Array.isArray(response.docs)) {
          // Handle nested arrays if necessary
          institutionsData = response.docs.flat() as ResearchInstitution[];
        } else if (Array.isArray(response.data)) {
          institutionsData = response.data;
        } else if (response.data) {
          institutionsData = [response.data as ResearchInstitution];
        }
        setInstitutions(institutionsData);
        
        // Set pagination from PayloadCMS response
        setPagination({
          page: response.page || 1,
          limit: response.limit || 10,
          total: response.totalDocs || 0,
          totalPages: response.totalPages || 0,
          hasNextPage: response.hasNextPage || false,
          hasPrevPage: response.hasPrevPage || false
        });
      } else {
        setError('No data received');
      }
    } catch (err: any) {
      setError(err.message || 'Network error while fetching research institutions');
      console.error('Research institutions fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [
    params.institution_type,
    params.is_active,
    params.search,
    params.page,
    params.limit,
    params.sort
  ]);

  useEffect(() => {
    fetchInstitutions();
  }, [fetchInstitutions]);

  const refetch = useCallback(() => {
    fetchInstitutions();
  }, [fetchInstitutions]);

  return {
    institutions,
    loading,
    error,
    pagination,
    refetch
  };
};