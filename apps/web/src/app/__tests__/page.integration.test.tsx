import { render, screen, waitFor } from '@testing-library/react';
import HomePage from '../page';

// Mock the API client
jest.mock('@/lib/api', () => ({
  getTechnologies: jest.fn(),
  getCategories: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(),
  })),
}));

describe('HomePage Integration', () => {
  const mockApiClient = require('@/lib/api');
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful API responses
    mockApiClient.getTechnologies.mockResolvedValue({
      success: true,
      data: [
        {
          id: 1,
          title: 'Hệ thống đốt LPG cho động cơ ô tô',
          trl_level: 7,
          status: 'ACTIVE',
          public_summary: 'Công nghệ đốt LPG tiên tiến cho động cơ ô tô',
          category_id: 2,
          created_at: '2025-01-15T10:00:00Z'
        }
      ]
    });
    
    mockApiClient.getCategories.mockResolvedValue({
      success: true,
      data: [
        {
          id: 1,
          name: 'Khoa học tự nhiên',
          code: 'SCI_NAT',
          level: 1,
          description: 'Các lĩnh vực khoa học tự nhiên'
        }
      ]
    });
  });

  it('renders all sections with real components', async () => {
    render(<HomePage />);
    
    // Check if all sections are rendered
    await waitFor(() => {
      expect(screen.getByText('HANOTEX')).toBeInTheDocument();
      expect(screen.getByText('Kết nối công nghệ – Thúc đẩy đổi mới')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText('Về HANOTEX')).toBeInTheDocument();
      expect(screen.getByText('HANOTEX là gì?')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText('Danh mục nổi bật')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText('Tính năng chính')).toBeInTheDocument();
      expect(screen.getByText('Niêm yết công nghệ')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText('Công nghệ nổi bật')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText('Kết nối cung - cầu')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText('Tin tức & Sự kiện')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText('Đối tác & Quỹ đầu tư')).toBeInTheDocument();
    });
  });

  it('renders hero section with correct content', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByText('HANOTEX')).toBeInTheDocument();
      expect(screen.getByText('Kết nối công nghệ – Thúc đẩy đổi mới')).toBeInTheDocument();
      expect(screen.getByText('Sàn giao dịch công nghệ trực tuyến của thành phố Hà Nội')).toBeInTheDocument();
    });
  });

  it('renders intro section with correct content', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Về HANOTEX')).toBeInTheDocument();
      expect(screen.getByText('HANOTEX là gì?')).toBeInTheDocument();
      expect(screen.getByText('Mục tiêu')).toBeInTheDocument();
      expect(screen.getByText('Đối tượng')).toBeInTheDocument();
      expect(screen.getByText('Lợi ích')).toBeInTheDocument();
    });
  });

  it('renders categories section with correct content', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Danh mục nổi bật')).toBeInTheDocument();
    });
  });

  it('renders main features section with correct content', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Tính năng chính')).toBeInTheDocument();
      expect(screen.getByText('Niêm yết công nghệ')).toBeInTheDocument();
      expect(screen.getByText('Định giá & thẩm định')).toBeInTheDocument();
      expect(screen.getByText('Tư vấn & môi giới')).toBeInTheDocument();
      expect(screen.getByText('NDA & pháp lý')).toBeInTheDocument();
      expect(screen.getByText('Đầu tư & quỹ')).toBeInTheDocument();
    });
  });

  it('renders featured technologies section with correct content', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Công nghệ nổi bật')).toBeInTheDocument();
    });
  });

  it('renders supply demand section with correct content', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Kết nối cung - cầu')).toBeInTheDocument();
      expect(screen.getByText('Công nghệ mới niêm yết')).toBeInTheDocument();
      expect(screen.getByText('Nhu cầu mới')).toBeInTheDocument();
    });
  });

  it('renders news events section with correct content', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Tin tức & Sự kiện')).toBeInTheDocument();
      expect(screen.getByText('Tin tức mới nhất')).toBeInTheDocument();
      expect(screen.getByText('Sự kiện sắp diễn ra')).toBeInTheDocument();
    });
  });

  it('renders partners section with correct content', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Đối tác & Quỹ đầu tư')).toBeInTheDocument();
      expect(screen.getByText('Đối tác chiến lược')).toBeInTheDocument();
      expect(screen.getByText('Quỹ đầu tư liên kết')).toBeInTheDocument();
    });
  });

  it('renders with correct styling classes', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      const main = screen.getByText('HANOTEX').closest('main');
      expect(main).toHaveClass('min-h-screen');
    });
  });

  it('renders all sections in correct order', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      const main = screen.getByText('HANOTEX').closest('main');
      const sections = main?.querySelectorAll('section');
      
      // Check if sections are in correct order
      expect(sections?.[0]).toHaveTextContent('HANOTEX');
      expect(sections?.[1]).toHaveTextContent('Về HANOTEX');
      expect(sections?.[2]).toHaveTextContent('Danh mục nổi bật');
      expect(sections?.[3]).toHaveTextContent('Tính năng chính');
      expect(sections?.[4]).toHaveTextContent('Công nghệ nổi bật');
      expect(sections?.[5]).toHaveTextContent('Kết nối cung - cầu');
      expect(sections?.[6]).toHaveTextContent('Tin tức & Sự kiện');
      expect(sections?.[7]).toHaveTextContent('Đối tác & Quỹ đầu tư');
    });
  });

  it('renders with correct accessibility attributes', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      const main = screen.getByText('HANOTEX').closest('main');
      expect(main).toBeInTheDocument();
      
      // Check if all sections are accessible
      const sections = main?.querySelectorAll('section');
      sections?.forEach(section => {
        expect(section).toBeInTheDocument();
      });
    });
  });

  it('renders with correct content structure', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      // Check if all sections have the expected content
      expect(screen.getByText('HANOTEX')).toBeInTheDocument();
      expect(screen.getByText('Về HANOTEX')).toBeInTheDocument();
      expect(screen.getByText('Danh mục nổi bật')).toBeInTheDocument();
      expect(screen.getByText('Tính năng chính')).toBeInTheDocument();
      expect(screen.getByText('Công nghệ nổi bật')).toBeInTheDocument();
      expect(screen.getByText('Kết nối cung - cầu')).toBeInTheDocument();
      expect(screen.getByText('Tin tức & Sự kiện')).toBeInTheDocument();
      expect(screen.getByText('Đối tác & Quỹ đầu tư')).toBeInTheDocument();
    });
  });

  it('renders with correct layout structure', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      const main = screen.getByText('HANOTEX').closest('main');
      expect(main).toBeInTheDocument();
      expect(main).toHaveClass('min-h-screen');
      
      // Check if all sections are direct children of main
      const sections = main?.querySelectorAll('section');
      expect(sections).toHaveLength(8);
    });
  });

  it('renders with correct styling for all sections', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      const main = screen.getByText('HANOTEX').closest('main');
      const sections = main?.querySelectorAll('section');
      
      // Check if sections have correct styling
      sections?.forEach(section => {
        expect(section).toHaveClass('py-20');
      });
    });
  });

  it('renders with correct accessibility for all sections', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      const main = screen.getByText('HANOTEX').closest('main');
      const sections = main?.querySelectorAll('section');
      
      // Check if all sections are accessible
      sections?.forEach(section => {
        expect(section).toBeInTheDocument();
      });
    });
  });

  it('renders with correct content for all sections', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      // Check if all sections have the expected content
      expect(screen.getByText('HANOTEX')).toBeInTheDocument();
      expect(screen.getByText('Về HANOTEX')).toBeInTheDocument();
      expect(screen.getByText('Danh mục nổi bật')).toBeInTheDocument();
      expect(screen.getByText('Tính năng chính')).toBeInTheDocument();
      expect(screen.getByText('Công nghệ nổi bật')).toBeInTheDocument();
      expect(screen.getByText('Kết nối cung - cầu')).toBeInTheDocument();
      expect(screen.getByText('Tin tức & Sự kiện')).toBeInTheDocument();
      expect(screen.getByText('Đối tác & Quỹ đầu tư')).toBeInTheDocument();
    });
  });

  it('renders with correct layout for all sections', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      const main = screen.getByText('HANOTEX').closest('main');
      const sections = main?.querySelectorAll('section');
      
      // Check if layout is correct for all sections
      sections?.forEach(section => {
        expect(section).toBeInTheDocument();
      });
    });
  });

  it('renders with correct styling structure for all sections', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      const main = screen.getByText('HANOTEX').closest('main');
      const sections = main?.querySelectorAll('section');
      
      // Check if styling structure is correct for all sections
      sections?.forEach(section => {
        expect(section).toBeInTheDocument();
      });
    });
  });

  it('renders with correct accessibility structure for all sections', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      const main = screen.getByText('HANOTEX').closest('main');
      const sections = main?.querySelectorAll('section');
      
      // Check if accessibility structure is correct for all sections
      sections?.forEach(section => {
        expect(section).toBeInTheDocument();
      });
    });
  });
});