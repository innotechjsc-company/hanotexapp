import { User } from '@/payload-types'

export interface RoomMessage {
  id: string
  room: string
  message: string
  document: string
  user: User
  updatedAt: string
  createdAt: string
}
