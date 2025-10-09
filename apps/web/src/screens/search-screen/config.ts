/**
 * Search API Configuration
 */

// Get CMS API URL from environment variable
export const CMS_API_URL = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:4000/api';

// Search endpoint
export const SEARCH_ENDPOINT = `${CMS_API_URL}/search`;

// Default pagination settings
export const DEFAULT_PAGE_SIZE = 12;
export const DEFAULT_PAGE = 1;

// Minimum search query length
export const MIN_QUERY_LENGTH = 2;

/**
 * Build search URL with parameters
 */
export const buildSearchUrl = (params: {
  query: string;
  type?: string;
  page?: number;
  limit?: number;
}): string => {
  const searchParams = new URLSearchParams();
  
  searchParams.append('q', params.query);
  
  if (params.type && params.type !== 'all') {
    searchParams.append('type', params.type);
  }
  
  searchParams.append('page', String(params.page || DEFAULT_PAGE));
  searchParams.append('limit', String(params.limit || DEFAULT_PAGE_SIZE));
  
  return `${SEARCH_ENDPOINT}?${searchParams.toString()}`;
};
