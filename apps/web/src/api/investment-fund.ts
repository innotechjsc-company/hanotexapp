/**
 * Investment Fund API functions
 * Các function để quản lý investment-fund với PayloadCMS
 */

import { payloadApiClient, ApiResponse } from "./client";
import { API_ENDPOINTS, PAGINATION_DEFAULTS } from "./config";
import type { InvestmentFund } from "@/types/investment_fund";

export interface InvestmentFundFilters {
  search?: string;
}

export interface PaginationParams {
  limit?: number;
  page?: number;
  sort?: string;
}

/**
 * Get all investment funds with pagination and filters
 */
export async function getInvestmentFunds(
  filters: InvestmentFundFilters = {},
  pagination: PaginationParams = {}
): Promise<ApiResponse<InvestmentFund[]>> {
  const params = {
    ...filters,
    limit: pagination.limit || PAGINATION_DEFAULTS.limit,
    page: pagination.page || PAGINATION_DEFAULTS.page,
    sort: pagination.sort || "-createdAt",
  };

  return payloadApiClient.get<InvestmentFund[]>(
    API_ENDPOINTS.INVESTMENT_FUND,
    params
  );
}

/**
 * Get investment fund by ID
 */
export async function getInvestmentFundById(
  id: string
): Promise<InvestmentFund> {
  const response = await payloadApiClient.get<InvestmentFund>(
    `${API_ENDPOINTS.INVESTMENT_FUND}/${id}`
  );
  return (
    (response as any as { data: InvestmentFund }).data ??
    (response as any as InvestmentFund)
  );
}

/**
 * Create new investment fund
 */
export async function createInvestmentFund(
  data: Partial<InvestmentFund>
): Promise<InvestmentFund> {
  const response = await payloadApiClient.post<InvestmentFund>(
    API_ENDPOINTS.INVESTMENT_FUND,
    data
  );
  return (
    (response as any as { data: InvestmentFund }).data ??
    (response as any as InvestmentFund)
  );
}

/**
 * Update investment fund
 */
export async function updateInvestmentFund(
  id: string,
  data: Partial<InvestmentFund>
): Promise<InvestmentFund> {
  const response = await payloadApiClient.patch<InvestmentFund>(
    `${API_ENDPOINTS.INVESTMENT_FUND}/${id}`,
    data
  );
  return (
    (response as any as { data: InvestmentFund }).data ??
    (response as any as InvestmentFund)
  );
}

/**
 * Delete investment fund
 */
export async function deleteInvestmentFund(id: string): Promise<void> {
  await payloadApiClient.delete(`${API_ENDPOINTS.INVESTMENT_FUND}/${id}`);
}

/**
 * Search investment funds by name/description
 */
export async function searchInvestmentFunds(
  query: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<InvestmentFund[]>> {
  return getInvestmentFunds({ search: query }, pagination);
}
