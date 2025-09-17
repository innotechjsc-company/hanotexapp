import { render, screen } from '@testing-library/react';
import PartnersSection from '../PartnersSection';

describe('PartnersSection', () => {
  it('renders partners section with correct content', () => {
    render(<PartnersSection />);
    
    // Check if main elements are rendered
    expect(screen.getByText('Đối tác & Quỹ đầu tư')).toBeInTheDocument();
    expect(screen.getByText('Hệ thống đối tác uy tín và các quỹ đầu tư chuyên nghiệp hỗ trợ phát triển hệ sinh thái khoa học công nghệ')).toBeInTheDocument();
  });

  it('renders strategic partners section', () => {
    render(<PartnersSection />);
    
    // Check if strategic partners section is rendered
    expect(screen.getByText('Đối tác chiến lược')).toBeInTheDocument();
    expect(screen.getByText('Các tổ chức, doanh nghiệp và viện nghiên cứu hàng đầu')).toBeInTheDocument();
  });

  it('renders investment funds section', () => {
    render(<PartnersSection />);
    
    // Check if investment funds section is rendered
    expect(screen.getByText('Quỹ đầu tư liên kết')).toBeInTheDocument();
    expect(screen.getByText('Các quỹ đầu tư chuyên nghiệp hỗ trợ phát triển dự án công nghệ')).toBeInTheDocument();
  });

  it('renders strategic partners', () => {
    render(<PartnersSection />);
    
    // Check if strategic partners are rendered
    expect(screen.getByText('Sở KH&CN Hà Nội')).toBeInTheDocument();
    expect(screen.getByText('Trường Đại học Bách Khoa Hà Nội')).toBeInTheDocument();
    expect(screen.getByText('Viện Hàn lâm Khoa học Việt Nam')).toBeInTheDocument();
    expect(screen.getByText('FPT Corporation')).toBeInTheDocument();
    expect(screen.getByText('Viettel Group')).toBeInTheDocument();
    expect(screen.getByText('VinGroup')).toBeInTheDocument();
  });

  it('renders investment funds', () => {
    render(<PartnersSection />);
    
    // Check if investment funds are rendered
    expect(screen.getByText('Quỹ Đầu tư Khởi nghiệp Sáng tạo Hà Nội')).toBeInTheDocument();
    expect(screen.getByText('Vietnam Silicon Valley')).toBeInTheDocument();
    expect(screen.getByText('IDG Ventures Vietnam')).toBeInTheDocument();
    expect(screen.getByText('CyberAgent Capital')).toBeInTheDocument();
  });

  it('displays partner types', () => {
    render(<PartnersSection />);
    
    // Check if partner types are displayed
    expect(screen.getByText('Cơ quan nhà nước')).toBeInTheDocument();
    expect(screen.getByText('Trường đại học')).toBeInTheDocument();
    expect(screen.getByText('Viện nghiên cứu')).toBeInTheDocument();
    expect(screen.getByText('Doanh nghiệp')).toBeInTheDocument();
    expect(screen.getByText('Tập đoàn')).toBeInTheDocument();
  });

  it('displays fund types', () => {
    render(<PartnersSection />);
    
    // Check if fund types are displayed
    expect(screen.getByText('Quỹ đầu tư')).toBeInTheDocument();
  });

  it('displays fund focus areas', () => {
    render(<PartnersSection />);
    
    // Check if fund focus areas are displayed
    expect(screen.getByText('Khởi nghiệp công nghệ')).toBeInTheDocument();
    expect(screen.getByText('Công nghệ cao')).toBeInTheDocument();
    expect(screen.getByText('Công nghệ thông tin')).toBeInTheDocument();
    expect(screen.getByText('Internet & Mobile')).toBeInTheDocument();
  });

  it('displays fund sizes', () => {
    render(<PartnersSection />);
    
    // Check if fund sizes are displayed
    expect(screen.getByText('500 tỷ VNĐ')).toBeInTheDocument();
    expect(screen.getByText('200 triệu USD')).toBeInTheDocument();
    expect(screen.getByText('100 triệu USD')).toBeInTheDocument();
    expect(screen.getByText('50 triệu USD')).toBeInTheDocument();
  });

  it('displays partner descriptions', () => {
    render(<PartnersSection />);
    
    // Check if partner descriptions are displayed
    expect(screen.getByText('Cơ quan chủ quản của sàn giao dịch HANOTEX')).toBeInTheDocument();
    expect(screen.getByText('Đối tác nghiên cứu và phát triển công nghệ')).toBeInTheDocument();
    expect(screen.getByText('Đối tác nghiên cứu khoa học cơ bản')).toBeInTheDocument();
    expect(screen.getByText('Đối tác công nghệ thông tin')).toBeInTheDocument();
    expect(screen.getByText('Đối tác viễn thông và công nghệ')).toBeInTheDocument();
    expect(screen.getByText('Đối tác đa ngành')).toBeInTheDocument();
  });

  it('displays fund descriptions', () => {
    render(<PartnersSection />);
    
    // Check if fund descriptions are displayed
    expect(screen.getByText('Hỗ trợ các dự án khởi nghiệp trong lĩnh vực khoa học công nghệ')).toBeInTheDocument();
    expect(screen.getByText('Đầu tư vào các công ty công nghệ có tiềm năng phát triển')).toBeInTheDocument();
    expect(screen.getByText('Chuyên đầu tư vào các startup công nghệ thông tin')).toBeInTheDocument();
    expect(screen.getByText('Đầu tư vào các công ty internet và mobile')).toBeInTheDocument();
  });

  it('renders CTA section', () => {
    render(<PartnersSection />);
    
    // Check if CTA section is rendered
    expect(screen.getByText('Trở thành đối tác của HANOTEX')).toBeInTheDocument();
    expect(screen.getByText('Tham gia mạng lưới đối tác để cùng phát triển hệ sinh thái khoa học công nghệ Hà Nội')).toBeInTheDocument();
  });

  it('renders CTA buttons', () => {
    render(<PartnersSection />);
    
    // Check if CTA buttons are rendered
    expect(screen.getByText('Trở thành đối tác')).toBeInTheDocument();
    expect(screen.getByText('Tìm hiểu thêm')).toBeInTheDocument();
  });

  it('renders with correct styling classes', () => {
    render(<PartnersSection />);
    
    const partnersSection = screen.getByText('Đối tác & Quỹ đầu tư').closest('section');
    expect(partnersSection).toHaveClass('py-20', 'bg-gray-50');
  });

  it('renders partner cards with correct styling', () => {
    render(<PartnersSection />);
    
    const partnerCards = screen.getAllByText(/Sở KH&CN Hà Nội|Trường Đại học Bách Khoa Hà Nội|Viện Hàn lâm Khoa học Việt Nam|FPT Corporation|Viettel Group|VinGroup/);
    
    partnerCards.forEach(card => {
      const cardElement = card.closest('div');
      expect(cardElement).toHaveClass('bg-white', 'rounded-xl', 'shadow-lg', 'border', 'border-gray-200', 'hover:shadow-xl', 'transition-all', 'duration-300', 'p-6', 'text-center');
    });
  });

  it('renders fund cards with correct styling', () => {
    render(<PartnersSection />);
    
    const fundCards = screen.getAllByText(/Quỹ Đầu tư Khởi nghiệp Sáng tạo Hà Nội|Vietnam Silicon Valley|IDG Ventures Vietnam|CyberAgent Capital/);
    
    fundCards.forEach(card => {
      const cardElement = card.closest('div');
      expect(cardElement).toHaveClass('bg-white', 'rounded-xl', 'shadow-lg', 'border', 'border-gray-200', 'hover:shadow-xl', 'transition-all', 'duration-300', 'p-6');
    });
  });

  it('renders CTA section with correct styling', () => {
    render(<PartnersSection />);
    
    const ctaSection = screen.getByText('Trở thành đối tác của HANOTEX').closest('div');
    expect(ctaSection).toHaveClass('bg-gradient-to-r', 'from-blue-50', 'to-blue-100', 'rounded-2xl', 'p-8');
  });

  it('renders CTA buttons with correct styling', () => {
    render(<PartnersSection />);
    
    const becomePartnerButton = screen.getByText('Trở thành đối tác');
    const learnMoreButton = screen.getByText('Tìm hiểu thêm');
    
    expect(becomePartnerButton).toHaveClass('inline-flex', 'items-center', 'justify-center', 'rounded-lg', 'px-8', 'py-3', 'text-base', 'font-medium', 'transition-colors', 'focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2', 'bg-blue-600', 'text-white', 'hover:bg-blue-700', 'focus:ring-blue-500');
    expect(learnMoreButton).toHaveClass('inline-flex', 'items-center', 'justify-center', 'rounded-lg', 'px-8', 'py-3', 'text-base', 'font-medium', 'transition-colors', 'focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2', 'border', 'border-blue-600', 'bg-white', 'text-blue-600', 'hover:bg-blue-50', 'focus:ring-blue-500');
  });

  it('renders section header with correct styling', () => {
    render(<PartnersSection />);
    
    const sectionHeader = screen.getByText('Đối tác & Quỹ đầu tư').closest('div');
    expect(sectionHeader).toHaveClass('text-center', 'mb-16');
  });

  it('renders section title with correct styling', () => {
    render(<PartnersSection />);
    
    const sectionTitle = screen.getByText('Đối tác & Quỹ đầu tư');
    expect(sectionTitle).toHaveClass('text-3xl', 'md:text-4xl', 'font-bold', 'text-gray-900', 'mb-4');
  });

  it('renders section description with correct styling', () => {
    render(<PartnersSection />);
    
    const sectionDescription = screen.getByText('Hệ thống đối tác uy tín và các quỹ đầu tư chuyên nghiệp hỗ trợ phát triển hệ sinh thái khoa học công nghệ');
    expect(sectionDescription).toHaveClass('text-lg', 'text-gray-600', 'max-w-3xl', 'mx-auto');
  });

  it('renders strategic partners grid with correct styling', () => {
    render(<PartnersSection />);
    
    const strategicPartnersGrid = screen.getByText('Sở KH&CN Hà Nội').closest('div')?.parentElement;
    expect(strategicPartnersGrid).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-8');
  });

  it('renders investment funds grid with correct styling', () => {
    render(<PartnersSection />);
    
    const investmentFundsGrid = screen.getByText('Quỹ Đầu tư Khởi nghiệp Sáng tạo Hà Nội').closest('div')?.parentElement;
    expect(investmentFundsGrid).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-8');
  });

  it('renders CTA section with correct styling', () => {
    render(<PartnersSection />);
    
    const ctaSection = screen.getByText('Trở thành đối tác của HANOTEX').closest('div');
    expect(ctaSection).toHaveClass('mt-16', 'text-center');
  });

  it('renders CTA title with correct styling', () => {
    render(<PartnersSection />);
    
    const ctaTitle = screen.getByText('Trở thành đối tác của HANOTEX');
    expect(ctaTitle).toHaveClass('text-2xl', 'font-bold', 'text-gray-900', 'mb-4');
  });

  it('renders CTA description with correct styling', () => {
    render(<PartnersSection />);
    
    const ctaDescription = screen.getByText('Tham gia mạng lưới đối tác để cùng phát triển hệ sinh thái khoa học công nghệ Hà Nội');
    expect(ctaDescription).toHaveClass('text-gray-600', 'mb-6', 'max-w-2xl', 'mx-auto');
  });

  it('renders CTA buttons container with correct styling', () => {
    render(<PartnersSection />);
    
    const ctaButtonsContainer = screen.getByText('Trở thành đối tác').closest('div')?.parentElement;
    expect(ctaButtonsContainer).toHaveClass('flex', 'flex-col', 'sm:flex-row', 'gap-4', 'justify-center');
  });

  it('renders partner icons', () => {
    render(<PartnersSection />);
    
    // Check if partner icons are rendered (they should be present in the DOM)
    const partnerIcons = document.querySelectorAll('.w-20.h-20.bg-blue-100.rounded-full.mx-auto.mb-4.flex.items-center.justify-center');
    expect(partnerIcons).toHaveLength(6);
  });

  it('renders fund icons', () => {
    render(<PartnersSection />);
    
    // Check if fund icons are rendered (they should be present in the DOM)
    const fundIcons = document.querySelectorAll('.w-12.h-12.bg-green-100.rounded-lg.flex.items-center.justify-center.mr-4.flex-shrink-0');
    expect(fundIcons).toHaveLength(4);
  });

  it('renders partner type badges with correct styling', () => {
    render(<PartnersSection />);
    
    const partnerTypeBadges = screen.getAllByText(/Cơ quan nhà nước|Trường đại học|Viện nghiên cứu|Doanh nghiệp|Tập đoàn/);
    
    partnerTypeBadges.forEach(badge => {
      expect(badge).toHaveClass('inline-flex', 'items-center', 'px-2.5', 'py-0.5', 'rounded-full', 'text-xs', 'font-medium', 'bg-blue-100', 'text-blue-800');
    });
  });

  it('renders fund type badges with correct styling', () => {
    render(<PartnersSection />);
    
    const fundTypeBadges = screen.getAllByText('Quỹ đầu tư');
    
    fundTypeBadges.forEach(badge => {
      expect(badge).toHaveClass('inline-flex', 'items-center', 'px-2.5', 'py-0.5', 'rounded-full', 'text-xs', 'font-medium', 'bg-green-100', 'text-green-800');
    });
  });

  it('renders all strategic partners with correct information', () => {
    render(<PartnersSection />);
    
    // Check first partner
    expect(screen.getByText('Sở KH&CN Hà Nội')).toBeInTheDocument();
    expect(screen.getByText('Cơ quan chủ quản của sàn giao dịch HANOTEX')).toBeInTheDocument();
    
    // Check second partner
    expect(screen.getByText('Trường Đại học Bách Khoa Hà Nội')).toBeInTheDocument();
    expect(screen.getByText('Đối tác nghiên cứu và phát triển công nghệ')).toBeInTheDocument();
    
    // Check third partner
    expect(screen.getByText('Viện Hàn lâm Khoa học Việt Nam')).toBeInTheDocument();
    expect(screen.getByText('Đối tác nghiên cứu khoa học cơ bản')).toBeInTheDocument();
  });

  it('renders all investment funds with correct information', () => {
    render(<PartnersSection />);
    
    // Check first fund
    expect(screen.getByText('Quỹ Đầu tư Khởi nghiệp Sáng tạo Hà Nội')).toBeInTheDocument();
    expect(screen.getByText('Hỗ trợ các dự án khởi nghiệp trong lĩnh vực khoa học công nghệ')).toBeInTheDocument();
    expect(screen.getByText('Khởi nghiệp công nghệ')).toBeInTheDocument();
    expect(screen.getByText('500 tỷ VNĐ')).toBeInTheDocument();
    
    // Check second fund
    expect(screen.getByText('Vietnam Silicon Valley')).toBeInTheDocument();
    expect(screen.getByText('Đầu tư vào các công ty công nghệ có tiềm năng phát triển')).toBeInTheDocument();
    expect(screen.getByText('Công nghệ cao')).toBeInTheDocument();
    expect(screen.getByText('200 triệu USD')).toBeInTheDocument();
  });
});
