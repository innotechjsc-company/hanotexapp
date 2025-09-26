import { Media } from '@/payload-types'
import { Project } from './project'
import { User } from './users'

export enum ProjectProposeStatus {
  Pending = 'pending',
  Negotiating = 'negotiating',
  ContactSigning = 'contact_signing',
  ContractSigned = 'contract_signed',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

export interface ProjectPropose {
  id: string
  project: Project
  user: User
  investor_capacity?: string
  investment_amount?: number
  investment_ratio?: number
  investment_type?: string
  investment_benefits?: string
  documents?: Media[]
  status: ProjectProposeStatus
  createdAt: string
  updatedAt: string
}
