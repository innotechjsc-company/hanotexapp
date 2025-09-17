/**
 * User Types for Hanotex CMS
 * Định nghĩa các interface cho User collection (after separating Company and ResearchInstitution)
 */

import { Company } from './Company'
import { ResearchInstitution } from './ResearchInstitution'

// Enums cho User
export type UserType = 'INDIVIDUAL' | 'COMPANY' | 'RESEARCH_INSTITUTION'
export type UserRole = 'USER' | 'ADMIN' | 'MODERATOR' | 'SUPPORT'

// Individual Profile Interface (kept in User table)
export interface IndividualProfile {
  full_name?: string
  id_number?: string
  phone?: string
  profession?: string
  bank_account?: string
}

// Main User Interface
export interface User {
  id: string
  email: string
  user_type: UserType
  role: UserRole
  is_verified: boolean
  is_active: boolean

  // Individual profile data (for INDIVIDUAL user_type)
  full_name?: string
  id_number?: string
  phone?: string
  profession?: string
  bank_account?: string

  // Relationships to separate entities
  company_id?: string | Company
  research_institution_id?: string | ResearchInstitution

  // Timestamps
  createdAt: string
  updatedAt: string
}

// Extended User with populated relationships
export interface UserWithProfiles extends Omit<User, 'company_id' | 'research_institution_id'> {
  company?: Company
  research_institution?: ResearchInstitution
}

// Types for form data and API responses
export interface UserCreateData extends Omit<User, 'id' | 'createdAt' | 'updatedAt'> {}
export interface UserUpdateData extends Partial<UserCreateData> {}

// User summary for lists
export interface UserSummary {
  id: string
  email: string
  user_type: UserType
  role: UserRole
  is_verified: boolean
  is_active: boolean

  // Display name based on user type
  display_name?: string

  createdAt: string
  updatedAt: string
}

// User profile helper types
export interface UserProfile {
  user: User
  company?: Company
  research_institution?: ResearchInstitution
}

// User filters for searching/listing
export interface UserFilters {
  user_type?: UserType[]
  role?: UserRole[]
  is_verified?: boolean
  is_active?: boolean
  search?: string // search in email, name, company name, etc
}
