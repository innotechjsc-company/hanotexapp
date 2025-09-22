import { Media } from '@/payload-types'
import { Demand } from './demand'
import { Technology } from './technologies'
import { User } from './users'

export type ProposeStatus = 'pending' | 'accepted' | 'rejected'

export interface Propose {
  title: string
  demand: Demand
  user: User
  technology: Technology
  description: string
  execution_time: string
  estimated_cost: number
  cooperation_conditions: string
  document: Media
  status: ProposeStatus
}
