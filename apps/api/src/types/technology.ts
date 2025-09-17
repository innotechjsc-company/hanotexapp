// Technology and related types for HANOTEX platform

import {
  BaseEntity,
  TechnologyStatus,
  UserType,
  PricingType,
  IPType,
  PaginationParams,
} from "./common";

// Technology interfaces
export interface Technology extends BaseEntity {
  title: string;
  public_summary?: string;
  confidential_detail?: string;
  trl_level?: number;
  category_id?: string;
  submitter_id: string;
  status: TechnologyStatus;
  visibility_mode: string;
}

export interface TechnologyOwner {
  id: string;
  technology_id: string;
  owner_type: UserType;
  owner_name: string;
  ownership_percentage: number;
  created_at: Date;
}

export interface IntellectualProperty {
  id: string;
  technology_id: string;
  ip_type: IPType;
  ip_number?: string;
  status?: string;
  territory?: string;
  created_at: Date;
}

export interface LegalCertification {
  id: string;
  technology_id: string;
  protection_scope?: string[];
  standard_certifications?: string[];
  local_certification_url?: string;
  created_at: Date;
}

export interface Pricing {
  id: string;
  technology_id: string;
  pricing_type: PricingType;
  asking_price?: number;
  currency: string;
  price_type?: string;
  appraisal_purpose?: string;
  appraisal_scope?: string;
  appraisal_deadline?: Date;
  created_at: Date;
}

export interface InvestmentTransfer {
  id: string;
  technology_id: string;
  investment_stage?: string;
  commercialization_methods?: string[];
  transfer_methods?: string[];
  territory_scope?: string;
  financial_methods?: string[];
  usage_limitations?: string;
  current_partners?: string;
  potential_partners?: string;
  created_at: Date;
}

export interface AdditionalData {
  id: string;
  technology_id: string;
  test_results?: string;
  economic_social_impact?: string;
  financial_support_info?: string;
  created_at: Date;
}

// Technology search parameters
export interface TechnologySearchParams extends PaginationParams {
  query?: string;
  search?: string;
  category_id?: string;
  category?: string;
  trl_level?: number | string;
  status?: TechnologyStatus | string;
  user_type?: UserType | string;
  min_price?: number;
  max_price?: number;
  territory?: string;
}

// Technology create request
export interface TechnologyCreateRequest {
  title: string;
  public_summary?: string;
  confidential_detail?: string;
  trl_level?: number;
  category_id?: string;
  visibility_mode?: string;
  owners?: Omit<TechnologyOwner, "id" | "technology_id" | "created_at">[];
  ip_details?: Omit<
    IntellectualProperty,
    "id" | "technology_id" | "created_at"
  >[];
  pricing?: Omit<Pricing, "id" | "technology_id" | "created_at">;
  investment_transfer?: Omit<
    InvestmentTransfer,
    "id" | "technology_id" | "created_at"
  >;
}
