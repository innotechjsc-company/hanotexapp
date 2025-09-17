import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DemandsPage from '../page';

describe('DemandsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<DemandsPage />);
    
    // Should show loading spinner
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders page title and description', async () => {
    render(<DemandsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Nhu cầu công nghệ')).toBeInTheDocument();
      expect(screen.getByText('Khám phá các nhu cầu công nghệ từ doanh nghiệp và tổ chức')).toBeInTheDocument();
    });
  });

  it('renders create demand button', async () => {
    render(<DemandsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Đăng nhu cầu')).toBeInTheDocument();
    });
  });

  it('renders search form', async () => {
    render(<DemandsPage />);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Tìm kiếm nhu cầu công nghệ...');
      const searchButton = screen.getByText('Tìm kiếm');
      
      expect(searchInput).toBeInTheDocument();
      expect(searchButton).toBeInTheDocument();
    });
  });

  it('renders filter options', async () => {
    render(<DemandsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Danh mục')).toBeInTheDocument();
      expect(screen.getByText('Ngân sách')).toBeInTheDocument();
      expect(screen.getByText('Trạng thái')).toBeInTheDocument();
    });
  });

  it('renders demands list after loading', async () => {
    render(<DemandsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Tìm kiếm công nghệ AI cho chẩn đoán y tế')).toBeInTheDocument();
      expect(screen.getByText('Công nghệ xử lý nước thải công nghiệp')).toBeInTheDocument();
      expect(screen.getByText('Hệ thống IoT cho nông nghiệp thông minh')).toBeInTheDocument();
    });
  });

  it('displays demand categories', async () => {
    render(<DemandsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Y tế')).toBeInTheDocument();
      expect(screen.getByText('Môi trường')).toBeInTheDocument();
      expect(screen.getByText('Nông nghiệp')).toBeInTheDocument();
    });
  });

  it('displays demand status', async () => {
    render(<DemandsPage />);
    
    await waitFor(() => {
      expect(screen.getAllByText('Đang tìm kiếm')).toHaveLength(4);
    });
  });

  it('displays demand locations', async () => {
    render(<DemandsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Hà Nội')).toBeInTheDocument();
      expect(screen.getByText('Bắc Ninh')).toBeInTheDocument();
      expect(screen.getByText('Hưng Yên')).toBeInTheDocument();
    });
  });

  it('displays demand budgets', async () => {
    render(<DemandsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('500M - 1B VNĐ')).toBeInTheDocument();
      expect(screen.getByText('200M - 500M VNĐ')).toBeInTheDocument();
      expect(screen.getByText('100M - 300M VNĐ')).toBeInTheDocument();
    });
  });

  it('displays demand deadlines', async () => {
    render(<DemandsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Còn 30 ngày')).toBeInTheDocument();
      expect(screen.getByText('Còn 45 ngày')).toBeInTheDocument();
      expect(screen.getByText('Còn 60 ngày')).toBeInTheDocument();
    });
  });

  it('displays company names', async () => {
    render(<DemandsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Bệnh viện Đa khoa Hà Nội')).toBeInTheDocument();
      expect(screen.getByText('Công ty TNHH Sản xuất ABC')).toBeInTheDocument();
      expect(screen.getByText('Nông trại Thông minh XYZ')).toBeInTheDocument();
    });
  });

  it('displays view counts', async () => {
    render(<DemandsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('156 lượt xem')).toBeInTheDocument();
      expect(screen.getByText('89 lượt xem')).toBeInTheDocument();
      expect(screen.getByText('234 lượt xem')).toBeInTheDocument();
    });
  });

  it('updates search input value when typing', async () => {
    render(<DemandsPage />);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Tìm kiếm nhu cầu công nghệ...');
      
      fireEvent.change(searchInput, { target: { value: 'AI technology' } });
      
      expect(searchInput).toHaveValue('AI technology');
    });
  });

  it('filters demands when search is performed', async () => {
    render(<DemandsPage />);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Tìm kiếm nhu cầu công nghệ...');
      const searchButton = screen.getByText('Tìm kiếm');
      
      fireEvent.change(searchInput, { target: { value: 'AI' } });
      fireEvent.click(searchButton);
      
      // Should show only AI-related demands
      expect(screen.getByText('Tìm kiếm công nghệ AI cho chẩn đoán y tế')).toBeInTheDocument();
      expect(screen.queryByText('Công nghệ xử lý nước thải công nghiệp')).not.toBeInTheDocument();
    });
  });

  it('changes view mode when toggle buttons are clicked', async () => {
    render(<DemandsPage />);
    
    await waitFor(() => {
      const gridButton = screen.getByRole('button', { name: /grid/i });
      const listButton = screen.getByRole('button', { name: /list/i });
      
      // Initially grid view should be active
      expect(gridButton).toHaveClass('bg-blue-100', 'text-blue-700');
      
      // Click list view
      fireEvent.click(listButton);
      
      // List view should now be active
      expect(listButton).toHaveClass('bg-blue-100', 'text-blue-700');
      expect(gridButton).not.toHaveClass('bg-blue-100', 'text-blue-700');
    });
  });

  it('changes sort order when sort buttons are clicked', async () => {
    render(<DemandsPage />);
    
    await waitFor(() => {
      const dateSortButton = screen.getByText('Ngày tạo');
      const deadlineSortButton = screen.getByText('Hạn chót');
      
      // Click deadline sort
      fireEvent.click(deadlineSortButton);
      
      // Should update sort state
      expect(deadlineSortButton).toHaveClass('bg-blue-100', 'text-blue-700');
    });
  });

  it('filters demands by category', async () => {
    render(<DemandsPage />);
    
    await waitFor(() => {
      const categorySelect = screen.getByDisplayValue('Tất cả danh mục');
      
      fireEvent.change(categorySelect, { target: { value: 'Y tế' } });
      
      // Should filter demands by category
      expect(screen.getByText('Tìm kiếm công nghệ AI cho chẩn đoán y tế')).toBeInTheDocument();
      expect(screen.queryByText('Công nghệ xử lý nước thải công nghiệp')).not.toBeInTheDocument();
    });
  });

  it('filters demands by budget range', async () => {
    render(<DemandsPage />);
    
    await waitFor(() => {
      const budgetSelect = screen.getByDisplayValue('Tất cả ngân sách');
      
      fireEvent.change(budgetSelect, { target: { value: '500M-1B' } });
      
      // Should filter demands by budget
      expect(screen.getByText('Tìm kiếm công nghệ AI cho chẩn đoán y tế')).toBeInTheDocument();
      expect(screen.queryByText('Công nghệ xử lý nước thải công nghiệp')).not.toBeInTheDocument();
    });
  });

  it('filters demands by status', async () => {
    render(<DemandsPage />);
    
    await waitFor(() => {
      const statusSelect = screen.getByDisplayValue('Đang tìm kiếm');
      
      fireEvent.change(statusSelect, { target: { value: 'FULFILLED' } });
      
      // Should filter demands by status
      expect(screen.queryByText('Tìm kiếm công nghệ AI cho chẩn đoán y tế')).not.toBeInTheDocument();
    });
  });

  it('shows empty state when no demands found', async () => {
    render(<DemandsPage />);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Tìm kiếm nhu cầu công nghệ...');
      const searchButton = screen.getByText('Tìm kiếm');
      
      // Search for something that doesn't exist
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
      fireEvent.click(searchButton);
      
      expect(screen.getByText('Không tìm thấy nhu cầu nào')).toBeInTheDocument();
      expect(screen.getByText('Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc')).toBeInTheDocument();
    });
  });

  it('displays results count', async () => {
    render(<DemandsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Tìm thấy 4 nhu cầu')).toBeInTheDocument();
    });
  });

  it('has proper accessibility attributes', async () => {
    render(<DemandsPage />);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Tìm kiếm nhu cầu công nghệ...');
      const searchButton = screen.getByText('Tìm kiếm');
      
      expect(searchInput).toHaveAttribute('type', 'text');
      expect(searchButton).toHaveAttribute('type', 'submit');
    });
  });

  it('renders all demand cards with correct information', async () => {
    render(<DemandsPage />);
    
    await waitFor(() => {
      // Check first demand
      expect(screen.getByText('Tìm kiếm công nghệ AI cho chẩn đoán y tế')).toBeInTheDocument();
      expect(screen.getByText('Doanh nghiệp y tế cần công nghệ AI để phân tích hình ảnh X-quang và MRI, hỗ trợ chẩn đoán bệnh lý một cách chính xác và nhanh chóng.')).toBeInTheDocument();
      
      // Check second demand
      expect(screen.getByText('Công nghệ xử lý nước thải công nghiệp')).toBeInTheDocument();
      expect(screen.getByText('Nhà máy sản xuất cần giải pháp xử lý nước thải hiệu quả, tiết kiệm năng lượng và thân thiện với môi trường.')).toBeInTheDocument();
    });
  });
});
