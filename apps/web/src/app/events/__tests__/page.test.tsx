import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EventsPage from '../page';

describe('EventsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<EventsPage />);
    
    // Should show loading spinner
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders page title and description', async () => {
    render(<EventsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Sự kiện & Hội thảo')).toBeInTheDocument();
      expect(screen.getByText('Tham gia các sự kiện, hội thảo và triển lãm công nghệ quan trọng')).toBeInTheDocument();
    });
  });

  it('renders create event button', async () => {
    render(<EventsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Đăng sự kiện')).toBeInTheDocument();
    });
  });

  it('renders search form', async () => {
    render(<EventsPage />);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Tìm kiếm sự kiện...');
      const searchButton = screen.getByText('Tìm kiếm');
      
      expect(searchInput).toBeInTheDocument();
      expect(searchButton).toBeInTheDocument();
    });
  });

  it('renders filter options', async () => {
    render(<EventsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Loại sự kiện')).toBeInTheDocument();
      expect(screen.getByText('Trạng thái')).toBeInTheDocument();
    });
  });

  it('renders events list after loading', async () => {
    render(<EventsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Techmart Hà Nội 2025')).toBeInTheDocument();
      expect(screen.getByText('Đấu giá công nghệ AI & Machine Learning')).toBeInTheDocument();
      expect(screen.getByText('Hội thảo chuyển giao công nghệ')).toBeInTheDocument();
    });
  });

  it('displays event types', async () => {
    render(<EventsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Triển lãm')).toBeInTheDocument();
      expect(screen.getByText('Đấu giá')).toBeInTheDocument();
      expect(screen.getByText('Hội thảo')).toBeInTheDocument();
    });
  });

  it('displays event statuses', async () => {
    render(<EventsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Sắp diễn ra')).toBeInTheDocument();
      expect(screen.getByText('Đã kết thúc')).toBeInTheDocument();
    });
  });

  it('displays event descriptions', async () => {
    render(<EventsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Triển lãm công nghệ và sản phẩm khoa học công nghệ lớn nhất Hà Nội với sự tham gia của hơn 200 doanh nghiệp và viện nghiên cứu.')).toBeInTheDocument();
    });
  });

  it('displays event dates', async () => {
    render(<EventsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('25 tháng 2, 2025')).toBeInTheDocument();
      expect(screen.getByText('15 tháng 3, 2025')).toBeInTheDocument();
      expect(screen.getByText('20 tháng 3, 2025')).toBeInTheDocument();
    });
  });

  it('displays event times', async () => {
    render(<EventsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('08:00 - 17:00')).toBeInTheDocument();
      expect(screen.getByText('14:00 - 16:00')).toBeInTheDocument();
      expect(screen.getByText('09:00 - 12:00')).toBeInTheDocument();
    });
  });

  it('displays event locations', async () => {
    render(<EventsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Trung tâm Hội nghị Quốc gia')).toBeInTheDocument();
      expect(screen.getByText('Sở KH&CN Hà Nội')).toBeInTheDocument();
      expect(screen.getByText('Trường Đại học Bách Khoa Hà Nội')).toBeInTheDocument();
    });
  });

  it('displays attendee counts', async () => {
    render(<EventsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('500+ người tham gia')).toBeInTheDocument();
      expect(screen.getByText('200+ người tham gia')).toBeInTheDocument();
      expect(screen.getByText('150+ người tham gia')).toBeInTheDocument();
    });
  });

  it('displays organizers', async () => {
    render(<EventsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Sở KH&CN Hà Nội')).toBeInTheDocument();
      expect(screen.getByText('HANOTEX')).toBeInTheDocument();
      expect(screen.getByText('Đại học Bách Khoa Hà Nội')).toBeInTheDocument();
    });
  });

  it('displays registration requirements', async () => {
    render(<EventsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Cần đăng ký')).toBeInTheDocument();
    });
  });

  it('displays registration deadlines', async () => {
    render(<EventsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Hạn đăng ký: 20 tháng 2, 2025')).toBeInTheDocument();
      expect(screen.getByText('Hạn đăng ký: 10 tháng 3, 2025')).toBeInTheDocument();
      expect(screen.getByText('Hạn đăng ký: 15 tháng 3, 2025')).toBeInTheDocument();
    });
  });

  it('updates search input value when typing', async () => {
    render(<EventsPage />);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Tìm kiếm sự kiện...');
      
      fireEvent.change(searchInput, { target: { value: 'Techmart' } });
      
      expect(searchInput).toHaveValue('Techmart');
    });
  });

  it('filters events when search is performed', async () => {
    render(<EventsPage />);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Tìm kiếm sự kiện...');
      const searchButton = screen.getByText('Tìm kiếm');
      
      fireEvent.change(searchInput, { target: { value: 'Techmart' } });
      fireEvent.click(searchButton);
      
      // Should show only Techmart-related events
      expect(screen.getByText('Techmart Hà Nội 2025')).toBeInTheDocument();
      expect(screen.queryByText('Đấu giá công nghệ AI & Machine Learning')).not.toBeInTheDocument();
    });
  });

  it('filters events by type when type select is changed', async () => {
    render(<EventsPage />);
    
    await waitFor(() => {
      const typeSelect = screen.getByDisplayValue('Tất cả');
      
      fireEvent.change(typeSelect, { target: { value: 'Triển lãm' } });
      
      // Should filter events by type
      expect(screen.getByText('Techmart Hà Nội 2025')).toBeInTheDocument();
      expect(screen.queryByText('Đấu giá công nghệ AI & Machine Learning')).not.toBeInTheDocument();
    });
  });

  it('filters events by status when status select is changed', async () => {
    render(<EventsPage />);
    
    await waitFor(() => {
      const statusSelect = screen.getByDisplayValue('Sắp diễn ra');
      
      fireEvent.change(statusSelect, { target: { value: 'completed' } });
      
      // Should filter events by status
      expect(screen.getByText('Hội nghị "Xu hướng công nghệ 2025"')).toBeInTheDocument();
      expect(screen.queryByText('Techmart Hà Nội 2025')).not.toBeInTheDocument();
    });
  });

  it('changes sort order when sort select is changed', async () => {
    render(<EventsPage />);
    
    await waitFor(() => {
      const sortSelect = screen.getByDisplayValue('Theo ngày');
      
      fireEvent.change(sortSelect, { target: { value: 'title' } });
      
      // Should update sort state
      expect(sortSelect).toHaveValue('title');
    });
  });

  it('shows empty state when no events found', async () => {
    render(<EventsPage />);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Tìm kiếm sự kiện...');
      const searchButton = screen.getByText('Tìm kiếm');
      
      // Search for something that doesn't exist
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
      fireEvent.click(searchButton);
      
      expect(screen.getByText('Không tìm thấy sự kiện nào')).toBeInTheDocument();
      expect(screen.getByText('Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc')).toBeInTheDocument();
    });
  });

  it('displays results count', async () => {
    render(<EventsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Tìm thấy 4 sự kiện')).toBeInTheDocument();
    });
  });

  it('renders load more button', async () => {
    render(<EventsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Xem thêm sự kiện')).toBeInTheDocument();
    });
  });

  it('has proper accessibility attributes', async () => {
    render(<EventsPage />);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Tìm kiếm sự kiện...');
      const searchButton = screen.getByText('Tìm kiếm');
      
      expect(searchInput).toHaveAttribute('type', 'text');
      expect(searchButton).toHaveAttribute('type', 'submit');
    });
  });

  it('renders all event cards with correct information', async () => {
    render(<EventsPage />);
    
    await waitFor(() => {
      // Check first event
      expect(screen.getByText('Techmart Hà Nội 2025')).toBeInTheDocument();
      expect(screen.getByText('Triển lãm công nghệ và sản phẩm khoa học công nghệ lớn nhất Hà Nội với sự tham gia của hơn 200 doanh nghiệp và viện nghiên cứu.')).toBeInTheDocument();
      expect(screen.getByText('Sở KH&CN Hà Nội')).toBeInTheDocument();
      expect(screen.getByText('25 tháng 2, 2025')).toBeInTheDocument();
      expect(screen.getByText('08:00 - 17:00')).toBeInTheDocument();
      expect(screen.getByText('Trung tâm Hội nghị Quốc gia')).toBeInTheDocument();
      expect(screen.getByText('500+ người tham gia')).toBeInTheDocument();
      
      // Check second event
      expect(screen.getByText('Đấu giá công nghệ AI & Machine Learning')).toBeInTheDocument();
      expect(screen.getByText('Sự kiện đấu giá các công nghệ AI và Machine Learning từ các viện nghiên cứu và doanh nghiệp công nghệ hàng đầu.')).toBeInTheDocument();
      expect(screen.getByText('HANOTEX')).toBeInTheDocument();
      expect(screen.getByText('15 tháng 3, 2025')).toBeInTheDocument();
      expect(screen.getByText('14:00 - 16:00')).toBeInTheDocument();
      expect(screen.getByText('Sở KH&CN Hà Nội')).toBeInTheDocument();
      expect(screen.getByText('200+ người tham gia')).toBeInTheDocument();
    });
  });

  it('displays event types and statuses correctly', async () => {
    render(<EventsPage />);
    
    await waitFor(() => {
      // Check if event types are displayed with proper styling
      const trienLamTag = screen.getByText('Triển lãm');
      const dauGiaTag = screen.getByText('Đấu giá');
      const hoiThaoTag = screen.getByText('Hội thảo');
      
      expect(trienLamTag).toBeInTheDocument();
      expect(dauGiaTag).toBeInTheDocument();
      expect(hoiThaoTag).toBeInTheDocument();
      
      // Check if event statuses are displayed with proper styling
      const sapDienRaTag = screen.getByText('Sắp diễn ra');
      const daKetThucTag = screen.getByText('Đã kết thúc');
      
      expect(sapDienRaTag).toBeInTheDocument();
      expect(daKetThucTag).toBeInTheDocument();
    });
  });

  it('displays registration requirements and deadlines correctly', async () => {
    render(<EventsPage />);
    
    await waitFor(() => {
      // Check if registration requirements are displayed
      expect(screen.getByText('Cần đăng ký')).toBeInTheDocument();
      
      // Check if registration deadlines are displayed
      expect(screen.getByText('Hạn đăng ký: 20 tháng 2, 2025')).toBeInTheDocument();
      expect(screen.getByText('Hạn đăng ký: 10 tháng 3, 2025')).toBeInTheDocument();
      expect(screen.getByText('Hạn đăng ký: 15 tháng 3, 2025')).toBeInTheDocument();
    });
  });
});
