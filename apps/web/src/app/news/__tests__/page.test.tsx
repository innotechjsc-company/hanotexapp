import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NewsPage from '../page';

describe('NewsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<NewsPage />);
    
    // Should show loading spinner
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders page title and description', async () => {
    render(<NewsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Tin tức & Thông báo')).toBeInTheDocument();
      expect(screen.getByText('Cập nhật những thông tin mới nhất về khoa học công nghệ và các sự kiện quan trọng')).toBeInTheDocument();
    });
  });

  it('renders search form', async () => {
    render(<NewsPage />);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Tìm kiếm tin tức...');
      const searchButton = screen.getByText('Tìm kiếm');
      
      expect(searchInput).toBeInTheDocument();
      expect(searchButton).toBeInTheDocument();
    });
  });

  it('renders category filter buttons', async () => {
    render(<NewsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Tất cả')).toBeInTheDocument();
      expect(screen.getByText('Tin tức')).toBeInTheDocument();
      expect(screen.getByText('Sự kiện')).toBeInTheDocument();
      expect(screen.getByText('Chính sách')).toBeInTheDocument();
      expect(screen.getByText('Hướng dẫn')).toBeInTheDocument();
      expect(screen.getByText('Thông báo')).toBeInTheDocument();
    });
  });

  it('renders articles list after loading', async () => {
    render(<NewsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('HANOTEX chính thức ra mắt sàn giao dịch công nghệ')).toBeInTheDocument();
      expect(screen.getByText('Hội thảo "Xu hướng công nghệ 2025" tại Hà Nội')).toBeInTheDocument();
      expect(screen.getByText('Chính sách hỗ trợ doanh nghiệp khởi nghiệp công nghệ')).toBeInTheDocument();
    });
  });

  it('displays article categories', async () => {
    render(<NewsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Tin tức')).toBeInTheDocument();
      expect(screen.getByText('Sự kiện')).toBeInTheDocument();
      expect(screen.getByText('Chính sách')).toBeInTheDocument();
    });
  });

  it('displays article excerpts', async () => {
    render(<NewsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Sàn giao dịch công nghệ HANOTEX đã chính thức đi vào hoạt động, kết nối các bên trong hệ sinh thái khoa học công nghệ Hà Nội với mục tiêu thúc đẩy chuyển giao và thương mại hóa công nghệ.')).toBeInTheDocument();
    });
  });

  it('displays article authors', async () => {
    render(<NewsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Ban biên tập HANOTEX')).toBeInTheDocument();
      expect(screen.getByText('Phòng tổ chức sự kiện')).toBeInTheDocument();
      expect(screen.getByText('Sở KH&CN Hà Nội')).toBeInTheDocument();
    });
  });

  it('displays article dates', async () => {
    render(<NewsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('15 tháng 1, 2025')).toBeInTheDocument();
      expect(screen.getByText('12 tháng 1, 2025')).toBeInTheDocument();
      expect(screen.getByText('10 tháng 1, 2025')).toBeInTheDocument();
    });
  });

  it('displays read times', async () => {
    render(<NewsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('3 phút')).toBeInTheDocument();
      expect(screen.getByText('5 phút')).toBeInTheDocument();
      expect(screen.getByText('4 phút')).toBeInTheDocument();
    });
  });

  it('displays view counts', async () => {
    render(<NewsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('1250 lượt xem')).toBeInTheDocument();
      expect(screen.getByText('890 lượt xem')).toBeInTheDocument();
      expect(screen.getByText('1560 lượt xem')).toBeInTheDocument();
    });
  });

  it('displays article tags', async () => {
    render(<NewsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('HANOTEX')).toBeInTheDocument();
      expect(screen.getByText('Ra mắt')).toBeInTheDocument();
      expect(screen.getByText('Công nghệ')).toBeInTheDocument();
    });
  });

  it('updates search input value when typing', async () => {
    render(<NewsPage />);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Tìm kiếm tin tức...');
      
      fireEvent.change(searchInput, { target: { value: 'HANOTEX' } });
      
      expect(searchInput).toHaveValue('HANOTEX');
    });
  });

  it('filters articles when search is performed', async () => {
    render(<NewsPage />);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Tìm kiếm tin tức...');
      const searchButton = screen.getByText('Tìm kiếm');
      
      fireEvent.change(searchInput, { target: { value: 'HANOTEX' } });
      fireEvent.click(searchButton);
      
      // Should show only HANOTEX-related articles
      expect(screen.getByText('HANOTEX chính thức ra mắt sàn giao dịch công nghệ')).toBeInTheDocument();
      expect(screen.queryByText('Hội thảo "Xu hướng công nghệ 2025" tại Hà Nội')).not.toBeInTheDocument();
    });
  });

  it('filters articles by category when category button is clicked', async () => {
    render(<NewsPage />);
    
    await waitFor(() => {
      const newsCategoryButton = screen.getByText('Tin tức');
      
      fireEvent.click(newsCategoryButton);
      
      // Should show only news articles
      expect(screen.getByText('HANOTEX chính thức ra mắt sàn giao dịch công nghệ')).toBeInTheDocument();
      expect(screen.queryByText('Hội thảo "Xu hướng công nghệ 2025" tại Hà Nội')).not.toBeInTheDocument();
    });
  });

  it('shows all articles when "Tất cả" category is selected', async () => {
    render(<NewsPage />);
    
    await waitFor(() => {
      const allCategoryButton = screen.getByText('Tất cả');
      
      fireEvent.click(allCategoryButton);
      
      // Should show all articles
      expect(screen.getByText('HANOTEX chính thức ra mắt sàn giao dịch công nghệ')).toBeInTheDocument();
      expect(screen.getByText('Hội thảo "Xu hướng công nghệ 2025" tại Hà Nội')).toBeInTheDocument();
      expect(screen.getByText('Chính sách hỗ trợ doanh nghiệp khởi nghiệp công nghệ')).toBeInTheDocument();
    });
  });

  it('changes sort order when sort select is changed', async () => {
    render(<NewsPage />);
    
    await waitFor(() => {
      const sortSelect = screen.getByDisplayValue('Mới nhất');
      
      fireEvent.change(sortSelect, { target: { value: 'views' } });
      
      // Should update sort state
      expect(sortSelect).toHaveValue('views');
    });
  });

  it('shows empty state when no articles found', async () => {
    render(<NewsPage />);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Tìm kiếm tin tức...');
      const searchButton = screen.getByText('Tìm kiếm');
      
      // Search for something that doesn't exist
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
      fireEvent.click(searchButton);
      
      expect(screen.getByText('Không tìm thấy bài viết nào')).toBeInTheDocument();
      expect(screen.getByText('Hãy thử thay đổi từ khóa tìm kiếm hoặc danh mục')).toBeInTheDocument();
    });
  });

  it('displays results count', async () => {
    render(<NewsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Tìm thấy 5 bài viết')).toBeInTheDocument();
    });
  });

  it('renders load more button', async () => {
    render(<NewsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Xem thêm bài viết')).toBeInTheDocument();
    });
  });

  it('has proper accessibility attributes', async () => {
    render(<NewsPage />);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Tìm kiếm tin tức...');
      const searchButton = screen.getByText('Tìm kiếm');
      
      expect(searchInput).toHaveAttribute('type', 'text');
      expect(searchButton).toHaveAttribute('type', 'submit');
    });
  });

  it('renders all article cards with correct information', async () => {
    render(<NewsPage />);
    
    await waitFor(() => {
      // Check first article
      expect(screen.getByText('HANOTEX chính thức ra mắt sàn giao dịch công nghệ')).toBeInTheDocument();
      expect(screen.getByText('Sàn giao dịch công nghệ HANOTEX đã chính thức đi vào hoạt động, kết nối các bên trong hệ sinh thái khoa học công nghệ Hà Nội với mục tiêu thúc đẩy chuyển giao và thương mại hóa công nghệ.')).toBeInTheDocument();
      expect(screen.getByText('Ban biên tập HANOTEX')).toBeInTheDocument();
      expect(screen.getByText('15 tháng 1, 2025')).toBeInTheDocument();
      expect(screen.getByText('3 phút')).toBeInTheDocument();
      expect(screen.getByText('1250 lượt xem')).toBeInTheDocument();
      
      // Check second article
      expect(screen.getByText('Hội thảo "Xu hướng công nghệ 2025" tại Hà Nội')).toBeInTheDocument();
      expect(screen.getByText('Hội thảo quy tụ các chuyên gia hàng đầu trong lĩnh vực AI, IoT và công nghệ sinh học để thảo luận về xu hướng phát triển và cơ hội hợp tác trong năm 2025.')).toBeInTheDocument();
      expect(screen.getByText('Phòng tổ chức sự kiện')).toBeInTheDocument();
      expect(screen.getByText('12 tháng 1, 2025')).toBeInTheDocument();
      expect(screen.getByText('5 phút')).toBeInTheDocument();
      expect(screen.getByText('890 lượt xem')).toBeInTheDocument();
    });
  });

  it('displays article tags correctly', async () => {
    render(<NewsPage />);
    
    await waitFor(() => {
      // Check if tags are displayed with proper styling
      const hanotexTag = screen.getByText('HANOTEX');
      const raMatTag = screen.getByText('Ra mắt');
      const congNgheTag = screen.getByText('Công nghệ');
      
      expect(hanotexTag).toBeInTheDocument();
      expect(raMatTag).toBeInTheDocument();
      expect(congNgheTag).toBeInTheDocument();
    });
  });
});
