import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as authApi from "@/api/auth";
import { RegisterData, User, UserType } from "@/api/auth";
import { localStorageService } from "@/services/localstorage";

// Định nghĩa types cho User

// Định nghĩa interface cho AuthState
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Định nghĩa interface cho AuthStore
interface AuthStore extends AuthState {
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
  // Forgot password actions
  forgotPassword: (email: string) => Promise<{ message: string }>;
  resetPassword: (
    token: string,
    password: string
  ) => Promise<{ message: string }>;
  // Helper methods
  isTokenExpired: () => boolean;
  initialize: () => void;
  loadUserFromStorage: () => boolean;
}

// Tạo auth store với Zustand
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Login action
      login: async (email: string, password: string) => {
        set({ isLoading: true });

        try {
          const response = await authApi.login({ email, password });
          
          // Add defensive checks
          if (!response) {
            throw new Error("Không nhận được phản hồi từ server");
          }
          
          if (!response.user) {
            throw new Error("Thông tin người dùng không hợp lệ");
          }
          
          if (!response.token) {
            throw new Error("Token xác thực không hợp lệ");
          }

          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });

          // Đồng bộ với localStorage (authApi.login đã làm rồi nhưng để đảm bảo)
          // localStorageService.set('auth_user', userData);
          // localStorageService.set('auth_token', response.token);
        } catch (error: any) {
          set({ 
            isLoading: false,
            user: null,
            token: null,
            isAuthenticated: false
          });
          console.error("Login error:", error);
          throw new Error(error.message || "Đăng nhập thất bại");
        }
      },

      // Register action
      register: async (userData: RegisterData) => {
        set({ isLoading: true });

        try {
          await authApi.register(userData);
          set({ isLoading: false });
        } catch (error: any) {
          set({ isLoading: false });
          console.error("Registration error:", error);
          throw new Error(error.message || "Đăng ký thất bại");
        }
      },

      // Logout action
      logout: async () => {
        console.log('[Auth Store] Starting logout...');
        set({ isLoading: true });

        try {
          await authApi.logout(); // Đã xóa localStorage bên trong authApi.logout()
          console.log('[Auth Store] API logout successful');
        } catch (error) {
          console.error("Logout error:", error);
          // Vẫn clear state dù có lỗi từ server
        } finally {
          // Clear state
          console.log('[Auth Store] Clearing auth state...');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });

          // Đảm bảo xóa hết dữ liệu localStorage (backup)
          localStorageService.remove("auth_user");
          localStorageService.remove("auth_token");
          localStorageService.remove("auth_data");
          console.log('[Auth Store] Logout complete');
        }
      },

      // Refresh token action
      refreshToken: async () => {
        const { token } = get();
        if (!token) throw new Error("Không có token để refresh");

        try {
          const response = await authApi.refreshToken();

          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
          });
        } catch (error: any) {
          console.error("Refresh token error:", error);
          // Nếu refresh thất bại, logout user
          await get().logout();
          throw error;
        }
      },

      // Refresh user data
      refreshUser: async () => {
        const { token } = get();
        if (!token) return;

        try {
          const user = await authApi.getCurrentUser();
          set({
            user: user,
          });
        } catch (error: any) {
          console.error("Refresh user error:", error);
          // Nếu token không hợp lệ, logout user
          if (error.status === 401) {
            await get().logout();
          }
          throw error;
        }
      },

      // Update user locally
      updateUser: (userData: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...userData } });
        }
      },

      // Clear error state
      clearError: () => {
        set({ isLoading: false });
      },

      // Forgot password
      forgotPassword: async (email: string) => {
        set({ isLoading: true });

        try {
          const response = await authApi.forgotPassword({ email });
          set({ isLoading: false });
          return response;
        } catch (error: any) {
          set({ isLoading: false });
          console.error("Forgot password error:", error);
          throw new Error(error.message || "Gửi email khôi phục thất bại");
        }
      },

      // Reset password
      resetPassword: async (token: string, password: string) => {
        set({ isLoading: true });

        try {
          const response = await authApi.resetPassword({ token, password });
          set({ isLoading: false });
          return response;
        } catch (error: any) {
          set({ isLoading: false });
          console.error("Reset password error:", error);
          throw new Error(error.message || "Đặt lại mật khẩu thất bại");
        }
      },

      // Check if token is expired (helper method)
      isTokenExpired: () => {
        let token = get().token;

        // Nếu không có token trong state, thử lấy từ localStorage
        if (!token) {
          token = localStorageService.get<string>("auth_token");
        }

        if (!token) return true;

        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const currentTime = Date.now() / 1000;
          return payload.exp < currentTime;
        } catch {
          return true;
        }
      },

      // Load user from localStorage only
      loadUserFromStorage: () => {
        console.log('[Auth Store] Loading user from storage...');
        const storedUser = localStorageService.get<User>("auth_user");
        const storedToken = localStorageService.get<string>("auth_token");
        
        console.log('[Auth Store] Stored data:', { 
          hasUser: !!storedUser, 
          hasToken: !!storedToken,
          userEmail: storedUser?.email 
        });

        if (storedUser && storedToken) {
          console.log('[Auth Store] Setting authenticated state from storage');
          set({
            user: storedUser,
            token: storedToken,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        }
        
        console.log('[Auth Store] No valid stored data found');
        return false;
      },

      // Initialize auth state from localStorage
      initialize: () => {
        console.log('[Auth Store] Starting initialization...');
        
        authApi.initializeAuth();

        // Lấy dữ liệu từ localStorage trước
        const hasStoredData = get().loadUserFromStorage();
        console.log('[Auth Store] Has stored data:', hasStoredData);

        // Check if we have a valid token
        const isApiAuthenticated = authApi.isAuthenticated();
        const isTokenExpired = get().isTokenExpired();
        
        console.log('[Auth Store] Auth check:', { 
          isApiAuthenticated, 
          isTokenExpired, 
          hasStoredData 
        });

        if (isApiAuthenticated && !isTokenExpired) {
          console.log('[Auth Store] Valid token found');
          // Nếu đã có user trong localStorage, không cần gọi API ngay
          // Chỉ refresh user trong background để đảm bảo data mới nhất
          if (hasStoredData) {
            console.log('[Auth Store] Using stored data, refreshing in background');
            // Refresh user data trong background (không block UI)
            get()
              .refreshUser()
              .catch((error) => {
                console.warn("Background user refresh failed:", error);
                // Nếu refresh thất bại nhưng vẫn có stored user, giữ nguyên
                // Chỉ logout nếu lỗi 401 (unauthorized)
                if (error.status === 401) {
                  get().logout();
                }
              });
          } else {
            console.log('[Auth Store] No stored data, fetching user');
            // Nếu không có stored user, cần gọi API để lấy
            get()
              .refreshUser()
              .catch(() => {
                console.log('[Auth Store] Failed to fetch user, logging out');
                // If failed, clear the auth state
                get().logout();
              });
          }
        } else {
          console.log('[Auth Store] No valid token, clearing auth state');
          // Clear invalid auth state - but don't await it to avoid blocking
          get().logout().finally(() => {
            console.log('[Auth Store] Final state after logout:', {
              isAuthenticated: get().isAuthenticated,
              isLoading: get().isLoading,
              user: get().user
            });
          });
        }
        
        console.log('[Auth Store] Initialization complete, current state:', {
          isAuthenticated: get().isAuthenticated,
          isLoading: get().isLoading,
          user: !!get().user
        });
      },
    }),
    {
      name: "hanotex-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// ==============================================================================
// HOOKS & SELECTORS - Đơn giản hóa việc sử dụng auth store
// ==============================================================================

/**
 * Hook chính để sử dụng authentication state và actions
 * Trả về tất cả state và actions cần thiết
 */
export const useAuth = () => {
  return useAuthStore((state) => ({
    // State
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,

    // Actions
    login: state.login,
    register: state.register,
    logout: state.logout,
    refreshToken: state.refreshToken,
    refreshUser: state.refreshUser,
    updateUser: state.updateUser,
    clearError: state.clearError,
    forgotPassword: state.forgotPassword,
    resetPassword: state.resetPassword,

    // Utilities
    isTokenExpired: state.isTokenExpired,
    initialize: state.initialize,
    loadUserFromStorage: state.loadUserFromStorage,
  }));
};

/**
 * Hook chỉ lấy user data
 */
export const useUser = () => {
  return useAuthStore((state) => state.user);
};

/**
 * Hook chỉ lấy authentication status
 */
export const useIsAuthenticated = () => {
  return useAuthStore((state) => state.isAuthenticated);
};

/**
 * Hook chỉ lấy loading state
 */
export const useIsLoading = () => {
  return useAuthStore((state) => state.isLoading);
};

/**
 * Hook chỉ lấy auth actions (không có state)
 * Useful khi component chỉ cần actions mà không cần re-render khi state thay đổi
 */
export const useAuthActions = () => {
  return useAuthStore((state) => ({
    login: state.login,
    register: state.register,
    logout: state.logout,
    refreshToken: state.refreshToken,
    refreshUser: state.refreshUser,
    updateUser: state.updateUser,
    clearError: state.clearError,
    forgotPassword: state.forgotPassword,
    resetPassword: state.resetPassword,
    initialize: state.initialize,
    loadUserFromStorage: state.loadUserFromStorage,
  }));
};

/**
 * Hook để check xem user có role cụ thể không
 */
export const useHasRole = (role: string) => {
  return useAuthStore((state) => state.user?.role === role);
};

/**
 * Hook để check xem user có user_type cụ thể không
 */
export const useHasUserType = (userType: UserType) => {
  return useAuthStore((state) => state.user?.user_type === userType);
};

/**
 * Hook để check xem user đã verified chưa
 */
export const useIsVerified = () => {
  return useAuthStore((state) => state.user?.is_verified || false);
};

/**
 * Hook để check xem user có active không
 */
export const useIsActive = () => {
  return useAuthStore((state) => state.user?.is_active || false);
};

// ==============================================================================
// UTILITY FUNCTIONS
// ==============================================================================

/**
 * Initialize auth store khi app khởi động
 * Gọi function này trong _app.tsx hoặc layout component
 */
export const initializeAuth = () => {
  useAuthStore.getState().initialize();
};

/**
 * Get current auth state (không phải hook)
 * Useful cho việc sử dụng bên ngoài React components
 */
export const getAuthState = () => {
  const state = useAuthStore.getState();
  return {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
  };
};

/**
 * Check if user is authenticated (không phải hook)
 */
export const isUserAuthenticated = () => {
  return useAuthStore.getState().isAuthenticated;
};

/**
 * Get current user (không phải hook)
 */
export const getCurrentUser = () => {
  return useAuthStore.getState().user;
};

/**
 * Load user from localStorage (không phải hook)
 * Trả về true nếu load thành công
 */
export const loadUserFromStorage = () => {
  return useAuthStore.getState().loadUserFromStorage();
};
