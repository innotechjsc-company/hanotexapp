/**
 * Search API Types
 */

// Searchable Payload collections
export type SearchableCollections = 'technologies' | 'demand' | 'project' | 'news' | 'events' | 'companies' | 'research-institutions';

// Result types (singular form)
export type SearchResultType = 'technology' | 'demand' | 'project' | 'news' | 'event' | 'company' | 'research-institution';

// Search result interface
export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  description: string;
  image?: string;
  url: string;
  metadata?: SearchResultMetadata;
  score?: number; // Relevance score
}

// Metadata by type
export interface SearchResultMetadata {
  // Technology
  category?: string;
  trl?: number | string;
  price?: number | string;
  owner?: string | { name?: string; id?: string };
  
  // Demand
  budget?: number | string;
  deadline?: string | Date;
  user?: string | { name?: string; id?: string };
  
  // Project
  organization?: string | { name?: string; id?: string };
  status?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  
  // News
  publishedAt?: string | Date;
  author?: string | { name?: string; id?: string };
  featured?: boolean;
  
  // Events
  location?: string;
  organizer?: string | { name?: string; id?: string };
  
  // Company
  tax_code?: string;
  legal_representative?: string;
  contact_email?: string;
  contact_phone?: string;
  employee_count?: number;
  established_year?: number;
  website?: string;
  business_sectors?: string[];
  
  // Research Institution
  institution_code?: string;
  governing_body?: string;
  institution_type?: string;
  research_areas?: string[];
  staff_count?: number;
  
  // Common
  [key: string]: unknown;
}

// Media object type
export type MediaWithUrl = { url?: string } | null | undefined;

// Generic document from Payload
export interface GenericDoc {
  id: string;
  title?: string;
  name?: string;
  company_name?: string;
  description?: string;
  content?: string;
  production_capacity?: string;
  image?: MediaWithUrl;
  logo?: MediaWithUrl;
  avatar?: MediaWithUrl;
  category?: unknown;
  trl?: unknown;
  price?: unknown;
  owner?: unknown;
  type?: unknown;
  field?: unknown;
  location?: unknown;
  startDate?: unknown;
  endDate?: unknown;
  organizer?: unknown;
  budget?: unknown;
  deadline?: unknown;
  user?: unknown;
  publishedAt?: unknown;
  author?: unknown;
  featured?: unknown;
  organization?: unknown;
  status?: unknown;
  tax_code?: string;
  legal_representative?: string;
  contact_email?: string;
  contact_phone?: string;
  employee_count?: number;
  established_year?: number;
  website?: string;
  business_sectors?: unknown;
  // Research Institution
  institution_name?: string;
  institution_code?: string;
  governing_body?: string;
  institution_type?: string;
  research_areas?: unknown;
  staff_count?: number;
  contact_info?: unknown;
  is_active?: boolean;
  [key: string]: unknown;
}

// API Response
export interface SearchAPIResponse {
  success: boolean;
  data?: {
    results: SearchResult[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    query: string;
    types: Record<SearchResultType, number>;
  };
  error?: string;
  message?: string;
}

// Search request params
export interface SearchParams {
  q: string; // Query string
  type?: SearchResultType | 'all'; // Filter by type
  page?: number; // Page number
  limit?: number; // Results per page
  sort?: 'relevance' | 'date' | 'title'; // Sort order
}

// Collection mapping config
export interface CollectionConfig {
  singular: SearchResultType;
  urlPath: string;
  searchFields: string[];
  metadataFields: string[];
}
