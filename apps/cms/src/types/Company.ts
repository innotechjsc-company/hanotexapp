/**
 * Company Types for Hanotex CMS
 * Định nghĩa các interface cho Company collection
 */

// Address interface for company location
export interface Address {
  street?: string
  city?: string
  state?: string
  country?: string
  postal_code?: string
}

// Business sector interface
export interface BusinessSector {
  sector: string
}

// Main Company Interface
export interface Company {
  id: string
  company_name: string
  tax_code: string
  business_license?: string
  legal_representative: string
  contact_email?: string
  contact_phone?: string
  address?: Address
  production_capacity?: string
  business_sectors?: BusinessSector[]
  employee_count?: number
  established_year?: number
  website?: string
  is_active: boolean

  // Timestamps
  createdAt: string
  updatedAt: string
}

// Types for form data and API responses
export interface CompanyCreateData extends Omit<Company, 'id' | 'createdAt' | 'updatedAt'> {}
export interface CompanyUpdateData extends Partial<CompanyCreateData> {}

// Company summary for lists and references
export interface CompanySummary {
  id: string
  company_name: string
  tax_code: string
  legal_representative: string
  contact_email?: string
  is_active: boolean
  createdAt: string
}

// Company profile for user display
export interface CompanyProfile extends Omit<Company, 'createdAt' | 'updatedAt'> {}

// Company search filters
export interface CompanyFilters {
  company_name?: string
  tax_code?: string
  business_sectors?: string[]
  employee_count_min?: number
  employee_count_max?: number
  established_year_min?: number
  established_year_max?: number
  is_active?: boolean
}
