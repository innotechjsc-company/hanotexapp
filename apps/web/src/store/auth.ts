import { create } from "zustand";
import * as authApi from "@/api/auth";
import { RegisterData, User, UserType } from "@/api/auth";
import { localStorageService } from "@/services/localstorage";
import { payloadApiClient } from "@/api/client";

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
export const useAuthStore = create<AuthStore>()((set, get) => ({
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

      // Set token for payloadApiClient
      payloadApiClient.setToken(response.token);

      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        user: null,
        token: null,
        isAuthenticated: false,
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
    console.log("[Auth Store] Starting logout...");
    set({ isLoading: true });

    try {
      await authApi.logout(); // Đã xóa localStorage bên trong authApi.logout()
      console.log("[Auth Store] API logout successful");
    } catch (error) {
      console.error("Logout error:", error);
      // Vẫn clear state dù có lỗi từ server
    } finally {
      // Clear state
      console.log("[Auth Store] Clearing auth state...");

      // Clear token from payloadApiClient
      payloadApiClient.clearToken();

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
      console.log("[Auth Store] Logout complete");
    }
  },

  // Refresh token action
  refreshToken: async () => {
    const { token } = get();
    if (!token) throw new Error("Không có token để refresh");

    try {
      const response = await authApi.refreshToken();

      // Set token for payloadApiClient
      payloadApiClient.setToken(response.token);

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
      const res = await authApi.getCurrentUser();
      set({
        token: res.token,
        user: res.user,
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
    // Sử dụng hasValidAuthData để check tính hợp lệ của auth data
    return !authApi.hasValidAuthData();
  },

  // Load user from localStorage only
  loadUserFromStorage: () => {
    console.log("[Auth Store] Loading user from storage...");

    // Sử dụng unified auth data thay vì load riêng lẻ
    const authData = authApi.getStoredAuthData();

    console.log("[Auth Store] Stored auth data:", {
      hasAuthData: !!authData,
      hasUser: !!authData?.user,
      hasToken: !!authData?.token,
      userEmail: authData?.user?.email,
    });

    if (authData?.user && authData?.token) {
      console.log("[Auth Store] Setting authenticated state from storage");

      // Set token for payloadApiClient
      payloadApiClient.setToken(authData.token);

      set({
        user: authData.user,
        token: authData.token,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    }

    console.log("[Auth Store] No valid stored data found");
    return false;
  },

  // Initialize auth state from localStorage
  initialize: () => {
    console.log("[Auth Store] Starting initialization...");

    // Initialize API client first
    authApi.initializeAuth();

    // Check if we have valid auth data (using TTL-aware check)
    const hasValidAuth = authApi.hasValidAuthData();

    if (hasValidAuth) {
      console.log("[Auth Store] Valid auth data found, loading user");
      // Load user data from storage
      const hasStoredData = get().loadUserFromStorage();

      if (hasStoredData) {
        console.log("[Auth Store] User loaded, refreshing in background");
        // Refresh user trong background để đảm bảo data mới nhất
        get()
          .refreshUser()
          .catch((error) => {
            console.warn("Background user refresh failed:", error);
            // Chỉ logout nếu lỗi 401 (unauthorized)
            if (error.status === 401) {
              get().logout();
            }
          });
      }
    } else {
      console.log("[Auth Store] No valid auth data, clearing state");
      // Không có dữ liệu hợp lệ hoặc token hết hạn
      get().logout();
    }
  },
}));

// ==============================================================================
// HOOKS & SELECTORS - Đơn giản hóa việc sử dụng auth store
// ==============================================================================

/**
 * Hook chính để sử dụng authentication state và actions
 * Trả về tất cả state và actions cần thiết
 */
export const useAuth = () => {
  const authState = useAuthStore((state) => ({
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

  return authState;
};

/**
 * Hook chỉ lấy user data
 */
export const useUser = () => {
  const user = useAuthStore((state) => state.user);

  return user;
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
