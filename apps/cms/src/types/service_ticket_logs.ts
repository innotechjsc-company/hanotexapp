import { Media, ServiceTicket } from '@/payload-types'
import { User } from './users'

export enum ServiceTicketLogStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface ServiceTicketLog {
  service_ticket: ServiceTicket
  user: User
  content: string
  document: Media
  status: string
  reason: string
  is_done_service: boolean
  createdAt?: string
  updatedAt?: string
}
