import { TechnologyPropose } from './technology-propose'
import { NegotiatingMessage } from './negotiating_messages'

export enum OfferStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export interface Offer {
  id: string
  technology_propose: TechnologyPropose
  negotiating_messages: NegotiatingMessage
  content: string
  price: number
  status: OfferStatus
  createdAt?: string
  updatedAt?: string
}
