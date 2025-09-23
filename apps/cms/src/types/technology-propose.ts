import { Technology, User, Media } from '@/payload-types'

export type TechnologyProposeStatus =
  | 'pending'
  | 'negotiating'
  | 'contract_signed'
  | 'completed'
  | 'cancelled'

export interface TechnologyPropose {
  technology: Technology
  user: User
  description: string
  document: Media
  budget: number
  status: TechnologyProposeStatus
}
