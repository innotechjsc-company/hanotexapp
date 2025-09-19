import { render, screen } from '@testing-library/react'
import ServicesPage from '../page'

describe('ServicesPage', () => {
  it('renders without crashing', () => {
    render(<ServicesPage />)
    expect(screen.getByText('Dịch vụ hỗ trợ')).toBeInTheDocument()
  })

  it('renders service cards', () => {
    render(<ServicesPage />)
    
    // Check for service titles
    expect(screen.getByText('Tư vấn chuyển giao công nghệ')).toBeInTheDocument()
    expect(screen.getByText('Thẩm định & định giá công nghệ')).toBeInTheDocument()
    expect(screen.getByText('Dịch vụ pháp lý')).toBeInTheDocument()
    expect(screen.getByText('Sở hữu trí tuệ')).toBeInTheDocument()
    expect(screen.getByText('Kết nối đầu tư')).toBeInTheDocument()
    expect(screen.getByText('Đào tạo & Hỗ trợ')).toBeInTheDocument()
  })

  it('has contact buttons', () => {
    render(<ServicesPage />)
    
    const contactButtons = screen.getAllByText('Liên hệ ngay')
    expect(contactButtons.length).toBeGreaterThan(0)
  })
})
