import { Offer } from './offer'
import { Propose } from './propose'
import { ProjectPropose } from './project-propose'
import { Media, TechnologyPropose, User } from '@/payload-types'

export interface NegotiatingMessage {
  id: string
  propose?: Propose
  project_propose?: ProjectPropose
  technology_propose?: TechnologyPropose
  user: User
  message: string
  documents?: Media[]
  is_offer: boolean
  offer?: Offer
  createdAt: string
  updatedAt: string
}
