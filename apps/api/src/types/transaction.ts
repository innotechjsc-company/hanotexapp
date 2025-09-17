// Transaction types for HANOTEX platform

import { TransactionStatus } from "./common";

// Transaction interface
export interface Transaction {
  id: string;
  technology_id?: string;
  buyer_id?: string;
  seller_id?: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  payment_method?: string;
  transaction_fee?: number;
  created_at: Date;
  completed_at?: Date;
}
