/**
 * Transaction Types for Hanotex CMS
 * Định nghĩa các interface cho Transaction collection
 */

import { User } from './User'
import { Technology } from './Technology'
import { Auction } from './Auction'

// Enums cho Transaction
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
export type TransactionCurrency = 'VND' | 'USD' | 'EUR'

// Main Transaction Interface
export interface Transaction {
  id: string
  technology_id?: string | Technology
  buyer_id?: string | User
  seller_id?: string | User
  amount: number
  currency: TransactionCurrency
  status: TransactionStatus
  payment_method?: string
  transaction_fee?: number
  completed_at?: string
  notes?: string
  auction_id?: string | Auction

  // Timestamps
  createdAt: string
  updatedAt: string
}

// Types for form data and API responses
export interface TransactionCreateData
  extends Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'> {}
export interface TransactionUpdateData extends Partial<TransactionCreateData> {}

// Transaction summary for lists
export interface TransactionSummary {
  id: string
  technology_id?: string | Technology
  buyer_id?: string | User
  seller_id?: string | User
  amount: number
  currency: TransactionCurrency
  status: TransactionStatus
  completed_at?: string
  createdAt: string
  updatedAt: string
}

// Financial report data
export interface TransactionStats {
  total_amount: number
  currency: TransactionCurrency
  transaction_count: number
  completed_count: number
  pending_count: number
  failed_count: number
  average_amount: number
}
