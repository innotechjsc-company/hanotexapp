import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import TechnologiesPage from '../page';
import apiClient from '@/lib/api';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock API client
jest.mock('@/lib/api', () => ({
  getTechnologies: jest.fn(),
  getCategories: jest.fn(),
}));

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>;
const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('TechnologiesPage', () => {
  const mockPush = jest.fn();
  const mockGet = jest.fn();
  
  const mockTechnologies = [
    {
      id: '1',
      title: 'AI Technology',
      public_summary: 'Advanced AI technology',
      category_name: 'Điện – Điện tử – CNTT',
      trl_level: 8,
      status: 'ACTIVE',
      asking_price: '1000000',
      currency: 'VND',
      pricing_type: 'ASK',
      updated_at: '2023-01-01T00:00:00Z',
      owners: [{ owner_name: 'John Doe' }],
    },
    {
      id: '2',
      title: 'Battery Technology',
      public_summary: 'Lithium-ion battery technology',
      category_name: 'Vật liệu & Công nghệ vật liệu',
      trl_level: 6,
      status: 'ACTIVE',
      asking_price: '2000000',
      currency: 'VND',
      pricing_type: 'AUCTION',
      updated_at: '2023-01-02T00:00:00Z',
      owners: [{ owner_name: 'Jane Smith' }],
    },
  ];

  const mockCategories = [
    { id: '1', name: 'Điện – Điện tử – CNTT', code: 'EEICT' },
    { id: '2', name: 'Vật liệu & Công nghệ vật liệu', code: 'MTRL' },
  ];

  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    });

    mockUseSearchParams.mockReturnValue({
      get: mockGet,
      set: jest.fn(),
      delete: jest.fn(),
      has: jest.fn(),
      getAll: jest.fn(),
      keys: jest.fn(),
      values: jest.fn(),
      entries: jest.fn(),
      forEach: jest.fn(),
      toString: jest.fn(),
      append: jest.fn(),
    });

    mockApiClient.getTechnologies.mockResolvedValue({
      success: true,
      data: mockTechnologies,
      pagination: { page: 1, limit: 20, total: 2, totalPages: 1 },
    });

    mockApiClient.getCategories.mockResolvedValue({
      success: true,
      data: mockCategories,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders technologies page correctly', async () => {
    render(<TechnologiesPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Danh sách công nghệ')).toBeInTheDocument();
      expect(screen.getByText('AI Technology')).toBeInTheDocument();
      expect(screen.getByText('Battery Technology')).toBeInTheDocument();
    });
  });

  it('shows search input and filters', async () => {
    render(<TechnologiesPage />);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Tìm kiếm công nghệ...')).toBeInTheDocument();
      expect(screen.getByText('Danh mục')).toBeInTheDocument();
      expect(screen.getByText('Tất cả TRL')).toBeInTheDocument();
      expect(screen.getByText('Trạng thái')).toBeInTheDocument();
    });
  });

  it('filters technologies by search query', async () => {
    render(<TechnologiesPage />);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Tìm kiếm công nghệ...');
      fireEvent.change(searchInput, { target: { value: 'AI' } });
    });
    
    await waitFor(() => {
      expect(screen.getByText('AI Technology')).toBeInTheDocument();
      expect(screen.queryByText('Battery Technology')).not.toBeInTheDocument();
    });
  });

  it('filters technologies by category', async () => {
    render(<TechnologiesPage />);
    
    await waitFor(() => {
      const categorySelect = screen.getByDisplayValue('Tất cả danh mục');
      fireEvent.change(categorySelect, { target: { value: '2' } });
    });
    
    await waitFor(() => {
      expect(screen.getByText('Battery Technology')).toBeInTheDocument();
      expect(screen.queryByText('AI Technology')).not.toBeInTheDocument();
    });
  });

  it('filters technologies by TRL level', async () => {
    render(<TechnologiesPage />);
    
    await waitFor(() => {
      const trlSelect = screen.getByDisplayValue('Tất cả TRL');
      fireEvent.change(trlSelect, { target: { value: '7-9' } });
    });
    
    await waitFor(() => {
      expect(screen.getByText('AI Technology')).toBeInTheDocument();
      expect(screen.queryByText('Battery Technology')).not.toBeInTheDocument();
    });
  });

  it('filters technologies by status', async () => {
    render(<TechnologiesPage />);
    
    await waitFor(() => {
      const statusSelect = screen.getByDisplayValue('Hoạt động');
      fireEvent.change(statusSelect, { target: { value: 'PENDING' } });
    });
    
    await waitFor(() => {
      expect(screen.getByText('Không tìm thấy công nghệ nào')).toBeInTheDocument();
    });
  });

  it('shows warning badge when using client-side filtering', async () => {
    render(<TechnologiesPage />);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Tìm kiếm công nghệ...');
      fireEvent.change(searchInput, { target: { value: 'AI' } });
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Tìm kiếm và bộ lọc được thực hiện ở frontend/)).toBeInTheDocument();
    });
  });

  it('clears all filters when clear button is clicked', async () => {
    render(<TechnologiesPage />);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Tìm kiếm công nghệ...');
      fireEvent.change(searchInput, { target: { value: 'AI' } });
    });
    
    await waitFor(() => {
      const clearButton = screen.getByText('Xóa bộ lọc');
      fireEvent.click(clearButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('AI Technology')).toBeInTheDocument();
      expect(screen.getByText('Battery Technology')).toBeInTheDocument();
    });
  });

  it('sorts technologies by different criteria', async () => {
    render(<TechnologiesPage />);
    
    await waitFor(() => {
      const sortSelect = screen.getByDisplayValue('Mới nhất');
      fireEvent.change(sortSelect, { target: { value: 'price_asc' } });
    });
    
    await waitFor(() => {
      expect(mockApiClient.getTechnologies).toHaveBeenCalledWith(
        expect.objectContaining({
          sort: 'asking_price',
          order: 'ASC',
        })
      );
    });
  });

  it('handles search with Enter key', async () => {
    render(<TechnologiesPage />);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Tìm kiếm công nghệ...');
      fireEvent.change(searchInput, { target: { value: 'AI' } });
      fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });
    });
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/technologies?q=AI');
    });
  });

  it('shows loading state initially', () => {
    mockApiClient.getTechnologies.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<TechnologiesPage />);
    
    expect(screen.getByText('Đang tải...')).toBeInTheDocument();
  });

  it('shows error state when API fails', async () => {
    mockApiClient.getTechnologies.mockRejectedValue(new Error('API Error'));
    
    render(<TechnologiesPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Có lỗi xảy ra khi tải dữ liệu')).toBeInTheDocument();
    });
  });

  it('shows no results message when no technologies found', async () => {
    mockApiClient.getTechnologies.mockResolvedValue({
      success: true,
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    });
    
    render(<TechnologiesPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Không tìm thấy công nghệ nào')).toBeInTheDocument();
    });
  });

  it('displays technology cards with correct information', async () => {
    render(<TechnologiesPage />);
    
    await waitFor(() => {
      expect(screen.getByText('AI Technology')).toBeInTheDocument();
      expect(screen.getByText('Advanced AI technology')).toBeInTheDocument();
      expect(screen.getByText('Điện – Điện tử – CNTT')).toBeInTheDocument();
      expect(screen.getByText('TRL 8')).toBeInTheDocument();
      expect(screen.getByText('1,000,000 VND')).toBeInTheDocument();
    });
  });
});