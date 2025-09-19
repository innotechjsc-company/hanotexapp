import { render, screen } from '@testing-library/react'
import ConsultingPage from '../page'

describe('ConsultingPage', () => {
  it('renders without crashing', () => {
    render(<ConsultingPage />)
    expect(screen.getByText('Tư vấn chuyển giao công nghệ')).toBeInTheDocument()
  })

  it('renders service sections', () => {
    render(<ConsultingPage />)
    
    // Check for main sections
    expect(screen.getByText('Dịch vụ tư vấn')).toBeInTheDocument()
    expect(screen.getByText('Quy trình tư vấn')).toBeInTheDocument()
    expect(screen.getByText('Tại sao chọn chúng tôi?')).toBeInTheDocument()
  })

  it('renders service cards', () => {
    render(<ConsultingPage />)
    
    expect(screen.getByText('Đánh giá tiềm năng thương mại')).toBeInTheDocument()
    expect(screen.getByText('Tư vấn chiến lược chuyển giao')).toBeInTheDocument()
    expect(screen.getByText('Hỗ trợ đàm phán hợp đồng')).toBeInTheDocument()
  })

  it('has contact information', () => {
    render(<ConsultingPage />)
    
    expect(screen.getByText('024 3825 1234')).toBeInTheDocument()
    expect(screen.getByText('consulting@hanotex.gov.vn')).toBeInTheDocument()
  })
})
