export interface SearchResult {
  id: string;
  type: 'technology' | 'demand' | 'company' | 'research-institution' | 'project' | 'news' | 'event';
  title: string;
  description: string;
  category?: string;
  image?: string;
  url: string;
  metadata?: {
    price?: string;
    location?: string;
    deadline?: string;
    [key: string]: any;
  };
}

export interface SearchResponse {
  success: boolean;
  data?: {
    results: SearchResult[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    query: string;
    types: Record<string, number>;
  };
  error?: string;
}

export interface SearchPagination {
  page: number;
  total: number;
  totalPages: number;
}
