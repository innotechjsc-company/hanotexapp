import { TechnologyPropose } from './technology-propose'
import { Contract } from './contract'
import { Propose } from './propose'
import { ProjectPropose } from './project-propose'
import { User } from '@/payload-types'
import { Media } from '@/payload-types'

export enum ContractLogStatus {
  Pending = 'pending',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

export interface ContractLog {
  id: string
  technology_propose?: TechnologyPropose
  propose?: Propose
  project_propose?: ProjectPropose
  contract: Contract
  user: User
  content: string
  documents?: Media
  reason?: string
  status: ContractLogStatus
  is_done_contract?: boolean
  createdAt: string
  updatedAt: string
}
