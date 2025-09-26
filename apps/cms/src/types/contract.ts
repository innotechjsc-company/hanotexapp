import type { User } from './users'
import type { Technology } from './technologies'
import type { TechnologyPropose } from './technology-propose'
import type { Offer } from './offer'
import type { Propose } from './propose'
import type { ProjectPropose } from './project-propose'
import { Media } from '@/payload-types'

export enum ContractStatusEnum {
  SIGNED = 'signed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface Contract {
  id: string
  user_a: User
  user_b: User
  technologies: Technology[]
  technology_propose?: TechnologyPropose
  propose?: Propose
  project_propose?: ProjectPropose
  offer: Offer
  price: number
  contract_file?: Media
  documents?: Media[]
  status: ContractStatusEnum
  users_confirm: User[]
  createdAt: string
  updatedAt: string
}
