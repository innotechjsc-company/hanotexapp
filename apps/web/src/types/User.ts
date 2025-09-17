/**
 * User Types for Hanotex CMS
 * Định nghĩa các interface cho User collection (after separating Company and ResearchInstitution)
 */

import { Company } from './Company'
import { ResearchInstitution } from './ResearchInstitution'

// Enums cho User
export type UserType = 'INDIVIDUAL' | 'COMPANY' | 'RESEARCH_INSTITUTION'
export type UserRole = 'USER' | 'ADMIN' | 'MODERATOR' | 'SUPPORT'

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
  company?: string | Company
  research_institution?: string | ResearchInstitution

  // Timestamps
  createdAt: string
  updatedAt: string
}
