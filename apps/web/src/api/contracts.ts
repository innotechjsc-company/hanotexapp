import { payloadApiClient, ApiResponse } from "./client";
import type { Contract } from "@/types/contract";

class ContractsApi {
  async getByPropose(proposeId: string, depth = 1) {
    const params: Record<string, any> = {
      [`where[propose][equals]`]: proposeId,
      depth,
      limit: 1,
    };
    const res = await payloadApiClient.get<Contract>(`/contract`, params);
    const contract = (res.docs && res.docs[0]) as unknown as Contract | undefined;
    return contract || null;
  }
  async getByTechnologyPropose(technologyProposeId: string, depth = 1) {
    const params: Record<string, any> = {
      [`where[technology_propose][equals]`]: technologyProposeId,
      depth,
      limit: 1,
    };
    const res = await payloadApiClient.get<Contract>(`/contract`, params);
    const contract = (res.docs && res.docs[0]) as unknown as
      | Contract
      | undefined;
    return contract || null;
  }

  async getById(id: string, depth = 1) {
    const res = await payloadApiClient.get<Contract>(`/contract/${id}`, {
      depth,
    });
    return res as unknown as ApiResponse<Contract> as any;
  }

  async update(id: string, data: Partial<Contract>) {
    return payloadApiClient.patch<Contract>(`/contract/${id}`, data);
  }

  async acceptContract(contractId: string, userId: string) {
    // Use unified CMS route for contract acceptance
    const response = await payloadApiClient.post<{
      success: boolean;
      contract?: any;
      bothAccepted?: boolean;
      message?: string;
    }>(`/contract/accept-contract`, {
      contractId,
      userId,
    });
    return response;
  }
}

export const contractsApi = new ContractsApi();
