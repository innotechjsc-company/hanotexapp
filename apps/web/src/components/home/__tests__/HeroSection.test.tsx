import { render, screen } from '@testing-library/react'
import HeroSection from '../HeroSection'

describe('HeroSection', () => {
  it('renders without crashing', () => {
    render(<HeroSection />)
    expect(screen.getByText('Sàn giao dịch công nghệ Hà Nội')).toBeInTheDocument()
  })

  it('renders main heading', () => {
    render(<HeroSection />)
    
    expect(screen.getByText('Sàn giao dịch công nghệ Hà Nội')).toBeInTheDocument()
    expect(screen.getByText('Kết nối doanh nghiệp, viện nghiên cứu và cá nhân')).toBeInTheDocument()
  })

  it('renders CTA buttons', () => {
    render(<HeroSection />)
    
    expect(screen.getByText('Khám phá ngay')).toBeInTheDocument()
    expect(screen.getByText('Tìm hiểu thêm')).toBeInTheDocument()
  })

  it('has proper links', () => {
    render(<HeroSection />)
    
    const exploreLink = screen.getByText('Khám phá ngay').closest('a')
    const learnMoreLink = screen.getByText('Tìm hiểu thêm').closest('a')
    
    expect(exploreLink).toHaveAttribute('href', '/technologies')
    expect(learnMoreLink).toHaveAttribute('href', '/about')
  })
})