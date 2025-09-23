import { Media } from '@/payload-types'

export interface News {
  title: string
  content: string
  hashtags: string
  document: Media
  createdAt?: string
  updatedAt?: string
}
