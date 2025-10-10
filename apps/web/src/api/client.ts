/**
 * PayloadCMS API Client
 * Client cơ bản để thực hiện các request đến PayloadCMS
 */

import {
  PAYLOAD_API_BASE_URL,
  DEFAULT_HEADERS,
  REQUEST_TIMEOUT,
  API_ENDPOINTS,
} from "./config";
import { localStorageService } from "../services/localstorage";

export interface ApiResponse<T = unknown> {
  data?: T;
  docs?: T[];
  totalDocs?: number;
  limit?: number;
  page?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  nextPage?: number | null;
  prevPage?: number | null;
  message?: string;
  errors?: Array<{
    message: string;
    field?: string;
  }>;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Array<{
    message: string;
    field?: string;
  }>;
}

interface AuthRefreshPayload {
  token?: string;
  user?: unknown;
  exp?: number;
  message?: string;
  errors?: Array<{
    message: string;
    field?: string;
  }>;
}

export class PayloadApiClient {
  private baseURL: string;
  private token: string | null = null;
  private refreshTokenPromise: Promise<string | null> | null = null;

  constructor(baseURL: string = PAYLOAD_API_BASE_URL || "") {
    this.baseURL = baseURL;
  }

  /**
   * Set authentication token
   */
  setToken(token: string) {
    this.token = token;
  }

  /**
   * Clear authentication token
   */
  clearToken() {
    this.token = null;
  }

  /**
   * Get headers with authentication if available
   */
  private getHeaders(
    customHeaders: Record<string, string> = {}
  ): Record<string, string> {
    const headers: Record<string, string> = {
      ...DEFAULT_HEADERS,
      ...customHeaders,
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Make HTTP request
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryAuth = true
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: this.getHeaders(options.headers as Record<string, string>),
    };

    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
    config.signal = controller.signal;

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      if (
        response.status === 401 &&
        retryAuth &&
        this.shouldAttemptTokenRefresh(endpoint)
      ) {
        let refreshed = false;

        try {
          const newToken = await this.refreshAccessToken();
          refreshed = Boolean(newToken);
        } catch {
          // Refresh failed, fall back to original response handling
        }

        if (refreshed) {
          return this.request<T>(endpoint, options, false);
        }
      }

      const data = (await this.parseResponseBody<ApiResponse<T>>(response)) ||
        ({} as ApiResponse<T>);

      if (!response.ok) {
        throw {
          message: data?.message || "Request failed",
          status: response.status,
          errors: data?.errors,
        } as ApiError;
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw {
            message: "Request timeout",
            status: 408,
          } as ApiError;
        }

        throw {
          message: error.message,
          status: 0,
        } as ApiError;
      }

      throw error;
    }
  }

  /**
   * GET request
   */
  async get<T>(
    endpoint: string,
    params?: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    let url = endpoint;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });

      if (searchParams.toString()) {
        url += `?${searchParams.toString()}`;
      }
    }

    return this.request<T>(url, { method: "GET" });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  private shouldAttemptTokenRefresh(endpoint: string): boolean {
    if (!this.token) return false;
    return endpoint !== API_ENDPOINTS.AUTH.REFRESH;
  }

  private async refreshAccessToken(): Promise<string | null> {
    if (!this.refreshTokenPromise) {
      this.refreshTokenPromise = this.performTokenRefresh().finally(() => {
        this.refreshTokenPromise = null;
      });
    }

    return this.refreshTokenPromise;
  }

  private async performTokenRefresh(): Promise<string | null> {
    const url = `${this.baseURL}${API_ENDPOINTS.AUTH.REFRESH}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: this.getHeaders(),
      });

      const data = (await this.parseResponseBody<AuthRefreshPayload>(
        response
      )) || { message: "" };

      if (!response.ok || !data?.token) {
        this.clearStoredAuthData();
        throw {
          message: data?.message || "Refresh token failed",
          status: response.status,
          errors: data?.errors,
        } as ApiError;
      }

      this.setToken(data.token);
      this.persistAuthData(data);

      return data.token ?? null;
    } catch (error) {
      this.clearStoredAuthData();
      throw error;
    }
  }

  private persistAuthData(authData: AuthRefreshPayload): void {
    if (!authData?.token) return;

    const ttl = authData.exp ? authData.exp * 1000 - Date.now() : undefined;
    const options = ttl && ttl > 0 ? { ttl } : undefined;

    const storageData = {
      token: authData.token,
      user: authData.user,
      exp: authData.exp,
    };

    localStorageService.set("auth_data", storageData, options);
    localStorageService.set("auth_token", authData.token, options);

    if (authData.user) {
      localStorageService.set("auth_user", authData.user, options);
    }

    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("payload_token", authData.token);
      } catch {
        // Ignore storage errors (e.g., quota exceeded)
      }
    }
  }

  private clearStoredAuthData(): void {
    this.clearToken();
    localStorageService.remove("auth_data");
    localStorageService.remove("auth_token");
    localStorageService.remove("auth_user");

    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem("payload_token");
      } catch {
        // Ignore storage errors
      }
    }
  }

  private async parseResponseBody<T>(response: Response): Promise<T | null> {
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("json")) {
      try {
        return (await response.json()) as T;
      } catch {
        return null;
      }
    }

    try {
      const text = await response.text();
      if (!text) return null;
      return { message: text } as unknown as T;
    } catch {
      return null;
    }
  }
}

// Default client instance
export const payloadApiClient = new PayloadApiClient();
