import { render, screen } from '@testing-library/react';
import NewsEventsSection from '../NewsEventsSection';

describe('NewsEventsSection', () => {
  it('renders news events section with correct content', () => {
    render(<NewsEventsSection />);
    
    // Check if main elements are rendered
    expect(screen.getByText('Tin tức & Sự kiện')).toBeInTheDocument();
    expect(screen.getByText('Cập nhật những thông tin mới nhất về khoa học công nghệ và các sự kiện quan trọng')).toBeInTheDocument();
  });

  it('renders news section', () => {
    render(<NewsEventsSection />);
    
    // Check if news section is rendered
    expect(screen.getByText('Tin tức mới nhất')).toBeInTheDocument();
    expect(screen.getByText('Xem tất cả')).toBeInTheDocument();
  });

  it('renders events section', () => {
    render(<NewsEventsSection />);
    
    // Check if events section is rendered
    expect(screen.getByText('Sự kiện sắp diễn ra')).toBeInTheDocument();
    expect(screen.getByText('Xem tất cả')).toBeInTheDocument();
  });

  it('renders news articles', () => {
    render(<NewsEventsSection />);
    
    // Check if news articles are rendered
    expect(screen.getByText('HANOTEX chính thức ra mắt sàn giao dịch công nghệ')).toBeInTheDocument();
    expect(screen.getByText('Hội thảo "Xu hướng công nghệ 2025" tại Hà Nội')).toBeInTheDocument();
    expect(screen.getByText('Chính sách hỗ trợ doanh nghiệp khởi nghiệp công nghệ')).toBeInTheDocument();
  });

  it('renders events', () => {
    render(<NewsEventsSection />);
    
    // Check if events are rendered
    expect(screen.getByText('Techmart Hà Nội 2025')).toBeInTheDocument();
    expect(screen.getByText('Đấu giá công nghệ AI & Machine Learning')).toBeInTheDocument();
    expect(screen.getByText('Hội thảo chuyển giao công nghệ')).toBeInTheDocument();
  });

  it('displays news categories', () => {
    render(<NewsEventsSection />);
    
    // Check if news categories are displayed
    expect(screen.getByText('Tin tức')).toBeInTheDocument();
    expect(screen.getByText('Sự kiện')).toBeInTheDocument();
    expect(screen.getByText('Chính sách')).toBeInTheDocument();
  });

  it('displays event types', () => {
    render(<NewsEventsSection />);
    
    // Check if event types are displayed
    expect(screen.getByText('Triển lãm')).toBeInTheDocument();
    expect(screen.getByText('Đấu giá')).toBeInTheDocument();
    expect(screen.getByText('Hội thảo')).toBeInTheDocument();
  });

  it('displays event statuses', () => {
    render(<NewsEventsSection />);
    
    // Check if event statuses are displayed
    expect(screen.getByText('Sắp diễn ra')).toBeInTheDocument();
  });

  it('displays news dates', () => {
    render(<NewsEventsSection />);
    
    // Check if news dates are displayed
    expect(screen.getByText('15/01/2025')).toBeInTheDocument();
    expect(screen.getByText('12/01/2025')).toBeInTheDocument();
    expect(screen.getByText('10/01/2025')).toBeInTheDocument();
  });

  it('displays event dates', () => {
    render(<NewsEventsSection />);
    
    // Check if event dates are displayed
    expect(screen.getByText('25/02/2025')).toBeInTheDocument();
    expect(screen.getByText('15/03/2025')).toBeInTheDocument();
    expect(screen.getByText('20/03/2025')).toBeInTheDocument();
  });

  it('displays event times', () => {
    render(<NewsEventsSection />);
    
    // Check if event times are displayed
    expect(screen.getByText('08:00 - 17:00')).toBeInTheDocument();
    expect(screen.getByText('14:00 - 16:00')).toBeInTheDocument();
    expect(screen.getByText('09:00 - 12:00')).toBeInTheDocument();
  });

  it('displays event locations', () => {
    render(<NewsEventsSection />);
    
    // Check if event locations are displayed
    expect(screen.getByText('Trung tâm Hội nghị Quốc gia')).toBeInTheDocument();
    expect(screen.getByText('Sở KH&CN Hà Nội')).toBeInTheDocument();
    expect(screen.getByText('Trường Đại học Bách Khoa Hà Nội')).toBeInTheDocument();
  });

  it('displays attendee counts', () => {
    render(<NewsEventsSection />);
    
    // Check if attendee counts are displayed
    expect(screen.getByText('500+ người tham gia')).toBeInTheDocument();
    expect(screen.getByText('200+ người tham gia')).toBeInTheDocument();
    expect(screen.getByText('150+ người tham gia')).toBeInTheDocument();
  });

  it('displays read times', () => {
    render(<NewsEventsSection />);
    
    // Check if read times are displayed
    expect(screen.getByText('3 phút')).toBeInTheDocument();
    expect(screen.getByText('5 phút')).toBeInTheDocument();
    expect(screen.getByText('4 phút')).toBeInTheDocument();
  });

  it('displays view counts', () => {
    render(<NewsEventsSection />);
    
    // Check if view counts are displayed
    expect(screen.getByText('123 lượt xem')).toBeInTheDocument();
    expect(screen.getByText('156 lượt xem')).toBeInTheDocument();
    expect(screen.getByText('89 lượt xem')).toBeInTheDocument();
  });

  it('renders CTA section', () => {
    render(<NewsEventsSection />);
    
    // Check if CTA section is rendered
    expect(screen.getByText('Đăng ký nhận thông báo')).toBeInTheDocument();
    expect(screen.getByText('Nhận thông báo về tin tức mới nhất và sự kiện sắp diễn ra trong lĩnh vực khoa học công nghệ')).toBeInTheDocument();
  });

  it('renders newsletter subscription form', () => {
    render(<NewsEventsSection />);
    
    // Check if newsletter subscription form is rendered
    const emailInput = screen.getByPlaceholderText('Nhập email của bạn');
    const subscribeButton = screen.getByText('Đăng ký');
    
    expect(emailInput).toBeInTheDocument();
    expect(subscribeButton).toBeInTheDocument();
  });

  it('renders with correct styling classes', () => {
    render(<NewsEventsSection />);
    
    const newsEventsSection = screen.getByText('Tin tức & Sự kiện').closest('section');
    expect(newsEventsSection).toHaveClass('py-20', 'bg-white');
  });

  it('renders news cards with correct styling', () => {
    render(<NewsEventsSection />);
    
    const newsCards = screen.getAllByText(/HANOTEX chính thức ra mắt|Hội thảo "Xu hướng công nghệ 2025"|Chính sách hỗ trợ doanh nghiệp/);
    
    newsCards.forEach(card => {
      const cardElement = card.closest('article');
      expect(cardElement).toHaveClass('bg-white', 'rounded-xl', 'shadow-lg', 'border', 'border-gray-200', 'hover:shadow-xl', 'transition-all', 'duration-300', 'overflow-hidden');
    });
  });

  it('renders event cards with correct styling', () => {
    render(<NewsEventsSection />);
    
    const eventCards = screen.getAllByText(/Techmart Hà Nội 2025|Đấu giá công nghệ AI|Hội thảo chuyển giao công nghệ/);
    
    eventCards.forEach(card => {
      const cardElement = card.closest('div');
      expect(cardElement).toHaveClass('bg-white', 'rounded-xl', 'shadow-lg', 'border', 'border-gray-200', 'hover:shadow-xl', 'transition-all', 'duration-300', 'p-6');
    });
  });

  it('renders CTA section with correct styling', () => {
    render(<NewsEventsSection />);
    
    const ctaSection = screen.getByText('Đăng ký nhận thông báo').closest('div');
    expect(ctaSection).toHaveClass('bg-gradient-to-r', 'from-blue-50', 'to-blue-100', 'rounded-2xl', 'p-8');
  });

  it('renders newsletter form with correct styling', () => {
    render(<NewsEventsSection />);
    
    const emailInput = screen.getByPlaceholderText('Nhập email của bạn');
    const subscribeButton = screen.getByText('Đăng ký');
    
    expect(emailInput).toHaveClass('flex-1', 'px-4', 'py-3', 'border', 'border-gray-300', 'rounded-lg', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent');
    expect(subscribeButton).toHaveClass('inline-flex', 'items-center', 'justify-center', 'rounded-lg', 'px-6', 'py-3', 'text-base', 'font-medium', 'transition-colors', 'focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2', 'bg-blue-600', 'text-white', 'hover:bg-blue-700', 'focus:ring-blue-500');
  });

  it('renders section header with correct styling', () => {
    render(<NewsEventsSection />);
    
    const sectionHeader = screen.getByText('Tin tức & Sự kiện').closest('div');
    expect(sectionHeader).toHaveClass('text-center', 'mb-16');
  });

  it('renders section title with correct styling', () => {
    render(<NewsEventsSection />);
    
    const sectionTitle = screen.getByText('Tin tức & Sự kiện');
    expect(sectionTitle).toHaveClass('text-3xl', 'md:text-4xl', 'font-bold', 'text-gray-900', 'mb-4');
  });

  it('renders section description with correct styling', () => {
    render(<NewsEventsSection />);
    
    const sectionDescription = screen.getByText('Cập nhật những thông tin mới nhất về khoa học công nghệ và các sự kiện quan trọng');
    expect(sectionDescription).toHaveClass('text-lg', 'text-gray-600', 'max-w-3xl', 'mx-auto');
  });

  it('renders news and events grid with correct styling', () => {
    render(<NewsEventsSection />);
    
    const newsEventsGrid = screen.getByText('Tin tức mới nhất').closest('div')?.parentElement;
    expect(newsEventsGrid).toHaveClass('grid', 'grid-cols-1', 'lg:grid-cols-2', 'gap-12');
  });

  it('renders CTA section with correct styling', () => {
    render(<NewsEventsSection />);
    
    const ctaSection = screen.getByText('Đăng ký nhận thông báo').closest('div');
    expect(ctaSection).toHaveClass('mt-16', 'text-center');
  });

  it('renders CTA title with correct styling', () => {
    render(<NewsEventsSection />);
    
    const ctaTitle = screen.getByText('Đăng ký nhận thông báo');
    expect(ctaTitle).toHaveClass('text-2xl', 'font-bold', 'text-gray-900', 'mb-4');
  });

  it('renders CTA description with correct styling', () => {
    render(<NewsEventsSection />);
    
    const ctaDescription = screen.getByText('Nhận thông báo về tin tức mới nhất và sự kiện sắp diễn ra trong lĩnh vực khoa học công nghệ');
    expect(ctaDescription).toHaveClass('text-gray-600', 'mb-6', 'max-w-2xl', 'mx-auto');
  });

  it('renders newsletter form container with correct styling', () => {
    render(<NewsEventsSection />);
    
    const newsletterFormContainer = screen.getByPlaceholderText('Nhập email của bạn').closest('div')?.parentElement;
    expect(newsletterFormContainer).toHaveClass('flex', 'flex-col', 'sm:flex-row', 'gap-4', 'justify-center', 'max-w-md', 'mx-auto');
  });

  it('renders all news articles with correct information', () => {
    render(<NewsEventsSection />);
    
    // Check first article
    expect(screen.getByText('HANOTEX chính thức ra mắt sàn giao dịch công nghệ')).toBeInTheDocument();
    expect(screen.getByText('Sàn giao dịch công nghệ HANOTEX đã chính thức đi vào hoạt động, kết nối các bên trong hệ sinh thái khoa học công nghệ Hà Nội với mục tiêu thúc đẩy chuyển giao và thương mại hóa công nghệ.')).toBeInTheDocument();
    expect(screen.getByText('Ban biên tập HANOTEX')).toBeInTheDocument();
    expect(screen.getByText('15/01/2025')).toBeInTheDocument();
    expect(screen.getByText('3 phút')).toBeInTheDocument();
    expect(screen.getByText('123 lượt xem')).toBeInTheDocument();
    
    // Check second article
    expect(screen.getByText('Hội thảo "Xu hướng công nghệ 2025" tại Hà Nội')).toBeInTheDocument();
    expect(screen.getByText('Hội thảo quy tụ các chuyên gia hàng đầu trong lĩnh vực AI, IoT và công nghệ sinh học để thảo luận về xu hướng phát triển và cơ hội hợp tác trong năm 2025.')).toBeInTheDocument();
    expect(screen.getByText('Phòng tổ chức sự kiện')).toBeInTheDocument();
    expect(screen.getByText('12/01/2025')).toBeInTheDocument();
    expect(screen.getByText('5 phút')).toBeInTheDocument();
    expect(screen.getByText('156 lượt xem')).toBeInTheDocument();
  });

  it('renders all events with correct information', () => {
    render(<NewsEventsSection />);
    
    // Check first event
    expect(screen.getByText('Techmart Hà Nội 2025')).toBeInTheDocument();
    expect(screen.getByText('Triển lãm công nghệ và sản phẩm khoa học công nghệ lớn nhất Hà Nội với sự tham gia của hơn 200 doanh nghiệp và viện nghiên cứu.')).toBeInTheDocument();
    expect(screen.getByText('Sở KH&CN Hà Nội')).toBeInTheDocument();
    expect(screen.getByText('25/02/2025')).toBeInTheDocument();
    expect(screen.getByText('08:00 - 17:00')).toBeInTheDocument();
    expect(screen.getByText('Trung tâm Hội nghị Quốc gia')).toBeInTheDocument();
    expect(screen.getByText('500+ người tham gia')).toBeInTheDocument();
    
    // Check second event
    expect(screen.getByText('Đấu giá công nghệ AI & Machine Learning')).toBeInTheDocument();
    expect(screen.getByText('Sự kiện đấu giá các công nghệ AI và Machine Learning từ các viện nghiên cứu và doanh nghiệp công nghệ hàng đầu.')).toBeInTheDocument();
    expect(screen.getByText('HANOTEX')).toBeInTheDocument();
    expect(screen.getByText('15/03/2025')).toBeInTheDocument();
    expect(screen.getByText('14:00 - 16:00')).toBeInTheDocument();
    expect(screen.getByText('Sở KH&CN Hà Nội')).toBeInTheDocument();
    expect(screen.getByText('200+ người tham gia')).toBeInTheDocument();
  });
});
