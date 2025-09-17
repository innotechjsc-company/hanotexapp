import { render, screen } from '@/test-utils'
import HowItWorksSection from '../HowItWorksSection'

describe('HowItWorksSection', () => {
  it('renders section header', () => {
    render(<HowItWorksSection />)
    
    expect(screen.getByText('Cách thức hoạt động')).toBeInTheDocument()
    expect(screen.getByText('Quy trình đơn giản và minh bạch để tham gia sàn giao dịch công nghệ HANOTEX')).toBeInTheDocument()
  })

  it('renders all 6 steps', () => {
    render(<HowItWorksSection />)
    
    expect(screen.getByText('Đăng ký tài khoản')).toBeInTheDocument()
    expect(screen.getByText('Đăng tải công nghệ')).toBeInTheDocument()
    expect(screen.getByText('Khám phá & Tìm kiếm')).toBeInTheDocument()
    expect(screen.getByText('Kết nối & Thương lượng')).toBeInTheDocument()
    expect(screen.getByText('Đấu giá & Giao dịch')).toBeInTheDocument()
    expect(screen.getByText('Thương mại hóa')).toBeInTheDocument()
  })

  it('renders step descriptions', () => {
    render(<HowItWorksSection />)
    
    expect(screen.getByText('Tạo tài khoản miễn phí với thông tin cá nhân hoặc doanh nghiệp')).toBeInTheDocument()
    expect(screen.getByText('Tải lên thông tin chi tiết về công nghệ, sản phẩm hoặc dịch vụ của bạn')).toBeInTheDocument()
    expect(screen.getByText('Tìm kiếm và khám phá các công nghệ phù hợp với nhu cầu của bạn')).toBeInTheDocument()
    expect(screen.getByText('Liên hệ trực tiếp với chủ sở hữu để thương lượng và đàm phán')).toBeInTheDocument()
    expect(screen.getByText('Tham gia đấu giá hoặc thực hiện giao dịch trực tiếp')).toBeInTheDocument()
    expect(screen.getByText('Chuyển giao công nghệ và thương mại hóa thành công')).toBeInTheDocument()
  })

  it('renders step numbers', () => {
    render(<HowItWorksSection />)
    
    // Check that step numbers 1-6 are present
    for (let i = 1; i <= 6; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument()
    }
  })

  it('renders CTA section', () => {
    render(<HowItWorksSection />)
    
    expect(screen.getByText('Sẵn sàng bắt đầu?')).toBeInTheDocument()
    expect(screen.getByText('Tham gia ngay hôm nay để trở thành một phần của cộng đồng công nghệ Hà Nội')).toBeInTheDocument()
  })

  it('renders CTA buttons', () => {
    render(<HowItWorksSection />)
    
    const registerButton = screen.getByText('Đăng ký ngay')
    const exploreButton = screen.getByText('Khám phá công nghệ')
    
    expect(registerButton).toBeInTheDocument()
    expect(exploreButton).toBeInTheDocument()
  })

  it('has correct links for CTA buttons', () => {
    render(<HowItWorksSection />)
    
    const registerButton = screen.getByText('Đăng ký ngay')
    const exploreButton = screen.getByText('Khám phá công nghệ')
    
    expect(registerButton.closest('a')).toHaveAttribute('href', '/register')
    expect(exploreButton.closest('a')).toHaveAttribute('href', '/technologies')
  })

  it('renders with proper structure', () => {
    render(<HowItWorksSection />)
    
    // Check that the main section is present
    const section = screen.getByText('Cách thức hoạt động').closest('section')
    expect(section).toBeInTheDocument()
    expect(section).toHaveClass('py-20', 'bg-gray-50')
  })

  it('renders step cards with proper styling', () => {
    render(<HowItWorksSection />)
    
    // Check that step cards have proper structure
    const stepCards = screen.getAllByText(/Đăng ký tài khoản|Đăng tải công nghệ|Khám phá & Tìm kiếm|Kết nối & Thương lượng|Đấu giá & Giao dịch|Thương mại hóa/)
    
    stepCards.forEach(card => {
      const cardElement = card.closest('div')
      expect(cardElement).toHaveClass('bg-white', 'rounded-xl', 'shadow-lg')
    })
  })

  it('renders icons for each step', () => {
    render(<HowItWorksSection />)
    
    // Icons are rendered as SVG elements, we can check by looking for the icon containers
    const iconContainers = screen.getAllByText('1').map(stepNumber => 
      stepNumber.closest('div')?.parentElement?.querySelector('[class*="inline-flex"]')
    ).filter(Boolean)
    
    expect(iconContainers.length).toBeGreaterThan(0)
  })

  it('has proper accessibility structure', () => {
    render(<HowItWorksSection />)
    
    // Check for proper heading hierarchy
    const mainHeading = screen.getByRole('heading', { level: 2 })
    expect(mainHeading).toHaveTextContent('Cách thức hoạt động')
    
    // Check for proper link accessibility
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(2) // Register and explore buttons
  })
})
