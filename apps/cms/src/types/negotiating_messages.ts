import { Offer } from './offer'
import { Propose } from './propose'
import { Media, TechnologyPropose, User } from '@/payload-types'

export interface NegotiatingMessage {
  propose: Propose
  technology_propose: TechnologyPropose
  user: User
  message: string
  documents: Media[]
  is_offer: boolean
  offer: Offer
}
