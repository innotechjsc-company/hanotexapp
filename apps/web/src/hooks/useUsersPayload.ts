import { useState, useEffect, useCallback } from 'react';
import { User, UserRole, UserType } from '@/types/users';
import { getUsers, UserFilters, PaginationParams } from '@/api/user';
import { ApiResponse } from '@/api/client';

export interface UseUsersPayloadParams extends UserFilters, PaginationParams {}

export const useUsersPayload = (params: UseUsersPayloadParams = {}) => {
  const [users, setUsers] = useState<User[]>([]);
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

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: UserFilters = {
        user_type: params.user_type,
        role: params.role,
        is_active: params.is_active,
        is_verified: params.is_verified,
        search: params.search,
      };

      const paginationParams: PaginationParams = {
        page: params.page || 1,
        limit: params.limit || 10,
        sort: params.sort || '-createdAt',
      };

      const response: ApiResponse<User[]> = await getUsers(filters, paginationParams);

      if (response.docs || response.data) {
        // PayloadCMS returns docs array for collections
        let usersData: User[] = [];
        if (response.docs && Array.isArray(response.docs)) {
          // Handle nested arrays if necessary
          usersData = response.docs.flat() as User[];
        } else if (Array.isArray(response.data)) {
          usersData = response.data;
        } else if (response.data) {
          usersData = [response.data as User];
        }
        setUsers(usersData);
        
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
      setError(err.message || 'Network error while fetching users');
      console.error('Users fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [
    params.user_type,
    params.role,
    params.is_active,
    params.is_verified,
    params.search,
    params.page,
    params.limit,
    params.sort
  ]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const refetch = useCallback(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    pagination,
    refetch
  };
};