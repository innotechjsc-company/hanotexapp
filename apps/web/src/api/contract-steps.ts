import { payloadApiClient } from './client'
import type { ContractStep, ContractStepApproval, ContractStepType } from '@/types/contract-step'

class ContractStepsApi {
  async listByContract(contractId: string, depth = 1) {
    const params: Record<string, any> = {
      [`where[contract][equals]`]: contractId,
      sort: 'createdAt',
      depth,
      limit: 10,
    }
    const res = await payloadApiClient.get<ContractStep>(`/contract-step`, params)
    return (res.docs || []) as unknown as ContractStep[]
  }

  async createStep(params: {
    contract: string
    step: ContractStepType
    contract_file?: number | string
    attachments?: Array<number | string>
    uploaded_by?: string
    approvals: ContractStepApproval[]
    notes?: string
  }) {
    return payloadApiClient.post<ContractStep>(`/contract-step`, params)
  }

  async updateApprovals(stepId: string, approvals: ContractStepApproval[]) {
    return payloadApiClient.patch<ContractStep>(`/contract-step/${stepId}`, {
      approvals,
    })
  }
}

export const contractStepsApi = new ContractStepsApi()
