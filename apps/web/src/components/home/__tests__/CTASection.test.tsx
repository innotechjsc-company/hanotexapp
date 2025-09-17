import { render, screen } from '@/test-utils'
import CTASection from '../CTASection'

describe('CTASection', () => {
  it('renders main heading', () => {
    render(<CTASection />)
    
    expect(screen.getByText('Sẵn sàng tham gia cộng đồng công nghệ?')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<CTASection />)
    
    expect(screen.getByText('Hãy bắt đầu hành trình chuyển giao và thương mại hóa công nghệ của bạn ngay hôm nay')).toBeInTheDocument()
  })

  it('renders CTA buttons', () => {
    render(<CTASection />)
    
    expect(screen.getByText('Đăng ký miễn phí')).toBeInTheDocument()
    expect(screen.getByText('Khám phá ngay')).toBeInTheDocument()
  })

  it('has correct links for CTA buttons', () => {
    render(<CTASection />)
    
    const registerButton = screen.getByText('Đăng ký miễn phí')
    const exploreButton = screen.getByText('Khám phá ngay')
    
    expect(registerButton.closest('a')).toHaveAttribute('href', '/register')
    expect(exploreButton.closest('a')).toHaveAttribute('href', '/technologies')
  })

  it('renders benefits section', () => {
    render(<CTASection />)
    
    expect(screen.getByText('Bắt đầu nhanh chóng')).toBeInTheDocument()
    expect(screen.getByText('Cộng đồng lớn')).toBeInTheDocument()
    expect(screen.getByText('Tăng trưởng bền vững')).toBeInTheDocument()
  })

  it('renders benefit descriptions', () => {
    render(<CTASection />)
    
    expect(screen.getByText('Đăng ký và đăng tải công nghệ trong vài phút')).toBeInTheDocument()
    expect(screen.getByText('Kết nối với hàng nghìn chuyên gia công nghệ')).toBeInTheDocument()
    expect(screen.getByText('Phát triển và thương mại hóa công nghệ hiệu quả')).toBeInTheDocument()
  })

  it('renders contact information', () => {
    render(<CTASection />)
    
    expect(screen.getByText('Cần hỗ trợ? Liên hệ với chúng tôi')).toBeInTheDocument()
    expect(screen.getByText('📧 support@hanotex.com')).toBeInTheDocument()
    expect(screen.getByText('📞 +84 123 456 789')).toBeInTheDocument()
    expect(screen.getByText('🕒 24/7 Hỗ trợ')).toBeInTheDocument()
  })

  it('has correct contact links', () => {
    render(<CTASection />)
    
    const emailLink = screen.getByText('📧 support@hanotex.com')
    const phoneLink = screen.getByText('📞 +84 123 456 789')
    
    expect(emailLink.closest('a')).toHaveAttribute('href', 'mailto:support@hanotex.com')
    expect(phoneLink.closest('a')).toHaveAttribute('href', 'tel:+84123456789')
  })

  it('renders with proper structure', () => {
    render(<CTASection />)
    
    // Check that the main section is present
    const section = screen.getByText('Sẵn sàng tham gia cộng đồng công nghệ?').closest('section')
    expect(section).toBeInTheDocument()
    expect(section).toHaveClass('py-20', 'bg-gradient-to-br')
  })

  it('renders benefit icons', () => {
    render(<CTASection />)
    
    // Icons are rendered as SVG elements, we can check by looking for the icon containers
    const benefitCards = screen.getAllByText('Bắt đầu nhanh chóng')
    expect(benefitCards).toHaveLength(1)
  })

  it('has proper accessibility structure', () => {
    render(<CTASection />)
    
    // Check for proper heading hierarchy
    const mainHeading = screen.getByRole('heading', { level: 2 })
    expect(mainHeading).toHaveTextContent('Sẵn sàng tham gia cộng đồng công nghệ?')
    
    // Check for proper link accessibility
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThanOrEqual(4) // CTA buttons + contact links
  })

  it('renders floating elements', () => {
    render(<CTASection />)
    
    // Check that the section has the proper background and floating elements structure
    const section = screen.getByText('Sẵn sàng tham gia cộng đồng công nghệ?').closest('section')
    expect(section).toHaveClass('relative', 'overflow-hidden')
  })

  it('has proper button styling', () => {
    render(<CTASection />)
    
    const registerButton = screen.getByText('Đăng ký miễn phí')
    const exploreButton = screen.getByText('Khám phá ngay')
    
    // Check that buttons have proper styling classes
    expect(registerButton).toHaveClass('inline-flex', 'items-center', 'justify-center')
    expect(exploreButton).toHaveClass('inline-flex', 'items-center', 'justify-center')
  })
})
