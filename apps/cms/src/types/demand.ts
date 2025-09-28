import { Media } from '@/payload-types'
import { Category } from './categories'
import { User } from './users'

export interface Demand {
  id?: string
  title: string
  description: string
  category: string | Category
  user: string | User
  trl_level: number
  option: string
  option_technology: string
  option_rule: string
  from_price: number
  to_price: number
  cooperation: string
  start_date: string
  end_date: string
  image: string | Media
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'inactive'
  documents: Media[]
  createdAt?: string
  updatedAt?: string
}
