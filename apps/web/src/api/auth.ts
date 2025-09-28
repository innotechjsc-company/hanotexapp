/**
 * Authentication API functions
 * Các function để xử lý authentication với PayloadCMS
 */

import { payloadApiClient } from "./client";
import { API_ENDPOINTS } from "./config";
import { localStorageService } from "../services/localstorage";

export interface LoginCredentials {
  email: string;
  password: string;
}

export type UserType = "INDIVIDUAL" | "COMPANY" | "RESEARCH_INSTITUTION";

export type UserRole = "USER" | "ADMIN" | "MODERATOR" | "SUPPORT";

export interface RegisterData {
  email: string;
  password: string;
  full_name?: string;
  user_type?: UserType;
  role?: UserRole;
}

export interface User {
  id: string;
  email: string;
  user_type: UserType;
  role: UserRole;
  is_verified: boolean;
  is_active: boolean;
  full_name?: string;
  id_number?: string;
  phone?: string;
  profession?: string;
  bank_account?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
  exp: number;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

/**
 * Login user
 */
export async function login(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  const response = await payloadApiClient.post<AuthResponse>(
    API_ENDPOINTS.AUTH.LOGIN,
    credentials
  );

  // The response is the direct data, not wrapped in response.data
  const authData = response as unknown as AuthResponse;

  // Add defensive checks
  if (!authData) {
    throw new Error("Không nhận được phản hồi từ server");
  }

  if (!authData.token) {
    throw new Error("Token xác thực không hợp lệ");
  }

  if (!authData.user) {
    throw new Error("Thông tin người dùng không hợp lệ");
  }

  // Set token for future requests
  payloadApiClient.setToken(authData.token);

  // Store auth data using localStorageService - unified storage
  const storageData = {
    token: authData.token,
    user: authData.user,
    exp: authData.exp,
  };

  // Lưu token với TTL dựa trên exp (nếu có)
  const ttl = authData.exp ? authData.exp * 1000 - Date.now() : undefined;

  // Chỉ lưu một key duy nhất cho tất cả auth data
  localStorageService.set("auth_data", storageData, { ttl });

  // Tạm thời giữ các key riêng lẻ để tương thích với code hiện tại
  localStorageService.set("auth_token", authData.token, { ttl });
  localStorageService.set("auth_user", authData.user, { ttl });

  // Vẫn giữ token trong localStorage cũ để tương thích
  if (typeof window !== "undefined") {
    localStorage.setItem("payload_token", authData.token);
  }

  return authData;
}

/**
 * Register new user
 */
export async function register(userData: RegisterData): Promise<AuthResponse> {
  const response = await payloadApiClient.post<AuthResponse>(
    API_ENDPOINTS.AUTH.REGISTER,
    userData
  );

  return response as unknown as AuthResponse;
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  try {
    await payloadApiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  } finally {
    // Clear token regardless of API response
    payloadApiClient.clearToken();

    // Remove auth data from localStorageService
    localStorageService.remove("auth_data");

    // Xóa các key riêng lẻ để tương thích
    localStorageService.remove("auth_token");
    localStorageService.remove("auth_user");

    // Remove token from localStorage (để tương thích)
    if (typeof window !== "undefined") {
      localStorage.removeItem("payload_token");
    }
  }
}

/**
 * Get current user info
 */
export async function getCurrentUser(): Promise<AuthResponse> {
  const response = await payloadApiClient.get<User>(API_ENDPOINTS.AUTH.ME);
  return response as unknown as AuthResponse;
}

/**
 * Refresh authentication token
 */
export async function refreshToken(): Promise<AuthResponse> {
  const response = await payloadApiClient.post<AuthResponse>(
    API_ENDPOINTS.AUTH.REFRESH
  );

  // The response is the direct data, not wrapped in response.data
  const authData = response as unknown as AuthResponse;

  if (authData?.token) {
    payloadApiClient.setToken(authData.token);

    // Update auth data using localStorageService - unified storage
    const storageData = {
      token: authData.token,
      user: authData.user,
      exp: authData.exp,
    };

    // Lưu token với TTL dựa trên exp (nếu có)
    const ttl = authData.exp ? authData.exp * 1000 - Date.now() : undefined;

    // Chỉ lưu một key duy nhất cho tất cả auth data
    localStorageService.set("auth_data", storageData, { ttl });

    // Tạm thời giữ các key riêng lẻ để tương thích với code hiện tại
    localStorageService.set("auth_token", authData.token, { ttl });
    localStorageService.set("auth_user", authData.user, { ttl });

    // Vẫn giữ token trong localStorage cũ để tương thích
    if (typeof window !== "undefined") {
      localStorage.setItem("payload_token", authData.token);
    }
  }

  return authData;
}

/**
 * Send forgot password email
 */
export async function forgotPassword(
  data: ForgotPasswordData
): Promise<{ message: string }> {
  const response = await payloadApiClient.post<{ message: string }>(
    API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
    data
  );

  return response as unknown as { message: string };
}

/**
 * Reset password with token
 */
export async function resetPassword(
  data: ResetPasswordData
): Promise<{ message: string }> {
  const response = await payloadApiClient.post<{ message: string }>(
    API_ENDPOINTS.AUTH.RESET_PASSWORD,
    data
  );

  return response as unknown as { message: string };
}

/**
 * Initialize auth from stored token
 */
export function initializeAuth(): void {
  // Thử lấy token từ localStorageService trước
  const token = localStorageService.get<string>("auth_token");
  if (token) {
    payloadApiClient.setToken(token);
    return;
  }

  // Fallback: lấy từ localStorage cũ để tương thích
  if (typeof window !== "undefined") {
    const fallbackToken = localStorage.getItem("payload_token");
    if (fallbackToken) {
      payloadApiClient.setToken(fallbackToken);
    }
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  // Kiểm tra token từ localStorageService trước
  const token = localStorageService.get<string>("auth_token");
  if (token) return true;

  // Fallback: kiểm tra localStorage cũ để tương thích
  if (typeof window !== "undefined") {
    return !!localStorage.getItem("payload_token");
  }
  return false;
}

/**
 * Lấy thông tin user đã lưu trong localStorage
 */
export function getStoredUser(): User | null {
  return localStorageService.get<User>("auth_user");
}

/**
 * Lấy token đã lưu trong localStorage
 */
export function getStoredToken(): string | null {
  return localStorageService.get<string>("auth_token");
}

/**
 * Lấy toàn bộ auth data đã lưu trong localStorage
 */
export function getStoredAuthData(): AuthResponse | null {
  return localStorageService.get<AuthResponse>("auth_data");
}

/**
 * Kiểm tra xem auth data có hợp lệ không (tồn tại và chưa hết hạn)
 */
export function hasValidAuthData(): boolean {
  const authData = getStoredAuthData();
  if (!authData || !authData.token || !authData.user) {
    return false;
  }

  // Kiểm tra TTL nếu có exp
  if (authData.exp) {
    const currentTime = Date.now() / 1000;
    return authData.exp > currentTime;
  }

  return true;
}
