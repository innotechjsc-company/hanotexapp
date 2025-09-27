import { User } from '@/payload-types'

export interface EventComment {
  id: string
  user: string | User
  event: string | Event
  comment: string
  createdAt?: string
  updatedAt?: string
}
