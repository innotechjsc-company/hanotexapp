import { render, screen } from '@testing-library/react'
import AboutPage from '../page'

describe('AboutPage', () => {
  it('renders without crashing', () => {
    render(<AboutPage />)
    expect(screen.getByText('Giới thiệu')).toBeInTheDocument()
  })

  it('renders main sections', () => {
    render(<AboutPage />)
    
    // Check for main headings
    expect(screen.getByText('Giới thiệu')).toBeInTheDocument()
    expect(screen.getByText('Giá trị cốt lõi')).toBeInTheDocument()
    expect(screen.getByText('Tầm nhìn')).toBeInTheDocument()
    expect(screen.getByText('Sứ mệnh')).toBeInTheDocument()
  })

  it('has proper navigation links', () => {
    render(<AboutPage />)
    
    // Check for contact link
    const contactLink = screen.getByText('Liên hệ ngay')
    expect(contactLink).toBeInTheDocument()
  })
})
