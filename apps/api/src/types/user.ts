// User and Profile types for HANOTEX platform

import { BaseEntity, UserType, UserRole } from "./common";

// User interfaces
export interface User extends BaseEntity {
  email: string;
  password_hash: string;
  user_type: UserType;
  role: UserRole;
  is_verified: boolean;
  is_active: boolean;
}

export interface IndividualProfile extends BaseEntity {
  user_id: string;
  full_name: string;
  id_number?: string;
  phone?: string;
  profession?: string;
  bank_account?: string;
}

export interface CompanyProfile extends BaseEntity {
  user_id: string;
  company_name: string;
  tax_code?: string;
  business_license?: string;
  legal_representative?: string;
  contact_email?: string;
  production_capacity?: string;
}

export interface ResearchProfile extends BaseEntity {
  user_id: string;
  institution_name: string;
  institution_code?: string;
  governing_body?: string;
  research_task_code?: string;
  acceptance_report?: string;
  research_group?: string;
}

// JWT Payload interface
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  userType: UserType;
  iat?: number;
  exp?: number;
}

// User search parameters
export interface UserSearchParams {
  query?: string;
  user_type?: UserType;
  role?: UserRole;
  is_verified?: boolean;
  is_active?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
  order?: "ASC" | "DESC";
}
