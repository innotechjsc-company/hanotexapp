import { render, screen, waitFor } from '@testing-library/react';
import SupplyDemandSection from '../SupplyDemandSection';

// Mock the API client
jest.mock('@/lib/api', () => ({
  getTechnologies: jest.fn(),
}));

describe('SupplyDemandSection', () => {
  const mockApiClient = require('@/lib/api');
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful API response
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
        },
        {
          id: 2,
          title: 'Hệ thống AI nhận diện bệnh lý từ hình ảnh y tế',
          trl_level: 6,
          status: 'ACTIVE',
          public_summary: 'Ứng dụng trí tuệ nhân tạo trong chẩn đoán y tế',
          category_id: 3,
          created_at: '2025-01-14T10:00:00Z'
        }
      ]
    });
  });

  it('renders loading state initially', () => {
    render(<SupplyDemandSection />);
    
    // Should show loading spinner
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders section title and description', async () => {
    render(<SupplyDemandSection />);
    
    await waitFor(() => {
      expect(screen.getByText('Kết nối cung - cầu')).toBeInTheDocument();
      expect(screen.getByText('Khám phá công nghệ mới và nhu cầu thị trường để tạo ra những kết nối có giá trị')).toBeInTheDocument();
    });
  });

  it('renders supply side section', async () => {
    render(<SupplyDemandSection />);
    
    await waitFor(() => {
      expect(screen.getByText('Công nghệ mới niêm yết')).toBeInTheDocument();
      expect(screen.getByText('Xem tất cả')).toBeInTheDocument();
    });
  });

  it('renders demand side section', async () => {
    render(<SupplyDemandSection />);
    
    await waitFor(() => {
      expect(screen.getByText('Nhu cầu mới')).toBeInTheDocument();
      expect(screen.getByText('Xem tất cả')).toBeInTheDocument();
    });
  });

  it('renders technologies list after loading', async () => {
    render(<SupplyDemandSection />);
    
    await waitFor(() => {
      expect(screen.getByText('Hệ thống đốt LPG cho động cơ ô tô')).toBeInTheDocument();
      expect(screen.getByText('Hệ thống AI nhận diện bệnh lý từ hình ảnh y tế')).toBeInTheDocument();
    });
  });

  it('renders demands list', async () => {
    render(<SupplyDemandSection />);
    
    await waitFor(() => {
      expect(screen.getByText('Tìm kiếm công nghệ AI cho chẩn đoán y tế')).toBeInTheDocument();
      expect(screen.getByText('Công nghệ xử lý nước thải công nghiệp')).toBeInTheDocument();
      expect(screen.getByText('Hệ thống IoT cho nông nghiệp thông minh')).toBeInTheDocument();
    });
  });

  it('displays TRL levels for technologies', async () => {
    render(<SupplyDemandSection />);
    
    await waitFor(() => {
      expect(screen.getByText('TRL 7')).toBeInTheDocument();
      expect(screen.getByText('TRL 6')).toBeInTheDocument();
    });
  });

  it('displays demand categories', async () => {
    render(<SupplyDemandSection />);
    
    await waitFor(() => {
      expect(screen.getByText('Y tế')).toBeInTheDocument();
      expect(screen.getByText('Môi trường')).toBeInTheDocument();
      expect(screen.getByText('Nông nghiệp')).toBeInTheDocument();
    });
  });

  it('displays demand locations', async () => {
    render(<SupplyDemandSection />);
    
    await waitFor(() => {
      expect(screen.getByText('Hà Nội')).toBeInTheDocument();
      expect(screen.getByText('Bắc Ninh')).toBeInTheDocument();
      expect(screen.getByText('Hưng Yên')).toBeInTheDocument();
    });
  });

  it('displays demand budgets', async () => {
    render(<SupplyDemandSection />);
    
    await waitFor(() => {
      expect(screen.getByText('500M - 1B VNĐ')).toBeInTheDocument();
      expect(screen.getByText('200M - 500M VNĐ')).toBeInTheDocument();
      expect(screen.getByText('100M - 300M VNĐ')).toBeInTheDocument();
    });
  });

  it('displays demand deadlines', async () => {
    render(<SupplyDemandSection />);
    
    await waitFor(() => {
      expect(screen.getByText('Còn 30 ngày')).toBeInTheDocument();
      expect(screen.getByText('Còn 45 ngày')).toBeInTheDocument();
      expect(screen.getByText('Còn 60 ngày')).toBeInTheDocument();
    });
  });

  it('displays view counts', async () => {
    render(<SupplyDemandSection />);
    
    await waitFor(() => {
      expect(screen.getByText('123 lượt xem')).toBeInTheDocument();
      expect(screen.getByText('156 lượt xem')).toBeInTheDocument();
      expect(screen.getByText('89 lượt xem')).toBeInTheDocument();
      expect(screen.getByText('234 lượt xem')).toBeInTheDocument();
    });
  });

  it('renders CTA section', async () => {
    render(<SupplyDemandSection />);
    
    await waitFor(() => {
      expect(screen.getByText('Bạn có công nghệ hoặc nhu cầu?')).toBeInTheDocument();
      expect(screen.getByText('Tham gia ngay để kết nối với cộng đồng khoa học công nghệ và tìm kiếm cơ hội hợp tác')).toBeInTheDocument();
    });
  });

  it('renders CTA buttons', async () => {
    render(<SupplyDemandSection />);
    
    await waitFor(() => {
      expect(screen.getByText('Đăng công nghệ')).toBeInTheDocument();
      expect(screen.getByText('Đăng nhu cầu')).toBeInTheDocument();
    });
  });

  it('renders with correct styling classes', async () => {
    render(<SupplyDemandSection />);
    
    await waitFor(() => {
      const supplyDemandSection = screen.getByText('Kết nối cung - cầu').closest('section');
      expect(supplyDemandSection).toHaveClass('py-20', 'bg-gray-50');
    });
  });

  it('renders technology cards with correct styling', async () => {
    render(<SupplyDemandSection />);
    
    await waitFor(() => {
      const technologyCards = screen.getAllByText(/Hệ thống đốt LPG|Hệ thống AI nhận diện/);
      
      technologyCards.forEach(card => {
        const cardElement = card.closest('div');
        expect(cardElement).toHaveClass('bg-white', 'rounded-xl', 'shadow-lg', 'border', 'border-gray-200', 'hover:shadow-xl', 'transition-all', 'duration-300', 'p-6');
      });
    });
  });

  it('renders demand cards with correct styling', async () => {
    render(<SupplyDemandSection />);
    
    await waitFor(() => {
      const demandCards = screen.getAllByText(/Tìm kiếm công nghệ AI|Công nghệ xử lý nước thải|Hệ thống IoT cho nông nghiệp/);
      
      demandCards.forEach(card => {
        const cardElement = card.closest('div');
        expect(cardElement).toHaveClass('bg-white', 'rounded-xl', 'shadow-lg', 'border', 'border-gray-200', 'hover:shadow-xl', 'transition-all', 'duration-300', 'p-6');
      });
    });
  });

  it('renders CTA section with correct styling', async () => {
    render(<SupplyDemandSection />);
    
    await waitFor(() => {
      const ctaSection = screen.getByText('Bạn có công nghệ hoặc nhu cầu?').closest('div');
      expect(ctaSection).toHaveClass('bg-gradient-to-r', 'from-blue-50', 'to-blue-100', 'rounded-2xl', 'p-8');
    });
  });

  it('renders CTA buttons with correct styling', async () => {
    render(<SupplyDemandSection />);
    
    await waitFor(() => {
      const registerTechButton = screen.getByText('Đăng công nghệ');
      const registerDemandButton = screen.getByText('Đăng nhu cầu');
      
      expect(registerTechButton).toHaveClass('inline-flex', 'items-center', 'justify-center', 'rounded-lg', 'px-8', 'py-3', 'text-base', 'font-medium', 'transition-colors', 'focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2', 'bg-blue-600', 'text-white', 'hover:bg-blue-700', 'focus:ring-blue-500');
      expect(registerDemandButton).toHaveClass('inline-flex', 'items-center', 'justify-center', 'rounded-lg', 'px-8', 'py-3', 'text-base', 'font-medium', 'transition-colors', 'focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2', 'border', 'border-blue-600', 'bg-white', 'text-blue-600', 'hover:bg-blue-50', 'focus:ring-blue-500');
    });
  });

  it('renders section header with correct styling', async () => {
    render(<SupplyDemandSection />);
    
    await waitFor(() => {
      const sectionHeader = screen.getByText('Kết nối cung - cầu').closest('div');
      expect(sectionHeader).toHaveClass('text-center', 'mb-16');
    });
  });

  it('renders section title with correct styling', async () => {
    render(<SupplyDemandSection />);
    
    await waitFor(() => {
      const sectionTitle = screen.getByText('Kết nối cung - cầu');
      expect(sectionTitle).toHaveClass('text-3xl', 'md:text-4xl', 'font-bold', 'text-gray-900', 'mb-4');
    });
  });

  it('renders section description with correct styling', async () => {
    render(<SupplyDemandSection />);
    
    await waitFor(() => {
      const sectionDescription = screen.getByText('Khám phá công nghệ mới và nhu cầu thị trường để tạo ra những kết nối có giá trị');
      expect(sectionDescription).toHaveClass('text-lg', 'text-gray-600', 'max-w-3xl', 'mx-auto');
    });
  });

  it('renders supply and demand grid with correct styling', async () => {
    render(<SupplyDemandSection />);
    
    await waitFor(() => {
      const supplyDemandGrid = screen.getByText('Công nghệ mới niêm yết').closest('div')?.parentElement;
      expect(supplyDemandGrid).toHaveClass('grid', 'grid-cols-1', 'lg:grid-cols-2', 'gap-12');
    });
  });

  it('renders CTA section with correct styling', async () => {
    render(<SupplyDemandSection />);
    
    await waitFor(() => {
      const ctaSection = screen.getByText('Bạn có công nghệ hoặc nhu cầu?').closest('div');
      expect(ctaSection).toHaveClass('mt-16', 'text-center');
    });
  });

  it('renders CTA title with correct styling', async () => {
    render(<SupplyDemandSection />);
    
    await waitFor(() => {
      const ctaTitle = screen.getByText('Bạn có công nghệ hoặc nhu cầu?');
      expect(ctaTitle).toHaveClass('text-2xl', 'font-bold', 'text-gray-900', 'mb-4');
    });
  });

  it('renders CTA description with correct styling', async () => {
    render(<SupplyDemandSection />);
    
    await waitFor(() => {
      const ctaDescription = screen.getByText('Tham gia ngay để kết nối với cộng đồng khoa học công nghệ và tìm kiếm cơ hội hợp tác');
      expect(ctaDescription).toHaveClass('text-gray-600', 'mb-6', 'max-w-2xl', 'mx-auto');
    });
  });

  it('renders CTA buttons container with correct styling', async () => {
    render(<SupplyDemandSection />);
    
    await waitFor(() => {
      const ctaButtonsContainer = screen.getByText('Đăng công nghệ').closest('div')?.parentElement;
      expect(ctaButtonsContainer).toHaveClass('flex', 'flex-col', 'sm:flex-row', 'gap-4', 'justify-center');
    });
  });

  it('handles API error gracefully', async () => {
    // Mock API error
    mockApiClient.getTechnologies.mockRejectedValue(new Error('API Error'));
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    render(<SupplyDemandSection />);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching technologies:', expect.any(Error));
    });
    
    consoleSpy.mockRestore();
  });

  it('shows empty state when no technologies found', async () => {
    // Mock empty response
    mockApiClient.getTechnologies.mockResolvedValue({
      success: true,
      data: []
    });
    
    render(<SupplyDemandSection />);
    
    await waitFor(() => {
      expect(screen.getByText('Chưa có công nghệ mới')).toBeInTheDocument();
    });
  });
});
