import { render, screen } from '@testing-library/react'
import LegalPage from '../page'

describe('LegalPage', () => {
  it('renders without crashing', () => {
    render(<LegalPage />)
    expect(screen.getByText('Dịch vụ pháp lý')).toBeInTheDocument()
  })

  it('renders main sections', () => {
    render(<LegalPage />)
    
    expect(screen.getByText('Dịch vụ pháp lý')).toBeInTheDocument()
    expect(screen.getByText('Dịch vụ')).toBeInTheDocument()
    expect(screen.getByText('Quy trình làm việc')).toBeInTheDocument()
  })

  it('renders service cards', () => {
    render(<LegalPage />)
    
    expect(screen.getByText('Đăng ký sở hữu trí tuệ')).toBeInTheDocument()
    expect(screen.getByText('Tư vấn pháp lý')).toBeInTheDocument()
    expect(screen.getByText('Soạn thảo hợp đồng')).toBeInTheDocument()
  })
})
