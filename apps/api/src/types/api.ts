// API Request/Response types for HANOTEX platform

import { UserType } from "./common";
import { IndividualProfile, CompanyProfile, ResearchProfile } from "./user";

// API Response interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Request interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  user_type: UserType;
  profile: Partial<IndividualProfile | CompanyProfile | ResearchProfile>;
}
