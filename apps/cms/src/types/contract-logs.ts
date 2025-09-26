import { TechnologyPropose } from './technology-propose'
import { Contract } from './contract'
import { User } from '@/payload-types'
import { Media } from '@/payload-types'

export enum ContractLogStatus {
  Pending = 'pending',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

export interface ContractLog {
  technology_propose: TechnologyPropose
  contract: Contract
  user: User
  content: string
  documents?: Media
  status: ContractLogStatus
  createdAt: string
  updatedAt: string
}
