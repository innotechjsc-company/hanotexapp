import { Media } from '@/payload-types'
import { Demand } from './demand'
import { Technology } from './technologies'
import { User } from './users'

export type ProposeStatus =
  | 'pending'
  | 'negotiating'
  | 'contact_signing'
  | 'contract_signed'
  | 'completed'
  | 'cancelled'

export interface Propose {
  id: string
  title: string
  demand: Demand
  user: User
  receiver: User
  technology: Technology
  description: string
  execution_time: string
  estimated_cost: number
  cooperation_conditions: string
  document?: Media
  status: ProposeStatus
  createdAt: string
  updatedAt: string
}
