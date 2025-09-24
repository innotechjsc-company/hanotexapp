import { User } from '@/payload-types'

export interface RoomUser {
  id: string
  room: string
  user: User
  updatedAt: string
  createdAt: string
}
