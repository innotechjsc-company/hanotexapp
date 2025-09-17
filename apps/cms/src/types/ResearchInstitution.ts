/**
 * Research Institution Types for Hanotex CMS
 * Định nghĩa các interface cho Research Institution collection
 */

// Import Address from Company types (shared interface)
import { Address } from './Company'

// Enums for Research Institution
export type InstitutionType =
  | 'UNIVERSITY'
  | 'RESEARCH_INSTITUTE'
  | 'GOVERNMENT_LAB'
  | 'PRIVATE_RND'
  | 'INTERNATIONAL_ORG'

// Contact information interface
export interface ContactInfo {
  contact_email?: string
  contact_phone?: string
  website?: string
}

// Research area interface
export interface ResearchArea {
  area: string
}

// Accreditation information interface
export interface AccreditationInfo {
  accreditation_body?: string
  accreditation_level?: string
  accreditation_date?: string
  accreditation_expiry?: string
}

// Main Research Institution Interface
export interface ResearchInstitution {
  id: string
  institution_name: string
  institution_code: string
  governing_body: string
  institution_type: InstitutionType
  contact_info?: ContactInfo
  address?: Address
  research_areas?: ResearchArea[]
  research_task_code?: string
  acceptance_report?: string
  research_group?: string
  established_year?: number
  staff_count?: number
  accreditation_info?: AccreditationInfo
  is_active: boolean

  // Timestamps
  createdAt: string
  updatedAt: string
}

// Types for form data and API responses
export interface ResearchInstitutionCreateData
  extends Omit<ResearchInstitution, 'id' | 'createdAt' | 'updatedAt'> {}
export interface ResearchInstitutionUpdateData extends Partial<ResearchInstitutionCreateData> {}

// Research Institution summary for lists and references
export interface ResearchInstitutionSummary {
  id: string
  institution_name: string
  institution_code: string
  governing_body: string
  institution_type: InstitutionType
  contact_info?: ContactInfo
  is_active: boolean
  createdAt: string
}

// Research Institution profile for user display
export interface ResearchInstitutionProfile
  extends Omit<ResearchInstitution, 'createdAt' | 'updatedAt'> {}

// Research Institution search filters
export interface ResearchInstitutionFilters {
  institution_name?: string
  institution_code?: string
  governing_body?: string
  institution_type?: InstitutionType[]
  research_areas?: string[]
  established_year_min?: number
  established_year_max?: number
  staff_count_min?: number
  staff_count_max?: number
  is_active?: boolean
}
