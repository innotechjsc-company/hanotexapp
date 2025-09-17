import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '../auth';
import apiClient from '@/lib/api';

// Mock API client
jest.mock('@/lib/api', () => ({
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  getCurrentUser: jest.fn(),
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('Auth Store', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Reset store state
    act(() => {
      useAuthStore.getState().logout();
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        user_type: 'INDIVIDUAL',
        role: 'USER',
        created_at: '2023-01-01T00:00:00Z',
        profile: null,
      };
      
      const mockToken = 'mock-jwt-token';
      
      mockApiClient.login.mockResolvedValue({
        success: true,
        data: { user: mockUser, token: mockToken },
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.token).toBe(mockToken);
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle login failure', async () => {
      mockApiClient.login.mockResolvedValue({
        success: false,
        error: 'Invalid credentials',
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        try {
          await result.current.login('test@example.com', 'wrongpassword');
        } catch (error) {
          expect(error.message).toBe('Invalid credentials');
        }
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle network error during login', async () => {
      mockApiClient.login.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        try {
          await result.current.login('test@example.com', 'password123');
        } catch (error) {
          expect(error.message).toBe('Network error');
        }
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });

    it('should set loading state during login', async () => {
      mockApiClient.login.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.login('test@example.com', 'password123');
      });

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 150));
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('register', () => {
    it('should register successfully', async () => {
      mockApiClient.register.mockResolvedValue({
        success: true,
        data: { message: 'Registration successful' },
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.register(
          'test@example.com',
          'password123',
          'INDIVIDUAL',
          { full_name: 'John Doe' }
        );
      });

      expect(result.current.isLoading).toBe(false);
      expect(mockApiClient.register).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        user_type: 'INDIVIDUAL',
        profile: { full_name: 'John Doe' },
      });
    });

    it('should handle registration failure', async () => {
      mockApiClient.register.mockResolvedValue({
        success: false,
        error: 'Email already exists',
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        try {
          await result.current.register(
            'test@example.com',
            'password123',
            'INDIVIDUAL',
            { full_name: 'John Doe' }
          );
        } catch (error) {
          expect(error.message).toBe('Email already exists');
        }
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('logout', () => {
    it('should logout successfully', () => {
      const { result } = renderHook(() => useAuthStore());

      // First login
      act(() => {
        useAuthStore.setState({
          user: { id: '1', email: 'test@example.com' },
          token: 'mock-token',
          isAuthenticated: true,
        });
      });

      expect(result.current.isAuthenticated).toBe(true);

      // Then logout
      act(() => {
        result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(mockApiClient.logout).toHaveBeenCalled();
    });
  });

  describe('refreshUser', () => {
    it('should refresh user data successfully', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        user_type: 'INDIVIDUAL',
        role: 'USER',
        created_at: '2023-01-01T00:00:00Z',
        profile: null,
      };

      mockApiClient.getCurrentUser.mockResolvedValue({
        success: true,
        data: { user: mockUser },
      });

      const { result } = renderHook(() => useAuthStore());

      // Set initial state with token
      act(() => {
        useAuthStore.setState({
          token: 'mock-token',
          isAuthenticated: true,
        });
      });

      await act(async () => {
        await result.current.refreshUser();
      });

      expect(result.current.user).toEqual(mockUser);
    });

    it('should logout when refresh fails', async () => {
      mockApiClient.getCurrentUser.mockRejectedValue(new Error('Unauthorized'));

      const { result } = renderHook(() => useAuthStore());

      // Set initial state with token
      act(() => {
        useAuthStore.setState({
          token: 'mock-token',
          isAuthenticated: true,
        });
      });

      await act(async () => {
        await result.current.refreshUser();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
    });

    it('should not refresh when no token', async () => {
      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.refreshUser();
      });

      expect(mockApiClient.getCurrentUser).not.toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    it('should update user data', () => {
      const { result } = renderHook(() => useAuthStore());

      const initialUser = {
        id: '1',
        email: 'test@example.com',
        user_type: 'INDIVIDUAL',
        role: 'USER',
        created_at: '2023-01-01T00:00:00Z',
        profile: null,
      };

      act(() => {
        useAuthStore.setState({
          user: initialUser,
          isAuthenticated: true,
        });
      });

      act(() => {
        result.current.updateUser({ email: 'newemail@example.com' });
      });

      expect(result.current.user?.email).toBe('newemail@example.com');
    });

    it('should not update when no user', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.updateUser({ email: 'newemail@example.com' });
      });

      expect(result.current.user).toBeNull();
    });
  });

  describe('clearError', () => {
    it('should clear loading state', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        useAuthStore.setState({ isLoading: true });
      });

      expect(result.current.isLoading).toBe(true);

      act(() => {
        result.current.clearError();
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('selectors', () => {
    it('should provide correct auth state', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        useAuthStore.setState({
          user: { id: '1', email: 'test@example.com' },
          isAuthenticated: true,
          isLoading: false,
        });
      });

      expect(result.current.user).toEqual({ id: '1', email: 'test@example.com' });
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });
  });
});