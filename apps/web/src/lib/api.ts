import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse, LoginRequest, RegisterRequest, TechnologySearchParams, UserSearchParams, TechnologyCreateRequest, BidRequest } from '@/types';

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    // Use local API routes when in development
    const baseURL = process.env.NODE_ENV === 'development' 
      ? '/api' // Use local Next.js API routes
      : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1');
      
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearToken();
          // Redirect to login if not already there
          if (typeof window !== 'undefined' && window.location && !window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );

    // Load token from localStorage on client side
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('hanotex_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('hanotex_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hanotex_token');
    }
  }

  getToken() {
    return this.token;
  }

  private async request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.request(config);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request({
      method: 'GET',
      url: '/health',
    });
  }

  // Authentication endpoints
  async login(credentials: LoginRequest) {
    const response = await this.request({
      method: 'POST',
      url: '/auth/login',
      data: credentials,
    });

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async register(userData: RegisterRequest) {
    return this.request({
      method: 'POST',
      url: '/auth/register',
      data: userData,
    });
  }

  async getCurrentUser() {
    return this.request({
      method: 'GET',
      url: '/auth/me',
    });
  }

  async logout() {
    const response = await this.request({
      method: 'POST',
      url: '/auth/logout',
    });
    this.clearToken();
    return response;
  }

  async refreshToken() {
    const response = await this.request({
      method: 'POST',
      url: '/auth/refresh',
    });

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  // Technology endpoints
  async getTechnologies(params?: TechnologySearchParams) {
    return this.request({
      method: 'GET',
      url: '/technologies',
      params,
    });
  }

  async getTechnology(id: string) {
    return this.request({
      method: 'GET',
      url: `/technologies/${id}`,
    });
  }

  async createTechnology(data: TechnologyCreateRequest) {
    return this.request({
      method: 'POST',
      url: '/technologies',
      data,
    });
  }

  async updateTechnology(id: string, data: Partial<TechnologyCreateRequest>) {
    return this.request({
      method: 'PUT',
      url: `/technologies/${id}`,
      data,
    });
  }

  async deleteTechnology(id: string) {
    return this.request({
      method: 'DELETE',
      url: `/technologies/${id}`,
    });
  }

  async submitTechnology(id: string) {
    return this.request({
      method: 'POST',
      url: `/technologies/${id}/submit`,
    });
  }

  // User endpoints
  async getUsers(params?: UserSearchParams) {
    return this.request({
      method: 'GET',
      url: '/users',
      params,
    });
  }

  async getUser(id: string) {
    return this.request({
      method: 'GET',
      url: `/users/${id}`,
    });
  }

  async updateUser(id: string, data: any) {
    return this.request({
      method: 'PUT',
      url: `/users/${id}`,
      data,
    });
  }

  async verifyUser(id: string) {
    return this.request({
      method: 'POST',
      url: `/users/${id}/verify`,
    });
  }

  async deactivateUser(id: string) {
    return this.request({
      method: 'POST',
      url: `/users/${id}/deactivate`,
    });
  }

  // Category endpoints
  async getCategories() {
    return this.request({
      method: 'GET',
      url: '/categories',
    });
  }

  async getCategory(id: string) {
    return this.request({
      method: 'GET',
      url: `/categories/${id}`,
    });
  }

  async getCategoryTechnologies(id: string, params?: { page?: number; limit?: number }) {
    return this.request({
      method: 'GET',
      url: `/categories/${id}/technologies`,
      params,
    });
  }

  // Auction endpoints
  async getAuctions(params?: { page?: number; limit?: number; sort?: string; order?: string }) {
    return this.request({
      method: 'GET',
      url: '/auctions',
      params,
    });
  }

  async getAuction(id: string) {
    return this.request({
      method: 'GET',
      url: `/auctions/${id}`,
    });
  }

  async createAuction(data: {
    technology_id: string;
    auction_type: string;
    start_price?: number;
    reserve_price?: number;
    start_time?: string;
    end_time?: string;
  }) {
    return this.request({
      method: 'POST',
      url: '/auctions',
      data,
    });
  }

  async placeBid(data: BidRequest) {
    return this.request({
      method: 'POST',
      url: `/auctions/${data.auction_id}/bid`,
      data,
    });
  }

  async getAuctionBids(auctionId: string, params?: { page?: number; limit?: number }) {
    return this.request({
      method: 'GET',
      url: `/auctions/${auctionId}/bids`,
      params,
    });
  }

  // File upload
  async uploadFile(file: File, technologyId: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('technology_id', technologyId);

    return this.request({
      method: 'POST',
      url: '/upload',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Search and filter utilities
  buildSearchParams(filters: Record<string, any>): URLSearchParams {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(item => params.append(key, item.toString()));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    return params;
  }

  // Error handling utilities
  getErrorMessage(error: any): string {
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }

  // Request status utilities
  isSuccess(response: ApiResponse): boolean {
    return response.success === true;
  }

  hasError(response: ApiResponse): boolean {
    return response.success === false;
  }

  getData<T>(response: ApiResponse<T>): T | undefined {
    return response.data;
  }

  getError(response: ApiResponse): string | undefined {
    return response.error;
  }

  getMessage(response: ApiResponse): string | undefined {
    return response.message;
  }

  getPagination(response: ApiResponse) {
    return response.pagination;
  }
}

// Create singleton instance
const apiClient = new ApiClient();

export default apiClient;

// Export individual methods for convenience
export const {
  healthCheck,
  login,
  register,
  getCurrentUser,
  logout,
  refreshToken,
  getTechnologies,
  getTechnology,
  createTechnology,
  updateTechnology,
  deleteTechnology,
  submitTechnology,
  getUsers,
  getUser,
  updateUser,
  verifyUser,
  deactivateUser,
  getCategories,
  getCategory,
  getCategoryTechnologies,
  getAuctions,
  getAuction,
  createAuction,
  placeBid,
  getAuctionBids,
  uploadFile,
  buildSearchParams,
  getErrorMessage,
  isSuccess,
  hasError,
  getData,
  getError,
  getMessage,
  getPagination,
  setToken,
  clearToken,
  getToken,
} = apiClient;

