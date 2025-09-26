// Base types and enums for HANOTEX platform

// Enum Types
export type UserType = "INDIVIDUAL" | "COMPANY" | "RESEARCH_INSTITUTION";
export type UserRole = "USER" | "ADMIN" | "MODERATOR" | "SUPPORT";
export type TechnologyStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE"
  | "INACTIVE";
export type AuctionStatus = "SCHEDULED" | "ACTIVE" | "ENDED" | "CANCELLED";
export type AuctionType = "ENGLISH" | "DUTCH" | "SEALED_BID";
export type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
export type PricingType = "APPRAISAL" | "ASK" | "AUCTION" | "OFFER";
export type IPType =
  | "PATENT"
  | "UTILITY_MODEL"
  | "INDUSTRIAL_DESIGN"
  | "TRADEMARK"
  | "SOFTWARE_COPYRIGHT"
  | "TRADE_SECRET";

// Base interfaces
export interface BaseEntity {
  id: string;
  created_at: Date;
  updated_at: Date;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "ASC" | "DESC";
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}