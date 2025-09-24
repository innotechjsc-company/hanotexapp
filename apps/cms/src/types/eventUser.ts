import { User } from './users'
import { Event } from './event'

export interface EventUser {
  id: string
  user: string | User
  event: string | Event
}
