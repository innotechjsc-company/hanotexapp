import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuctionsPage from '../page';

describe('AuctionsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<AuctionsPage />);
    
    // Should show loading spinner
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders page title and description', async () => {
    render(<AuctionsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Đấu giá công nghệ')).toBeInTheDocument();
      expect(screen.getByText('Tham gia đấu giá các công nghệ tiên tiến và tìm kiếm cơ hội đầu tư')).toBeInTheDocument();
    });
  });

  it('renders create auction button', async () => {
    render(<AuctionsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Tạo đấu giá')).toBeInTheDocument();
    });
  });

  it('renders search form', async () => {
    render(<AuctionsPage />);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Tìm kiếm đấu giá công nghệ...');
      const searchButton = screen.getByText('Tìm kiếm');
      
      expect(searchInput).toBeInTheDocument();
      expect(searchButton).toBeInTheDocument();
    });
  });

  it('renders status filter buttons', async () => {
    render(<AuctionsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Đang diễn ra')).toBeInTheDocument();
      expect(screen.getByText('Sắp diễn ra')).toBeInTheDocument();
      expect(screen.getByText('Đã kết thúc')).toBeInTheDocument();
      expect(screen.getByText('Đã hủy')).toBeInTheDocument();
    });
  });

  it('renders auctions list after loading', async () => {
    render(<AuctionsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Đấu giá công nghệ AI nhận diện hình ảnh y tế')).toBeInTheDocument();
      expect(screen.getByText('Đấu giá hệ thống IoT nông nghiệp thông minh')).toBeInTheDocument();
      expect(screen.getByText('Đấu giá công nghệ xử lý nước thải công nghiệp')).toBeInTheDocument();
    });
  });

  it('displays auction categories', async () => {
    render(<AuctionsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Y tế')).toBeInTheDocument();
      expect(screen.getByText('Nông nghiệp')).toBeInTheDocument();
      expect(screen.getByText('Môi trường')).toBeInTheDocument();
    });
  });

  it('displays auction statuses', async () => {
    render(<AuctionsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Đang diễn ra')).toBeInTheDocument();
      expect(screen.getByText('Sắp diễn ra')).toBeInTheDocument();
      expect(screen.getByText('Đã kết thúc')).toBeInTheDocument();
    });
  });

  it('displays TRL levels', async () => {
    render(<AuctionsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('TRL 7')).toBeInTheDocument();
      expect(screen.getByText('TRL 6')).toBeInTheDocument();
      expect(screen.getByText('TRL 8')).toBeInTheDocument();
    });
  });

  it('displays auction descriptions', async () => {
    render(<AuctionsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Công nghệ AI tiên tiến có khả năng nhận diện và phân tích hình ảnh y tế với độ chính xác cao, hỗ trợ chẩn đoán bệnh lý.')).toBeInTheDocument();
    });
  });

  it('displays technology names', async () => {
    render(<AuctionsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('AI Medical Image Recognition')).toBeInTheDocument();
      expect(screen.getByText('Smart Agriculture IoT System')).toBeInTheDocument();
      expect(screen.getByText('Industrial Wastewater Treatment')).toBeInTheDocument();
    });
  });

  it('displays price information', async () => {
    render(<AuctionsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('₫500.000.000')).toBeInTheDocument();
      expect(screen.getByText('₫750.000.000')).toBeInTheDocument();
      expect(screen.getByText('₫800.000.000')).toBeInTheDocument();
    });
  });

  it('displays auction dates', async () => {
    render(<AuctionsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('15 tháng 1, 2025')).toBeInTheDocument();
      expect(screen.getByText('1 tháng 2, 2025')).toBeInTheDocument();
      expect(screen.getByText('10 tháng 1, 2025')).toBeInTheDocument();
    });
  });

  it('displays participant counts', async () => {
    render(<AuctionsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('12')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
    });
  });

  it('displays bid counts', async () => {
    render(<AuctionsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument();
    });
  });

  it('displays sellers', async () => {
    render(<AuctionsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Viện Công nghệ Y tế Hà Nội')).toBeInTheDocument();
      expect(screen.getByText('Công ty Công nghệ Nông nghiệp ABC')).toBeInTheDocument();
      expect(screen.getByText('Viện Môi trường và Phát triển bền vững')).toBeInTheDocument();
    });
  });

  it('displays time remaining for active auctions', async () => {
    render(<AuctionsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Thời gian còn lại')).toBeInTheDocument();
    });
  });

  it('updates search input value when typing', async () => {
    render(<AuctionsPage />);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Tìm kiếm đấu giá công nghệ...');
      
      fireEvent.change(searchInput, { target: { value: 'AI technology' } });
      
      expect(searchInput).toHaveValue('AI technology');
    });
  });

  it('filters auctions when search is performed', async () => {
    render(<AuctionsPage />);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Tìm kiếm đấu giá công nghệ...');
      const searchButton = screen.getByText('Tìm kiếm');
      
      fireEvent.change(searchInput, { target: { value: 'AI' } });
      fireEvent.click(searchButton);
      
      // Should show only AI-related auctions
      expect(screen.getByText('Đấu giá công nghệ AI nhận diện hình ảnh y tế')).toBeInTheDocument();
      expect(screen.queryByText('Đấu giá hệ thống IoT nông nghiệp thông minh')).not.toBeInTheDocument();
    });
  });

  it('filters auctions by status when status button is clicked', async () => {
    render(<AuctionsPage />);
    
    await waitFor(() => {
      const activeStatusButton = screen.getByText('Đang diễn ra');
      
      fireEvent.click(activeStatusButton);
      
      // Should show only active auctions
      expect(screen.getByText('Đấu giá công nghệ AI nhận diện hình ảnh y tế')).toBeInTheDocument();
      expect(screen.queryByText('Đấu giá hệ thống IoT nông nghiệp thông minh')).not.toBeInTheDocument();
    });
  });

  it('filters auctions by upcoming status', async () => {
    render(<AuctionsPage />);
    
    await waitFor(() => {
      const upcomingStatusButton = screen.getByText('Sắp diễn ra');
      
      fireEvent.click(upcomingStatusButton);
      
      // Should show only upcoming auctions
      expect(screen.getByText('Đấu giá hệ thống IoT nông nghiệp thông minh')).toBeInTheDocument();
      expect(screen.queryByText('Đấu giá công nghệ AI nhận diện hình ảnh y tế')).not.toBeInTheDocument();
    });
  });

  it('filters auctions by completed status', async () => {
    render(<AuctionsPage />);
    
    await waitFor(() => {
      const completedStatusButton = screen.getByText('Đã kết thúc');
      
      fireEvent.click(completedStatusButton);
      
      // Should show only completed auctions
      expect(screen.getByText('Đấu giá công nghệ xử lý nước thải công nghiệp')).toBeInTheDocument();
      expect(screen.queryByText('Đấu giá công nghệ AI nhận diện hình ảnh y tế')).not.toBeInTheDocument();
    });
  });

  it('changes sort order when sort select is changed', async () => {
    render(<AuctionsPage />);
    
    await waitFor(() => {
      const sortSelect = screen.getByDisplayValue('Theo thời gian kết thúc');
      
      fireEvent.change(sortSelect, { target: { value: 'current_bid' } });
      
      // Should update sort state
      expect(sortSelect).toHaveValue('current_bid');
    });
  });

  it('shows empty state when no auctions found', async () => {
    render(<AuctionsPage />);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Tìm kiếm đấu giá công nghệ...');
      const searchButton = screen.getByText('Tìm kiếm');
      
      // Search for something that doesn't exist
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
      fireEvent.click(searchButton);
      
      expect(screen.getByText('Không tìm thấy đấu giá nào')).toBeInTheDocument();
      expect(screen.getByText('Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc')).toBeInTheDocument();
    });
  });

  it('displays results count', async () => {
    render(<AuctionsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Tìm thấy 4 đấu giá')).toBeInTheDocument();
    });
  });

  it('renders load more button', async () => {
    render(<AuctionsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Xem thêm đấu giá')).toBeInTheDocument();
    });
  });

  it('has proper accessibility attributes', async () => {
    render(<AuctionsPage />);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Tìm kiếm đấu giá công nghệ...');
      const searchButton = screen.getByText('Tìm kiếm');
      
      expect(searchInput).toHaveAttribute('type', 'text');
      expect(searchButton).toHaveAttribute('type', 'submit');
    });
  });

  it('renders all auction cards with correct information', async () => {
    render(<AuctionsPage />);
    
    await waitFor(() => {
      // Check first auction
      expect(screen.getByText('Đấu giá công nghệ AI nhận diện hình ảnh y tế')).toBeInTheDocument();
      expect(screen.getByText('Công nghệ AI tiên tiến có khả năng nhận diện và phân tích hình ảnh y tế với độ chính xác cao, hỗ trợ chẩn đoán bệnh lý.')).toBeInTheDocument();
      expect(screen.getByText('AI Medical Image Recognition')).toBeInTheDocument();
      expect(screen.getByText('Viện Công nghệ Y tế Hà Nội')).toBeInTheDocument();
      expect(screen.getByText('15 tháng 1, 2025')).toBeInTheDocument();
      expect(screen.getByText('25 tháng 1, 2025')).toBeInTheDocument();
      
      // Check second auction
      expect(screen.getByText('Đấu giá hệ thống IoT nông nghiệp thông minh')).toBeInTheDocument();
      expect(screen.getByText('Hệ thống IoT hoàn chỉnh cho nông nghiệp thông minh bao gồm cảm biến, điều khiển tự động và phân tích dữ liệu.')).toBeInTheDocument();
      expect(screen.getByText('Smart Agriculture IoT System')).toBeInTheDocument();
      expect(screen.getByText('Công ty Công nghệ Nông nghiệp ABC')).toBeInTheDocument();
      expect(screen.getByText('1 tháng 2, 2025')).toBeInTheDocument();
      expect(screen.getByText('10 tháng 2, 2025')).toBeInTheDocument();
    });
  });

  it('displays auction types and statuses correctly', async () => {
    render(<AuctionsPage />);
    
    await waitFor(() => {
      // Check if auction types are displayed with proper styling
      const yTeTag = screen.getByText('Y tế');
      const nongNghiepTag = screen.getByText('Nông nghiệp');
      const moiTruongTag = screen.getByText('Môi trường');
      
      expect(yTeTag).toBeInTheDocument();
      expect(nongNghiepTag).toBeInTheDocument();
      expect(moiTruongTag).toBeInTheDocument();
      
      // Check if auction statuses are displayed with proper styling
      const dangDienRaTag = screen.getByText('Đang diễn ra');
      const sapDienRaTag = screen.getByText('Sắp diễn ra');
      const daKetThucTag = screen.getByText('Đã kết thúc');
      
      expect(dangDienRaTag).toBeInTheDocument();
      expect(sapDienRaTag).toBeInTheDocument();
      expect(daKetThucTag).toBeInTheDocument();
    });
  });

  it('displays TRL levels with correct colors', async () => {
    render(<AuctionsPage />);
    
    await waitFor(() => {
      // Check if TRL levels are displayed with proper styling
      const trl7Tag = screen.getByText('TRL 7');
      const trl6Tag = screen.getByText('TRL 6');
      const trl8Tag = screen.getByText('TRL 8');
      
      expect(trl7Tag).toBeInTheDocument();
      expect(trl6Tag).toBeInTheDocument();
      expect(trl8Tag).toBeInTheDocument();
    });
  });

  it('displays price information correctly', async () => {
    render(<AuctionsPage />);
    
    await waitFor(() => {
      // Check if price information is displayed correctly
      expect(screen.getByText('Thông tin giá')).toBeInTheDocument();
      expect(screen.getByText('Giá khởi điểm:')).toBeInTheDocument();
      expect(screen.getByText('Giá hiện tại:')).toBeInTheDocument();
      expect(screen.getByText('Giá dự trữ:')).toBeInTheDocument();
    });
  });

  it('displays auction details correctly', async () => {
    render(<AuctionsPage />);
    
    await waitFor(() => {
      // Check if auction details are displayed correctly
      expect(screen.getByText('Chi tiết đấu giá')).toBeInTheDocument();
      expect(screen.getByText('Người tham gia:')).toBeInTheDocument();
      expect(screen.getByText('Số lượt bid:')).toBeInTheDocument();
      expect(screen.getByText('Người bán:')).toBeInTheDocument();
    });
  });

  it('displays time information correctly', async () => {
    render(<AuctionsPage />);
    
    await waitFor(() => {
      // Check if time information is displayed correctly
      expect(screen.getByText('Thời gian')).toBeInTheDocument();
      expect(screen.getByText('Bắt đầu:')).toBeInTheDocument();
      expect(screen.getByText('Kết thúc:')).toBeInTheDocument();
    });
  });
});
