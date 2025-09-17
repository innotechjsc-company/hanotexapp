/**
 * Technology Types for Hanotex CMS
 * Định nghĩa các interface cho Technology collection
 */

import { User } from './User'
import { Category } from './Category'
import { Media } from './Media'

// Enums cho Technology
export type TechnologyStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'INACTIVE'
export type VisibilityMode = 'public' | 'private' | 'restricted'
export type OwnerType = 'INDIVIDUAL' | 'COMPANY' | 'RESEARCH_INSTITUTION'
export type IPType =
  | 'PATENT'
  | 'UTILITY_MODEL'
  | 'INDUSTRIAL_DESIGN'
  | 'TRADEMARK'
  | 'SOFTWARE_COPYRIGHT'
  | 'TRADE_SECRET'
export type PricingType = 'APPRAISAL' | 'ASK' | 'AUCTION' | 'OFFER'
export type Currency = 'VND' | 'USD' | 'EUR'

// Technology Owner Interface
export interface TechnologyOwner {
  owner_type: OwnerType
  owner_name: string
  ownership_percentage: number
}

// IP Details Interface
export interface IPDetail {
  ip_type: IPType
  ip_number?: string
  status?: string
  territory?: string
}

// Legal Certification Interfaces
export interface ProtectionScope {
  scope: string
}

export interface StandardCertification {
  certification: string
}

export interface LegalCertification {
  protection_scope?: ProtectionScope[]
  standard_certifications?: StandardCertification[]
  local_certification_url?: string
}

// Pricing Information Interface
export interface PricingInfo {
  pricing_type: PricingType
  asking_price?: number
  currency: Currency
  price_type?: string
  appraisal_purpose?: string
  appraisal_scope?: string
  appraisal_deadline?: string
}

// Investment & Transfer Interfaces
export interface CommercializationMethod {
  method: string
}

export interface TransferMethod {
  method: string
}

export interface FinancialMethod {
  method: string
}

export interface InvestmentTransferInfo {
  investment_stage?: string
  commercialization_methods?: CommercializationMethod[]
  transfer_methods?: TransferMethod[]
  territory_scope?: string
  financial_methods?: FinancialMethod[]
  usage_limitations?: string
  current_partners?: string
  potential_partners?: string
}

// Additional Data Interface
export interface AdditionalData {
  test_results?: string
  economic_social_impact?: string
  financial_support_info?: string
}

// Main Technology Interface
export interface Technology {
  id: string
  title: string
  public_summary?: string
  confidential_detail?: string
  trl_level?: number
  category_id?: string | Category
  submitter_id: string | User
  status: TechnologyStatus
  visibility_mode: VisibilityMode

  // Complex nested data
  owners?: TechnologyOwner[]
  ip_details?: IPDetail[]
  legal_certification?: LegalCertification
  pricing?: PricingInfo
  investment_transfer?: InvestmentTransferInfo
  additional_data?: AdditionalData

  // Related documents
  documents?: string[] | Media[]

  // Timestamps
  createdAt: string
  updatedAt: string
}

// Types for form data and API responses
export interface TechnologyCreateData extends Omit<Technology, 'id' | 'createdAt' | 'updatedAt'> {}
export interface TechnologyUpdateData extends Partial<TechnologyCreateData> {}

// Technology summary for lists
export interface TechnologySummary {
  id: string
  title: string
  public_summary?: string
  trl_level?: number
  status: TechnologyStatus
  category_id?: string | Category
  submitter_id: string | User
  pricing?: Pick<PricingInfo, 'asking_price' | 'currency' | 'pricing_type'>
  createdAt: string
  updatedAt: string
}
