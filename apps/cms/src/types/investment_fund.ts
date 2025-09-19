import { User } from './users'

export type InvestmentFund = {
  name: string
  description: string
  user: string | User
}
