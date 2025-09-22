import { Technology, User, Media } from '@/payload-types'

export type TechnologyProposeStatus = 'pending' | 'accepted' | 'rejected'

export interface TechnologyPropose {
  technology: Technology
  user: User
  description: string
  document: Media
  status: TechnologyProposeStatus
}
