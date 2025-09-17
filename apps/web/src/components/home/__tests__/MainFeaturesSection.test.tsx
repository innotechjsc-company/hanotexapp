import { render, screen } from '@testing-library/react';
import MainFeaturesSection from '../MainFeaturesSection';

describe('MainFeaturesSection', () => {
  it('renders main features section with correct content', () => {
    render(<MainFeaturesSection />);
    
    // Check if main elements are rendered
    expect(screen.getByText('Tính năng chính')).toBeInTheDocument();
    expect(screen.getByText('Hệ thống toàn diện hỗ trợ toàn bộ quy trình chuyển giao và thương mại hóa công nghệ')).toBeInTheDocument();
  });

  it('renders all feature cards', () => {
    render(<MainFeaturesSection />);
    
    // Check if all feature cards are rendered
    expect(screen.getByText('Niêm yết công nghệ')).toBeInTheDocument();
    expect(screen.getByText('Định giá & thẩm định')).toBeInTheDocument();
    expect(screen.getByText('Tư vấn & môi giới')).toBeInTheDocument();
    expect(screen.getByText('NDA & pháp lý')).toBeInTheDocument();
    expect(screen.getByText('Đầu tư & quỹ')).toBeInTheDocument();
  });

  it('renders feature descriptions', () => {
    render(<MainFeaturesSection />);
    
    // Check if feature descriptions are rendered
    expect(screen.getByText('Đăng tải và quản lý thông tin công nghệ một cách chuyên nghiệp với hệ thống phân loại TRL và đánh giá chất lượng.')).toBeInTheDocument();
    expect(screen.getByText('Hệ thống định giá công nghệ dựa trên TRL, tiềm năng thương mại và thẩm định độc lập từ chuyên gia.')).toBeInTheDocument();
    expect(screen.getByText('Kết nối với đội ngũ chuyên gia tư vấn và môi giới công nghệ có kinh nghiệm trong lĩnh vực chuyên môn.')).toBeInTheDocument();
    expect(screen.getByText('Hỗ trợ thỏa thuận bảo mật (NDA) và các vấn đề pháp lý liên quan đến chuyển giao công nghệ.')).toBeInTheDocument();
    expect(screen.getByText('Kết nối với các quỹ đầu tư, nhà đầu tư thiên thần và các nguồn vốn hỗ trợ phát triển công nghệ.')).toBeInTheDocument();
  });

  it('renders CTA section', () => {
    render(<MainFeaturesSection />);
    
    // Check if CTA section is rendered
    expect(screen.getByText('Bắt đầu hành trình đổi mới sáng tạo')).toBeInTheDocument();
    expect(screen.getByText('Tham gia ngay để trải nghiệm đầy đủ các tính năng và dịch vụ của HANOTEX')).toBeInTheDocument();
  });

  it('renders CTA buttons', () => {
    render(<MainFeaturesSection />);
    
    // Check if CTA buttons are rendered
    expect(screen.getByText('Đăng ký tài khoản')).toBeInTheDocument();
    expect(screen.getByText('Xem demo')).toBeInTheDocument();
  });

  it('renders with correct styling classes', () => {
    render(<MainFeaturesSection />);
    
    const mainFeaturesSection = screen.getByText('Tính năng chính').closest('section');
    expect(mainFeaturesSection).toHaveClass('py-20', 'bg-white');
  });

  it('renders feature cards with correct styling', () => {
    render(<MainFeaturesSection />);
    
    const featureCards = screen.getAllByText(/Niêm yết công nghệ|Định giá & thẩm định|Tư vấn & môi giới|NDA & pháp lý|Đầu tư & quỹ/);
    
    featureCards.forEach(card => {
      const cardElement = card.closest('div');
      expect(cardElement).toHaveClass('group', 'bg-white', 'rounded-2xl', 'shadow-lg', 'border', 'border-gray-200', 'hover:shadow-2xl', 'transition-all', 'duration-300', 'overflow-hidden');
    });
  });

  it('renders CTA section with correct styling', () => {
    render(<MainFeaturesSection />);
    
    const ctaSection = screen.getByText('Bắt đầu hành trình đổi mới sáng tạo').closest('div');
    expect(ctaSection).toHaveClass('bg-gradient-to-r', 'from-blue-50', 'to-blue-100', 'rounded-2xl', 'p-8');
  });

  it('renders CTA buttons with correct styling', () => {
    render(<MainFeaturesSection />);
    
    const registerButton = screen.getByText('Đăng ký tài khoản');
    const demoButton = screen.getByText('Xem demo');
    
    expect(registerButton).toHaveClass('inline-flex', 'items-center', 'justify-center', 'rounded-lg', 'px-8', 'py-3', 'text-base', 'font-medium', 'transition-colors', 'focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2', 'bg-blue-600', 'text-white', 'hover:bg-blue-700', 'focus:ring-blue-500');
    expect(demoButton).toHaveClass('inline-flex', 'items-center', 'justify-center', 'rounded-lg', 'px-8', 'py-3', 'text-base', 'font-medium', 'transition-colors', 'focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2', 'border', 'border-blue-600', 'bg-white', 'text-blue-600', 'hover:bg-blue-50', 'focus:ring-blue-500');
  });

  it('renders feature icons', () => {
    render(<MainFeaturesSection />);
    
    // Check if feature icons are rendered (they should be present in the DOM)
    const featureIcons = document.querySelectorAll('.inline-flex.items-center.justify-center.w-16.h-16.rounded-2xl.mb-6');
    expect(featureIcons).toHaveLength(5);
  });

  it('renders feature titles with correct styling', () => {
    render(<MainFeaturesSection />);
    
    const featureTitles = screen.getAllByText(/Niêm yết công nghệ|Định giá & thẩm định|Tư vấn & môi giới|NDA & pháp lý|Đầu tư & quỹ/);
    
    featureTitles.forEach(title => {
      expect(title).toHaveClass('text-xl', 'font-bold', 'text-gray-900', 'mb-4', 'group-hover:text-blue-600', 'transition-colors');
    });
  });

  it('renders feature descriptions with correct styling', () => {
    render(<MainFeaturesSection />);
    
    const featureDescriptions = screen.getAllByText(/Đăng tải và quản lý thông tin công nghệ|Hệ thống định giá công nghệ dựa trên TRL|Kết nối với đội ngũ chuyên gia tư vấn|Hỗ trợ thỏa thuận bảo mật|Kết nối với các quỹ đầu tư/);
    
    featureDescriptions.forEach(description => {
      expect(description).toHaveClass('text-gray-600', 'leading-relaxed', 'mb-6');
    });
  });

  it('renders section header with correct styling', () => {
    render(<MainFeaturesSection />);
    
    const sectionHeader = screen.getByText('Tính năng chính').closest('div');
    expect(sectionHeader).toHaveClass('text-center', 'mb-16');
  });

  it('renders section title with correct styling', () => {
    render(<MainFeaturesSection />);
    
    const sectionTitle = screen.getByText('Tính năng chính');
    expect(sectionTitle).toHaveClass('text-3xl', 'md:text-4xl', 'font-bold', 'text-gray-900', 'mb-4');
  });

  it('renders section description with correct styling', () => {
    render(<MainFeaturesSection />);
    
    const sectionDescription = screen.getByText('Hệ thống toàn diện hỗ trợ toàn bộ quy trình chuyển giao và thương mại hóa công nghệ');
    expect(sectionDescription).toHaveClass('text-lg', 'text-gray-600', 'max-w-3xl', 'mx-auto');
  });

  it('renders feature grid with correct styling', () => {
    render(<MainFeaturesSection />);
    
    const featureGrid = screen.getByText('Niêm yết công nghệ').closest('div')?.parentElement;
    expect(featureGrid).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-8');
  });

  it('renders CTA section with correct styling', () => {
    render(<MainFeaturesSection />);
    
    const ctaSection = screen.getByText('Bắt đầu hành trình đổi mới sáng tạo').closest('div');
    expect(ctaSection).toHaveClass('mt-16', 'text-center');
  });

  it('renders CTA title with correct styling', () => {
    render(<MainFeaturesSection />);
    
    const ctaTitle = screen.getByText('Bắt đầu hành trình đổi mới sáng tạo');
    expect(ctaTitle).toHaveClass('text-2xl', 'font-bold', 'text-gray-900', 'mb-4');
  });

  it('renders CTA description with correct styling', () => {
    render(<MainFeaturesSection />);
    
    const ctaDescription = screen.getByText('Tham gia ngay để trải nghiệm đầy đủ các tính năng và dịch vụ của HANOTEX');
    expect(ctaDescription).toHaveClass('text-gray-600', 'mb-6', 'max-w-2xl', 'mx-auto');
  });

  it('renders CTA buttons container with correct styling', () => {
    render(<MainFeaturesSection />);
    
    const ctaButtonsContainer = screen.getByText('Đăng ký tài khoản').closest('div')?.parentElement;
    expect(ctaButtonsContainer).toHaveClass('flex', 'flex-col', 'sm:flex-row', 'gap-4', 'justify-center');
  });

  it('renders learn more links', () => {
    render(<MainFeaturesSection />);
    
    // Check if learn more links are rendered
    const learnMoreLinks = screen.getAllByText('Tìm hiểu thêm');
    expect(learnMoreLinks).toHaveLength(5);
  });

  it('renders learn more links with correct styling', () => {
    render(<MainFeaturesSection />);
    
    const learnMoreLinks = screen.getAllByText('Tìm hiểu thêm');
    
    learnMoreLinks.forEach(link => {
      expect(link).toHaveClass('flex', 'items-center', 'text-blue-600', 'group-hover:translate-x-1', 'transition-transform');
    });
  });

  it('renders hover effect borders', () => {
    render(<MainFeaturesSection />);
    
    // Check if hover effect borders are rendered
    const hoverBorders = document.querySelectorAll('.h-1.bg-gradient-to-r.from-blue-500.to-blue-600.transform.scale-x-0.group-hover\\:scale-x-100.transition-transform.duration-300.origin-left');
    expect(hoverBorders).toHaveLength(5);
  });
});
