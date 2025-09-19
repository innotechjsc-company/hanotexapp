import { render, screen } from '@testing-library/react'
import ValuationPage from '../page'

describe('ValuationPage', () => {
  it('renders without crashing', () => {
    render(<ValuationPage />)
    expect(screen.getByText('Thẩm định & định giá công nghệ')).toBeInTheDocument()
  })

  it('renders main sections', () => {
    render(<ValuationPage />)
    
    expect(screen.getByText('Dịch vụ')).toBeInTheDocument()
    expect(screen.getByText('Phương pháp định giá')).toBeInTheDocument()
    expect(screen.getByText('Tại sao chọn chúng tôi?')).toBeInTheDocument()
  })

  it('renders service cards', () => {
    render(<ValuationPage />)
    
    expect(screen.getByText('Định giá sáng chế')).toBeInTheDocument()
    expect(screen.getByText('Định giá công nghệ phần mềm')).toBeInTheDocument()
    expect(screen.getByText('Định giá tài sản trí tuệ')).toBeInTheDocument()
  })
})
