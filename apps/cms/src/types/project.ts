import { User } from './users'
import { Technology } from './technologies'
import { InvestmentFund, Media } from '@/payload-types'

export enum ProjectStatusEnum {
  PENDING = 'pending',
  ACTIVE = 'active',
  REJECTED = 'rejected',
}

export type Project = {
  id?: string
  image?: string | Media
  name: string
  description: string
  business_model?: string
  market_data?: string
  user: string | User
  technologies: string[] | Technology[]
  investment_fund?: string[] | InvestmentFund[]
  revenue?: number
  profit?: number
  assets?: number
  documents_finance?: string[] | Media[]
  team_profile?: string
  goal_money?: number
  share_percentage?: number
  goal_money_purpose?: string
  status: ProjectStatusEnum
  open_investment_fund: boolean
  end_date: string
}
