import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer', () => {
  it('renders footer with correct content', () => {
    render(<Footer />);
    
    // Check if main elements are rendered
    expect(screen.getByText('HANOTEX')).toBeInTheDocument();
    expect(screen.getByText('Sàn giao dịch công nghệ trực tuyến của thành phố Hà Nội. Kết nối cung - cầu công nghệ, thúc đẩy đổi mới sáng tạo.')).toBeInTheDocument();
  });

  it('renders company information', () => {
    render(<Footer />);
    
    // Check if company information is rendered
    expect(screen.getByText('Sàn giao dịch công nghệ trực tuyến của thành phố Hà Nội. Kết nối cung - cầu công nghệ, thúc đẩy đổi mới sáng tạo.')).toBeInTheDocument();
  });

  it('renders contact information', () => {
    render(<Footer />);
    
    // Check if contact information is rendered
    expect(screen.getByText('Sở KH&CN Hà Nội')).toBeInTheDocument();
    expect(screen.getByText('15 Lê Thánh Tông, Hoàn Kiếm, Hà Nội')).toBeInTheDocument();
    expect(screen.getByText('024 3825 1234')).toBeInTheDocument();
    expect(screen.getByText('info@hanotex.gov.vn')).toBeInTheDocument();
    expect(screen.getByText('www.hanotex.gov.vn')).toBeInTheDocument();
  });

  it('renders quick links section', () => {
    render(<Footer />);
    
    // Check if quick links section is rendered
    expect(screen.getByText('Liên kết nhanh')).toBeInTheDocument();
    expect(screen.getByText('Trang chủ')).toBeInTheDocument();
    expect(screen.getByText('Công nghệ')).toBeInTheDocument();
    expect(screen.getByText('Nhu cầu')).toBeInTheDocument();
    expect(screen.getByText('Tin tức')).toBeInTheDocument();
    expect(screen.getByText('Sự kiện')).toBeInTheDocument();
    expect(screen.getByText('Về chúng tôi')).toBeInTheDocument();
  });

  it('renders services section', () => {
    render(<Footer />);
    
    // Check if services section is rendered
    expect(screen.getByText('Dịch vụ')).toBeInTheDocument();
    expect(screen.getByText('Đăng công nghệ')).toBeInTheDocument();
    expect(screen.getByText('Đăng nhu cầu')).toBeInTheDocument();
    expect(screen.getByText('Tư vấn chuyển giao')).toBeInTheDocument();
    expect(screen.getByText('Định giá công nghệ')).toBeInTheDocument();
    expect(screen.getByText('Hỗ trợ pháp lý')).toBeInTheDocument();
    expect(screen.getByText('Kết nối đầu tư')).toBeInTheDocument();
  });

  it('renders policies section', () => {
    render(<Footer />);
    
    // Check if policies section is rendered
    expect(screen.getByText('Chính sách')).toBeInTheDocument();
    expect(screen.getByText('Điều khoản sử dụng')).toBeInTheDocument();
    expect(screen.getByText('Chính sách bảo mật')).toBeInTheDocument();
    expect(screen.getByText('Quy định đăng tin')).toBeInTheDocument();
    expect(screen.getByText('Chính sách hoàn tiền')).toBeInTheDocument();
    expect(screen.getByText('Hướng dẫn sử dụng')).toBeInTheDocument();
    expect(screen.getByText('Câu hỏi thường gặp')).toBeInTheDocument();
  });

  it('renders newsletter subscription', () => {
    render(<Footer />);
    
    // Check if newsletter subscription is rendered
    expect(screen.getByText('Đăng ký nhận tin tức')).toBeInTheDocument();
    expect(screen.getByText('Nhận thông tin mới nhất về công nghệ, sự kiện và cơ hội hợp tác')).toBeInTheDocument();
    
    const emailInput = screen.getByPlaceholderText('Nhập email của bạn');
    const subscribeButton = screen.getByText('Đăng ký');
    
    expect(emailInput).toBeInTheDocument();
    expect(subscribeButton).toBeInTheDocument();
  });

  it('renders social links', () => {
    render(<Footer />);
    
    // Check if social links are rendered
    expect(screen.getByText('Theo dõi chúng tôi:')).toBeInTheDocument();
    
    // Check if social media icons are present
    const socialIcons = document.querySelectorAll('a[aria-label]');
    expect(socialIcons).toHaveLength(4);
  });

  it('renders copyright information', () => {
    render(<Footer />);
    
    // Check if copyright information is rendered
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} HANOTEX. Tất cả quyền được bảo lưu.`)).toBeInTheDocument();
  });

  it('renders government link', () => {
    render(<Footer />);
    
    // Check if government link is rendered
    expect(screen.getByText('Được vận hành bởi')).toBeInTheDocument();
    expect(screen.getByText('Sở Khoa học và Công nghệ Hà Nội')).toBeInTheDocument();
  });

  it('renders with correct styling classes', () => {
    render(<Footer />);
    
    const footer = screen.getByText('HANOTEX').closest('footer');
    expect(footer).toHaveClass('bg-gray-900', 'text-white');
  });

  it('renders logo with correct styling', () => {
    render(<Footer />);
    
    const logo = screen.getByText('HANOTEX');
    expect(logo).toHaveClass('bg-blue-600', 'text-white', 'px-4', 'py-2', 'rounded-lg', 'font-bold', 'text-xl');
  });

  it('renders contact information with correct styling', () => {
    render(<Footer />);
    
    const contactInfo = screen.getByText('Sở KH&CN Hà Nội').closest('div');
    expect(contactInfo).toHaveClass('space-y-3');
  });

  it('renders quick links with correct styling', () => {
    render(<Footer />);
    
    const quickLinks = screen.getByText('Liên kết nhanh').closest('div');
    expect(quickLinks).toHaveClass('space-y-3');
  });

  it('renders services with correct styling', () => {
    render(<Footer />);
    
    const services = screen.getByText('Dịch vụ').closest('div');
    expect(services).toHaveClass('space-y-3');
  });

  it('renders policies with correct styling', () => {
    render(<Footer />);
    
    const policies = screen.getByText('Chính sách').closest('div');
    expect(policies).toHaveClass('space-y-3');
  });

  it('renders newsletter form with correct styling', () => {
    render(<Footer />);
    
    const emailInput = screen.getByPlaceholderText('Nhập email của bạn');
    const subscribeButton = screen.getByText('Đăng ký');
    
    expect(emailInput).toHaveClass('flex-1', 'px-4', 'py-3', 'bg-gray-800', 'border', 'border-gray-700', 'rounded-lg', 'text-white', 'placeholder-gray-400', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent');
    expect(subscribeButton).toHaveClass('inline-flex', 'items-center', 'justify-center', 'rounded-lg', 'px-6', 'py-3', 'text-base', 'font-medium', 'transition-colors', 'focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2', 'bg-blue-600', 'text-white', 'hover:bg-blue-700', 'focus:ring-blue-500');
  });

  it('renders social links with correct styling', () => {
    render(<Footer />);
    
    const socialLinks = document.querySelectorAll('a[aria-label]');
    
    socialLinks.forEach(link => {
      expect(link).toHaveClass('text-gray-400', 'hover:text-white', 'transition-colors');
    });
  });

  it('renders copyright with correct styling', () => {
    render(<Footer />);
    
    const currentYear = new Date().getFullYear();
    const copyright = screen.getByText(`© ${currentYear} HANOTEX. Tất cả quyền được bảo lưu.`);
    expect(copyright).toHaveClass('text-gray-400', 'text-sm');
  });

  it('renders government link with correct styling', () => {
    render(<Footer />);
    
    const governmentLink = screen.getByText('Sở Khoa học và Công nghệ Hà Nội');
    expect(governmentLink).toHaveClass('text-blue-400', 'hover:text-blue-300', 'transition-colors');
  });

  it('renders section headers with correct styling', () => {
    render(<Footer />);
    
    const sectionHeaders = screen.getAllByText(/Liên kết nhanh|Dịch vụ|Chính sách/);
    
    sectionHeaders.forEach(header => {
      expect(header).toHaveClass('text-lg', 'font-semibold', 'mb-6', 'flex', 'items-center');
    });
  });

  it('renders section links with correct styling', () => {
    render(<Footer />);
    
    const sectionLinks = screen.getAllByText(/Trang chủ|Công nghệ|Nhu cầu|Đăng công nghệ|Đăng nhu cầu|Điều khoản sử dụng|Chính sách bảo mật/);
    
    sectionLinks.forEach(link => {
      expect(link).toHaveClass('text-gray-300', 'hover:text-white', 'transition-colors', 'flex', 'items-center', 'group');
    });
  });

  it('renders newsletter section with correct styling', () => {
    render(<Footer />);
    
    const newsletterSection = screen.getByText('Đăng ký nhận tin tức').closest('div');
    expect(newsletterSection).toHaveClass('mt-12', 'pt-8', 'border-t', 'border-gray-800');
  });

  it('renders newsletter form container with correct styling', () => {
    render(<Footer />);
    
    const newsletterFormContainer = screen.getByPlaceholderText('Nhập email của bạn').closest('div')?.parentElement;
    expect(newsletterFormContainer).toHaveClass('flex', 'flex-col', 'sm:flex-row', 'gap-4');
  });

  it('renders bottom footer with correct styling', () => {
    render(<Footer />);
    
    const bottomFooter = screen.getByText('Theo dõi chúng tôi:').closest('div')?.parentElement;
    expect(bottomFooter).toHaveClass('border-t', 'border-gray-800');
  });

  it('renders bottom footer content with correct styling', () => {
    render(<Footer />);
    
    const bottomFooterContent = screen.getByText('Theo dõi chúng tôi:').closest('div')?.parentElement?.parentElement;
    expect(bottomFooterContent).toHaveClass('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'py-6');
  });

  it('renders government link section with correct styling', () => {
    render(<Footer />);
    
    const governmentLinkSection = screen.getByText('Được vận hành bởi').closest('div');
    expect(governmentLinkSection).toHaveClass('mt-4', 'pt-4', 'border-t', 'border-gray-800', 'text-center');
  });

  it('renders all quick links with correct href attributes', () => {
    render(<Footer />);
    
    const homeLink = screen.getByText('Trang chủ').closest('a');
    const technologiesLink = screen.getByText('Công nghệ').closest('a');
    const demandsLink = screen.getByText('Nhu cầu').closest('a');
    const newsLink = screen.getByText('Tin tức').closest('a');
    const eventsLink = screen.getByText('Sự kiện').closest('a');
    const aboutLink = screen.getByText('Về chúng tôi').closest('a');
    
    expect(homeLink).toHaveAttribute('href', '/');
    expect(technologiesLink).toHaveAttribute('href', '/technologies');
    expect(demandsLink).toHaveAttribute('href', '/demands');
    expect(newsLink).toHaveAttribute('href', '/news');
    expect(eventsLink).toHaveAttribute('href', '/events');
    expect(aboutLink).toHaveAttribute('href', '/about');
  });

  it('renders all service links with correct href attributes', () => {
    render(<Footer />);
    
    const registerTechLink = screen.getByText('Đăng công nghệ').closest('a');
    const registerDemandLink = screen.getByText('Đăng nhu cầu').closest('a');
    const consultingLink = screen.getByText('Tư vấn chuyển giao').closest('a');
    const valuationLink = screen.getByText('Định giá công nghệ').closest('a');
    const legalLink = screen.getByText('Hỗ trợ pháp lý').closest('a');
    const investmentLink = screen.getByText('Kết nối đầu tư').closest('a');
    
    expect(registerTechLink).toHaveAttribute('href', '/technologies/register');
    expect(registerDemandLink).toHaveAttribute('href', '/demands/register');
    expect(consultingLink).toHaveAttribute('href', '/services/consulting');
    expect(valuationLink).toHaveAttribute('href', '/services/valuation');
    expect(legalLink).toHaveAttribute('href', '/services/legal');
    expect(investmentLink).toHaveAttribute('href', '/services/investment');
  });

  it('renders all policy links with correct href attributes', () => {
    render(<Footer />);
    
    const termsLink = screen.getByText('Điều khoản sử dụng').closest('a');
    const privacyLink = screen.getByText('Chính sách bảo mật').closest('a');
    const postingRulesLink = screen.getByText('Quy định đăng tin').closest('a');
    const refundPolicyLink = screen.getByText('Chính sách hoàn tiền').closest('a');
    const userGuideLink = screen.getByText('Hướng dẫn sử dụng').closest('a');
    const faqLink = screen.getByText('Câu hỏi thường gặp').closest('a');
    
    expect(termsLink).toHaveAttribute('href', '/terms');
    expect(privacyLink).toHaveAttribute('href', '/privacy');
    expect(postingRulesLink).toHaveAttribute('href', '/posting-rules');
    expect(refundPolicyLink).toHaveAttribute('href', '/refund-policy');
    expect(userGuideLink).toHaveAttribute('href', '/user-guide');
    expect(faqLink).toHaveAttribute('href', '/faq');
  });

  it('renders social links with correct href attributes', () => {
    render(<Footer />);
    
    const socialLinks = document.querySelectorAll('a[aria-label]');
    
    expect(socialLinks[0]).toHaveAttribute('href', 'https://facebook.com/hanotex');
    expect(socialLinks[1]).toHaveAttribute('href', 'https://twitter.com/hanotex');
    expect(socialLinks[2]).toHaveAttribute('href', 'https://linkedin.com/company/hanotex');
    expect(socialLinks[3]).toHaveAttribute('href', 'https://youtube.com/hanotex');
  });

  it('renders government link with correct href attribute', () => {
    render(<Footer />);
    
    const governmentLink = screen.getByText('Sở Khoa học và Công nghệ Hà Nội').closest('a');
    expect(governmentLink).toHaveAttribute('href', 'https://www.hanoi.gov.vn');
    expect(governmentLink).toHaveAttribute('target', '_blank');
    expect(governmentLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
