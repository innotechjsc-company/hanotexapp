// User Types
export type UserType = 'INDIVIDUAL' | 'COMPANY' | 'RESEARCH_INSTITUTION';
export type UserRole = 'USER' | 'ADMIN' | 'MODERATOR' | 'SUPPORT';
export type TechnologyStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'INACTIVE';
export type AuctionStatus = 'SCHEDULED' | 'ACTIVE' | 'ENDED' | 'CANCELLED';
export type AuctionType = 'ENGLISH' | 'DUTCH' | 'SEALED_BID';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
export type PricingType = 'APPRAISAL' | 'ASK' | 'AUCTION' | 'OFFER';
export type IPType = 'PATENT' | 'UTILITY_MODEL' | 'INDUSTRIAL_DESIGN' | 'TRADEMARK' | 'SOFTWARE_COPYRIGHT' | 'TRADE_SECRET';

// Base interfaces
export interface BaseEntity {
  id: string;
  created_at: Date;
  updated_at: Date;
}

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

// Category interface
export interface Category extends BaseEntity {
  name: string;
  code: string;
  parent_id?: string;
  level: number;
  description?: string;
}

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

export interface TechnologyOwner extends BaseEntity {
  technology_id: string;
  owner_type: UserType;
  owner_name: string;
  ownership_percentage: number;
}

export interface IntellectualProperty extends BaseEntity {
  technology_id: string;
  ip_type: IPType;
  ip_number?: string;
  status?: string;
  territory?: string;
}

export interface LegalCertification extends BaseEntity {
  technology_id: string;
  protection_scope?: string[];
  standard_certifications?: string[];
  local_certification_url?: string;
}

export interface Pricing extends BaseEntity {
  technology_id: string;
  pricing_type: PricingType;
  asking_price?: number;
  currency: string;
  price_type?: string;
  appraisal_purpose?: string;
  appraisal_scope?: string;
  appraisal_deadline?: Date;
}

export interface InvestmentTransfer extends BaseEntity {
  technology_id: string;
  investment_stage?: string;
  commercialization_methods?: string[];
  transfer_methods?: string[];
  territory_scope?: string;
  financial_methods?: string[];
  usage_limitations?: string;
  current_partners?: string;
  potential_partners?: string;
}

// Auction interfaces
export interface Auction extends BaseEntity {
  technology_id: string;
  auction_type: AuctionType;
  start_price?: number;
  reserve_price?: number;
  current_price?: number;
  start_time?: Date;
  end_time?: Date;
  status: AuctionStatus;
}

export interface Bid extends BaseEntity {
  auction_id: string;
  bidder_id: string;
  bid_amount: number;
  bid_time: Date;
  is_winning: boolean;
}

// Transaction interface
export interface Transaction extends BaseEntity {
  technology_id?: string;
  buyer_id?: string;
  seller_id?: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  payment_method?: string;
  transaction_fee?: number;
  completed_at?: Date;
}

// Document interface
export interface Document extends BaseEntity {
  technology_id: string;
  filename: string;
  original_filename: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  is_public: boolean;
  uploaded_by?: string;
}

// Notification interface
export interface Notification extends BaseEntity {
  user_id: string;
  title: string;
  message: string;
  type?: string;
  is_read: boolean;
}

// Additional data interface
export interface AdditionalData extends BaseEntity {
  technology_id: string;
  test_results?: string;
  economic_social_impact?: string;
  financial_support_info?: string;
}

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

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
}

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

export interface TechnologyCreateRequest {
  title: string;
  public_summary?: string;
  confidential_detail?: string;
  trl_level?: number;
  category_id?: string;
  visibility_mode?: string;
  owners?: Omit<TechnologyOwner, 'id' | 'technology_id' | 'created_at' | 'updated_at'>[];
  ip_details?: Omit<IntellectualProperty, 'id' | 'technology_id' | 'created_at' | 'updated_at'>[];
  pricing?: Omit<Pricing, 'id' | 'technology_id' | 'created_at' | 'updated_at'>;
  investment_transfer?: Omit<InvestmentTransfer, 'id' | 'technology_id' | 'created_at' | 'updated_at'>;
}

export interface BidRequest {
  auction_id: string;
  bid_amount: number;
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

// File upload interface
export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
}

// Search interfaces
export interface TechnologySearchParams extends PaginationParams {
  query?: string;
  category_id?: string;
  trl_level?: number;
  status?: TechnologyStatus;
  user_type?: UserType;
  min_price?: number;
  max_price?: number;
  territory?: string;
}

export interface UserSearchParams extends PaginationParams {
  query?: string;
  user_type?: UserType;
  role?: UserRole;
  is_verified?: boolean;
  is_active?: boolean;
}

