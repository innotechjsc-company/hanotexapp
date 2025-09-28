import { Media } from '@/payload-types'

export interface Event {
  id: string
  title: string
  image: string | Media
  content: string
  hashtags?: string | null
  document?: (string | null) | Media
  start_date: string
  end_date: string
  location?: string | null
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  url?: string | null
  createdAt?: string
  updatedAt?: string
}
