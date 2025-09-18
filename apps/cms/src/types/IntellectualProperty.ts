export type IPType =
  | 'patent'
  | 'utility_solution'
  | 'industrial_design'
  | 'trademark'
  | 'copyright'
  | 'trade_secret'

export type IPStatus = 'pending' | 'granted' | 'expired' | 'rejected'

export interface IntellectualProperty {
  technology: string
  code: string
  type: IPType
  status: IPStatus
}
