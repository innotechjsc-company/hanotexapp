import { useState, useEffect, useCallback } from 'react';
import { User, UserType, UserRole } from '@/types/users';

export interface UsersResponse {
  success: boolean;
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UseUsersParams {
  page?: number;
  limit?: number;
  role?: UserRole;
  user_type?: UserType;
  verified?: boolean;
  search?: string;
}

export const useUsers = (params: UseUsersParams = {}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (params.page) queryParams.set('page', params.page.toString());
      if (params.limit) queryParams.set('limit', params.limit.toString());
      if (params.role) queryParams.set('role', params.role);
      if (params.user_type) queryParams.set('user_type', params.user_type);
      if (params.verified !== undefined) queryParams.set('verified', params.verified.toString());
      if (params.search) queryParams.set('search', params.search);

      const response = await fetch(`/api/users?${queryParams.toString()}`);
      const result: UsersResponse = await response.json();

      if (result.success) {
        setUsers(result.data);
        setPagination(result.pagination);
      } else {
        setError('Failed to fetch users');
      }
    } catch (err) {
      setError('Network error while fetching users');
      console.error('Users fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [params.page, params.limit, params.role, params.user_type, params.verified, params.search]);

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