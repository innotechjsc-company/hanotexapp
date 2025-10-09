import { News, User } from '@/payload-types'

export interface NewsComment {
  id: string
  user: string | User
  news: string | News
  comment: string
  createdAt?: string
  updatedAt?: string
}
