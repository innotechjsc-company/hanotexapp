import { render, screen } from '@testing-library/react';
import IntroSection from '../IntroSection';

describe('IntroSection', () => {
  it('renders intro section with correct content', () => {
    render(<IntroSection />);
    
    // Check if main elements are rendered
    expect(screen.getByText('Về HANOTEX')).toBeInTheDocument();
    expect(screen.getByText('Nền tảng kết nối toàn diện cho hệ sinh thái khoa học công nghệ Hà Nội')).toBeInTheDocument();
  });

  it('renders all feature cards', () => {
    render(<IntroSection />);
    
    // Check if all feature cards are rendered
    expect(screen.getByText('HANOTEX là gì?')).toBeInTheDocument();
    expect(screen.getByText('Mục tiêu')).toBeInTheDocument();
    expect(screen.getByText('Đối tượng')).toBeInTheDocument();
    expect(screen.getByText('Lợi ích')).toBeInTheDocument();
  });

  it('renders feature descriptions', () => {
    render(<IntroSection />);
    
    // Check if feature descriptions are rendered
    expect(screen.getByText('Sàn giao dịch công nghệ trực tuyến của thành phố Hà Nội, kết nối các bên trong hệ sinh thái khoa học công nghệ.')).toBeInTheDocument();
    expect(screen.getByText('Thúc đẩy chuyển giao công nghệ, thương mại hóa kết quả nghiên cứu và tạo cầu nối giữa cung - cầu công nghệ.')).toBeInTheDocument();
    expect(screen.getByText('Doanh nghiệp, viện nghiên cứu, trường đại học, cá nhân nghiên cứu và các tổ chức khoa học công nghệ.')).toBeInTheDocument();
    expect(screen.getByText('Tăng cường hiệu quả chuyển giao công nghệ, mở rộng thị trường và tạo cơ hội hợp tác đổi mới sáng tạo.')).toBeInTheDocument();
  });

  it('renders CTA section', () => {
    render(<IntroSection />);
    
    // Check if CTA section is rendered
    expect(screen.getByText('Tham gia ngay để kết nối và phát triển')).toBeInTheDocument();
    expect(screen.getByText('Hãy trở thành một phần của hệ sinh thái khoa học công nghệ Hà Nội. Đăng ký tài khoản miễn phí và bắt đầu hành trình đổi mới sáng tạo của bạn.')).toBeInTheDocument();
  });

  it('renders CTA buttons', () => {
    render(<IntroSection />);
    
    // Check if CTA buttons are rendered
    expect(screen.getByText('Đăng ký miễn phí')).toBeInTheDocument();
    expect(screen.getByText('Tìm hiểu thêm')).toBeInTheDocument();
  });

  it('renders with correct styling classes', () => {
    render(<IntroSection />);
    
    const introSection = screen.getByText('Về HANOTEX').closest('section');
    expect(introSection).toHaveClass('py-20', 'bg-white');
  });

  it('renders feature cards with correct styling', () => {
    render(<IntroSection />);
    
    const featureCards = screen.getAllByText(/HANOTEX là gì\?|Mục tiêu|Đối tượng|Lợi ích/);
    
    featureCards.forEach(card => {
      const cardElement = card.closest('div');
      expect(cardElement).toHaveClass('text-center', 'p-6', 'rounded-xl', 'bg-blue-50');
    });
  });

  it('renders CTA section with correct styling', () => {
    render(<IntroSection />);
    
    const ctaSection = screen.getByText('Tham gia ngay để kết nối và phát triển').closest('div');
    expect(ctaSection).toHaveClass('bg-gradient-to-r', 'from-blue-50', 'to-blue-100', 'rounded-2xl', 'p-8');
  });

  it('renders CTA buttons with correct styling', () => {
    render(<IntroSection />);
    
    const registerButton = screen.getByText('Đăng ký miễn phí');
    const learnMoreButton = screen.getByText('Tìm hiểu thêm');
    
    expect(registerButton).toHaveClass('inline-flex', 'items-center', 'justify-center', 'rounded-lg', 'px-8', 'py-3', 'text-base', 'font-medium', 'transition-colors', 'focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2', 'bg-blue-600', 'text-white', 'hover:bg-blue-700', 'focus:ring-blue-500');
    expect(learnMoreButton).toHaveClass('inline-flex', 'items-center', 'justify-center', 'rounded-lg', 'px-8', 'py-3', 'text-base', 'font-medium', 'transition-colors', 'focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2', 'border', 'border-blue-600', 'bg-white', 'text-blue-600', 'hover:bg-blue-50', 'focus:ring-blue-500');
  });

  it('renders feature icons', () => {
    render(<IntroSection />);
    
    // Check if feature icons are rendered (they should be present in the DOM)
    const featureIcons = document.querySelectorAll('.inline-flex.items-center.justify-center.w-16.h-16.rounded-full.bg-blue-600.text-white.mb-4');
    expect(featureIcons).toHaveLength(4);
  });

  it('renders feature titles with correct styling', () => {
    render(<IntroSection />);
    
    const featureTitles = screen.getAllByText(/HANOTEX là gì\?|Mục tiêu|Đối tượng|Lợi ích/);
    
    featureTitles.forEach(title => {
      expect(title).toHaveClass('text-xl', 'font-semibold', 'text-gray-900', 'mb-3');
    });
  });

  it('renders feature descriptions with correct styling', () => {
    render(<IntroSection />);
    
    const featureDescriptions = screen.getAllByText(/Sàn giao dịch công nghệ trực tuyến|Thúc đẩy chuyển giao công nghệ|Doanh nghiệp, viện nghiên cứu|Tăng cường hiệu quả chuyển giao/);
    
    featureDescriptions.forEach(description => {
      expect(description).toHaveClass('text-gray-600', 'leading-relaxed');
    });
  });

  it('renders section header with correct styling', () => {
    render(<IntroSection />);
    
    const sectionHeader = screen.getByText('Về HANOTEX').closest('div');
    expect(sectionHeader).toHaveClass('text-center', 'mb-16');
  });

  it('renders section title with correct styling', () => {
    render(<IntroSection />);
    
    const sectionTitle = screen.getByText('Về HANOTEX');
    expect(sectionTitle).toHaveClass('text-3xl', 'md:text-4xl', 'font-bold', 'text-gray-900', 'mb-4');
  });

  it('renders section description with correct styling', () => {
    render(<IntroSection />);
    
    const sectionDescription = screen.getByText('Nền tảng kết nối toàn diện cho hệ sinh thái khoa học công nghệ Hà Nội');
    expect(sectionDescription).toHaveClass('text-lg', 'text-gray-600', 'max-w-3xl', 'mx-auto');
  });

  it('renders feature grid with correct styling', () => {
    render(<IntroSection />);
    
    const featureGrid = screen.getByText('HANOTEX là gì?').closest('div')?.parentElement;
    expect(featureGrid).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4', 'gap-8');
  });

  it('renders CTA section with correct styling', () => {
    render(<IntroSection />);
    
    const ctaSection = screen.getByText('Tham gia ngay để kết nối và phát triển').closest('div');
    expect(ctaSection).toHaveClass('mt-16', 'text-center');
  });

  it('renders CTA title with correct styling', () => {
    render(<IntroSection />);
    
    const ctaTitle = screen.getByText('Tham gia ngay để kết nối và phát triển');
    expect(ctaTitle).toHaveClass('text-2xl', 'font-bold', 'text-gray-900', 'mb-4');
  });

  it('renders CTA description with correct styling', () => {
    render(<IntroSection />);
    
    const ctaDescription = screen.getByText('Hãy trở thành một phần của hệ sinh thái khoa học công nghệ Hà Nội. Đăng ký tài khoản miễn phí và bắt đầu hành trình đổi mới sáng tạo của bạn.');
    expect(ctaDescription).toHaveClass('text-gray-600', 'mb-6', 'max-w-2xl', 'mx-auto');
  });

  it('renders CTA buttons container with correct styling', () => {
    render(<IntroSection />);
    
    const ctaButtonsContainer = screen.getByText('Đăng ký miễn phí').closest('div')?.parentElement;
    expect(ctaButtonsContainer).toHaveClass('flex', 'flex-col', 'sm:flex-row', 'gap-4', 'justify-center');
  });
});
