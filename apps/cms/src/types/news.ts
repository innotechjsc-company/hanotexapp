import { Media } from '@/payload-types'

export interface News {
  id: string
  title: string
  image: Media
  content: string
  hashtags: string
  document: Media
  views: number
  likes: number
  createdAt?: string
  updatedAt?: string
}
