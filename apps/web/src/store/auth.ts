import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect } from 'react';
import { User, AuthState, LoginRequest, RegisterRequest } from '@/types';
import apiClient from '@/lib/api';

interface AuthStore extends AuthState {
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userType: string, profile: any) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
          });

          if (result?.error) {
            set({ isLoading: false });
            throw new Error('Đăng nhập thất bại');
          }

          // Get user data after successful login
          const response = await apiClient.getCurrentUser();
          if (response.success && response.data) {
            set({
              user: response.data.user,
              token: response.data.token,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error: any) {
          console.error('Login error:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (email: string, password: string, userType: string, profile: any) => {
        set({ isLoading: true });
        
        try {
          const userData = {
            email,
            password,
            user_type: userType,
            profile
          };
          
          const response = await apiClient.register(userData);
          
          if (response.success) {
            set({ isLoading: false });
          } else {
            set({ isLoading: false });
            throw new Error(response.error || 'Đăng ký thất bại');
          }
        } catch (error: any) {
          console.error('Registration error:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        signOut({ redirect: false });
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      refreshUser: async () => {
        const { token } = get();
        if (!token) return;

        try {
          const response = await apiClient.getCurrentUser();
          
          if (response.success && response.data) {
            set({ user: response.data.user });
          }
        } catch (error) {
          console.error('Refresh user error:', error);
          // If refresh fails, logout user
          get().logout();
        }
      },

      updateUser: (userData: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...userData } });
        }
      },

      clearError: () => {
        set({ isLoading: false });
      },
    }),
    {
      name: 'hanotex-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Hook to sync NextAuth session with Zustand store
export const useAuthSync = () => {
  const { data: session, status } = useSession();
  const { user, isAuthenticated, token } = useAuthStore();

  useEffect(() => {
    // Sync NextAuth session with Zustand store
    if (status === 'authenticated' && session?.user) {
      // Only sync if the data has actually changed
      const newUser = session.user as any;
      const newToken = session.apiToken || null;
      
      if (!isAuthenticated || user?.id !== newUser?.id || token !== newToken) {
        useAuthStore.setState({
          user: newUser,
          isAuthenticated: true,
          token: newToken,
        });
      }
    } else if (status === 'unauthenticated' && isAuthenticated) {
      // Only clear if currently authenticated
      useAuthStore.setState({
        user: null,
        isAuthenticated: false,
        token: null,
      });
    }
  }, [status, session, user, isAuthenticated, token]);
};

// Selectors
export const useAuth = () => {
  const { data: session, status } = useSession();
  const storeState = useAuthStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
  }));

  // Use NextAuth session as source of truth
  return {
    user: session?.user || storeState.user,
    isAuthenticated: status === 'authenticated' || storeState.isAuthenticated,
    isLoading: status === 'loading' || storeState.isLoading,
  };
};

export const useAuthActions = () => useAuthStore((state) => ({
  login: state.login,
  register: state.register,
  logout: state.logout,
  refreshUser: state.refreshUser,
  updateUser: state.updateUser,
  clearError: state.clearError,
}));

export const useUser = () => {
  const { data: session } = useSession();
  const storeUser = useAuthStore((state) => state.user);
  return session?.user || storeUser;
};

export const useIsAuthenticated = () => {
  const { status } = useSession();
  const storeAuth = useAuthStore((state) => state.isAuthenticated);
  return status === 'authenticated' || storeAuth;
};

export const useIsLoading = () => {
  const { status } = useSession();
  const storeLoading = useAuthStore((state) => state.isLoading);
  return status === 'loading' || storeLoading;
};

