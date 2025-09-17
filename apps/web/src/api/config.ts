/**
 * PayloadCMS API Configuration
 * Cấu hình cơ bản để kết nối với PayloadCMS
 */

// Base URL của PayloadCMS API
export const PAYLOAD_API_BASE_URL =
  process.env.NEXT_PUBLIC_PAYLOAD_API_URL || "http://localhost:4000/api";

// API endpoints cho các collections
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/users/login",
    LOGOUT: "/users/logout",
    REFRESH: "/users/refresh-token",
    ME: "/users/me",
    REGISTER: "/users",
    FORGOT_PASSWORD: "/users/forgot-password",
    RESET_PASSWORD: "/users/reset-password",
  },

  // Collections
  USERS: "/users",
  TECHNOLOGIES: "/technologies",
  CATEGORIES: "/categories",
  COMPANIES: "/companies",
  RESEARCH_INSTITUTIONS: "/research-institutions",
  AUCTIONS: "/auctions",
  BIDS: "/bids",
  TRANSACTIONS: "/transactions",
  NOTIFICATIONS: "/notifications",
  MEDIA: "/media",
} as const;

// HTTP Methods
export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
} as const;

// Default headers
export const DEFAULT_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

// Request timeout (milliseconds)
export const REQUEST_TIMEOUT = 10000;

// Pagination defaults
export const PAGINATION_DEFAULTS = {
  limit: 10,
  page: 1,
};

// Status codes
export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
