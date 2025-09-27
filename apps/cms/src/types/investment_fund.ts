import { Media } from '@/payload-types'
import { User } from './users'

export type InvestmentFund = {
  name: string
  description: string
  user: string | User
  image?: string | Media
}
