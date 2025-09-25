import type { User } from './users'
import type { Media } from './media1'

export type ContractStepType = 'sign_contract' | 'upload_attachments' | 'complete_contract'
export type ContractStepStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'
export type ApprovalDecision = 'pending' | 'approved' | 'rejected'

export interface ContractStepApproval {
  party: 'A' | 'B'
  user: string | User
  decision: ApprovalDecision
  decided_at?: string
  note?: string
}

export interface ContractStep {
  id: string
  contract: string
  step: ContractStepType
  uploaded_by?: string | User
  contract_file?: Media
  attachments?: Media[]
  status: ContractStepStatus
  approvals: ContractStepApproval[]
  notes?: string
  createdAt?: string
  updatedAt?: string
}
