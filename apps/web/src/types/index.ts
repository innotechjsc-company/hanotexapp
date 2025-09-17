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
  created_at: string;
  updated_at: string;
}

// User interfaces
export interface User extends BaseEntity {
  email: string;
  user_type: UserType;
  role: UserRole;
  is_verified: boolean;
  is_active: boolean;
  profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface IndividualProfile extends UserProfile {
  full_name: string;
  id_number?: string;
  phone?: string;
  profession?: string;
  bank_account?: string;
}

export interface CompanyProfile extends UserProfile {
  company_name: string;
  tax_code?: string;
  business_license?: string;
  legal_representative?: string;
  contact_email?: string;
  production_capacity?: string;
}

export interface ResearchProfile extends UserProfile {
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
  children?: Category[];
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
  category_name?: string;
  category_code?: string;
  submitter_email?: string;
  submitter_type?: UserType;
  asking_price?: number;
  currency?: string;
  pricing_type?: PricingType;
  owners?: TechnologyOwner[];
  intellectual_properties?: IntellectualProperty[];
  pricing?: Pricing;
  investment_transfer?: InvestmentTransfer;
  documents?: Document[];
  auctions?: Auction[];
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
  appraisal_deadline?: string;
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
  start_time?: string;
  end_time?: string;
  status: AuctionStatus;
  technology_title?: string;
  trl_level?: number;
  submitter_email?: string;
  submitter_type?: UserType;
  bids?: Bid[];
}

export interface Bid extends BaseEntity {
  auction_id: string;
  bidder_id: string;
  bid_amount: number;
  bid_time: string;
  is_winning: boolean;
  bidder_email?: string;
  bidder_type?: UserType;
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
  completed_at?: string;
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

// NextAuth types
export interface NextAuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  userType: string;
  isVerified: boolean;
  token?: string;
}

export interface NextAuthSession {
  user: NextAuthUser;
  accessToken?: string;
  apiToken?: string;
  expires: string;
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
export interface TechnologySearchParams {
  query?: string;
  category_id?: string;
  trl_level?: number;
  status?: TechnologyStatus;
  user_type?: UserType;
  min_price?: number;
  max_price?: number;
  territory?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
}

export interface UserSearchParams {
  query?: string;
  user_type?: UserType;
  role?: UserRole;
  is_verified?: boolean;
  is_active?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
}

// Form interfaces
export interface TechnologyFormData {
  // Step 1: Actor Information
  actor_type: UserType;
  actor_profile: Partial<IndividualProfile | CompanyProfile | ResearchProfile>;
  
  // Step 2: Owner Information
  owners: Array<{
    owner_type: UserType;
    owner_name: string;
    ownership_percentage: number;
  }>;
  
  // Step 3: Legal & Territory
  protection_scope: string[];
  standard_certifications: string[];
  local_certification_url?: string;
  
  // Step 4: Technology Information
  title: string;
  public_summary: string;
  confidential_detail: string;
  trl_level: number;
  category_id: string;
  
  // Step 5: Intellectual Property
  ip_details: Array<{
    ip_type: IPType;
    ip_number?: string;
    status?: string;
    territory?: string;
  }>;
  
  // Step 6: Investment & Transfer
  investment_stage?: string;
  commercialization_methods: string[];
  transfer_methods: string[];
  territory_scope?: string;
  financial_methods: string[];
  usage_limitations?: string;
  current_partners?: string;
  potential_partners?: string;
  
  // Step 7: Display Policy & NDA
  visibility_mode: string;
  
  // Step 8: Pricing
  pricing_type: PricingType;
  asking_price?: number;
  currency: string;
  price_type?: string;
  appraisal_purpose?: string;
  appraisal_scope?: string;
  appraisal_deadline?: string;
  
  // Step 9: Additional Data
  test_results?: string;
  economic_social_impact?: string;
  financial_support_info?: string;
}

// UI State interfaces
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface TechnologyState {
  technologies: Technology[];
  currentTechnology: Technology | null;
  categories: Category[];
  searchParams: TechnologySearchParams;
  isLoading: boolean;
  error: string | null;
}

export interface AuctionState {
  auctions: Auction[];
  currentAuction: Auction | null;
  bids: Bid[];
  isLoading: boolean;
  error: string | null;
}

// Component Props interfaces
export interface TechnologyCardProps {
  technology: Technology;
  showActions?: boolean;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export interface SearchFiltersProps {
  onFiltersChange: (filters: TechnologySearchParams) => void;
  initialFilters?: TechnologySearchParams;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  totalItems?: number;
  itemsPerPage?: number;
}

// Utility types
export type SortOrder = 'ASC' | 'DESC';
export type SortField = 'created_at' | 'updated_at' | 'title' | 'trl_level' | 'asking_price';

export interface SortOption {
  field: SortField;
  order: SortOrder;
  label: string;
}

// Error types
export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

// Loading states
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Form validation
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState<T> {
  data: T;
  errors: ValidationError[];
  isSubmitting: boolean;
  isDirty: boolean;
}

