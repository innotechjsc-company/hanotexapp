import { Technology, User, Media } from '@/payload-types'

export type TechnologyProposeStatus =
  | 'pending'
  | 'negotiating'
  | 'contact_signing'
  | 'contract_signed'
  | 'completed'
  | 'cancelled'

export interface TechnologyPropose {
  id: string
  technology: Technology
  user: User
  receiver: User
  description: string
  document?: Media
  budget: number
  status: TechnologyProposeStatus
  createdAt: string
  updatedAt: string
}
