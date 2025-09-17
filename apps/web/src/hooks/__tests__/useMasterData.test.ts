import { renderHook, waitFor } from '@testing-library/react';
import { useMasterData } from '../useMasterData';

// Mock fetch
global.fetch = jest.fn();

describe('useMasterData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return loading state initially', () => {
    const { result } = renderHook(() => useMasterData());
    
    expect(result.current.loading).toBe(true);
    expect(result.current.masterData).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it('should fetch and return master data successfully', async () => {
    const mockData = {
      success: true,
      data: {
        fields: [
          { value: 'AI', label: 'Artificial Intelligence' },
          { value: 'BIOTECH', label: 'Biotechnology' },
        ],
        industries: [
          { value: 'TECH', label: 'Technology' },
          { value: 'HEALTH', label: 'Healthcare' },
        ],
        specialties: [
          { value: 'ML', label: 'Machine Learning' },
          { value: 'GENETICS', label: 'Genetics' },
        ],
        trlLevels: [
          { value: '1', label: 'TRL 1' },
          { value: '2', label: 'TRL 2' },
        ],
        categories: [
          { value: 'CAT1', label: 'Category 1' },
          { value: 'CAT2', label: 'Category 2' },
        ],
        ipTypes: [
          { value: 'PATENT', label: 'Patent', description: 'Patent description' },
          { value: 'TRADEMARK', label: 'Trademark', description: 'Trademark description' },
        ],
        ipStatuses: [
          { value: 'ACTIVE', label: 'Active' },
          { value: 'PENDING', label: 'Pending' },
        ],
        protectionTerritories: [
          { value: 'VN', label: 'Vietnam', tooltip: 'Vietnam territory' },
          { value: 'US', label: 'United States', tooltip: 'US territory' },
        ],
        certifications: [
          { value: 'ISO9001', label: 'ISO 9001', tooltip: 'Quality management' },
          { value: 'ISO14001', label: 'ISO 14001', tooltip: 'Environmental management' },
        ],
        commercializationMethods: [
          { value: 'LICENSE', label: 'License', tooltip: 'License technology' },
          { value: 'JOINT_VENTURE', label: 'Joint Venture', tooltip: 'Joint venture' },
        ],
        transferMethods: [
          { value: 'TECHNICAL', label: 'Technical Transfer', tooltip: 'Technical transfer' },
          { value: 'KNOWLEDGE', label: 'Knowledge Transfer', tooltip: 'Knowledge transfer' },
        ],
      },
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useMasterData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.masterData).toEqual(mockData.data);
    expect(result.current.error).toBe(null);
    expect(fetch).toHaveBeenCalledWith('/api/master-data/all');
  });

  it('should handle fetch error', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useMasterData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.masterData).toBe(null);
    expect(result.current.error).toBe('Network error');
  });

  it('should handle HTTP error response', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useMasterData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.masterData).toBe(null);
    expect(result.current.error).toBe('HTTP error! status: 500');
  });

  it('should handle API error response', async () => {
    const mockErrorResponse = {
      success: false,
      error: 'Failed to load master data',
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockErrorResponse,
    });

    const { result } = renderHook(() => useMasterData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.masterData).toBe(null);
    expect(result.current.error).toBe('Failed to load master data');
  });

  it('should handle unexpected error format', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce('Unexpected error');

    const { result } = renderHook(() => useMasterData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.masterData).toBe(null);
    expect(result.current.error).toBe('An unexpected error occurred');
  });

  it('should only fetch data once on mount', async () => {
    const mockData = {
      success: true,
      data: {
        fields: [],
        industries: [],
        specialties: [],
        trlLevels: [],
        categories: [],
        ipTypes: [],
        ipStatuses: [],
        protectionTerritories: [],
        certifications: [],
        commercializationMethods: [],
        transferMethods: [],
      },
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result, rerender } = renderHook(() => useMasterData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Rerender the hook
    rerender();

    // Fetch should only be called once
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('should handle empty data response', async () => {
    const mockData = {
      success: true,
      data: {
        fields: [],
        industries: [],
        specialties: [],
        trlLevels: [],
        categories: [],
        ipTypes: [],
        ipStatuses: [],
        protectionTerritories: [],
        certifications: [],
        commercializationMethods: [],
        transferMethods: [],
      },
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useMasterData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.masterData).toEqual(mockData.data);
    expect(result.current.error).toBe(null);
  });

  it('should handle malformed JSON response', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw new Error('Invalid JSON');
      },
    });

    const { result } = renderHook(() => useMasterData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.masterData).toBe(null);
    expect(result.current.error).toBe('Invalid JSON');
  });
});
