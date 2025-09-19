import { render, screen } from '@testing-library/react'
import ContactPage from '../page'

describe('ContactPage', () => {
  it('renders without crashing', () => {
    render(<ContactPage />)
    expect(screen.getByText('Liên hệ')).toBeInTheDocument()
  })

  it('renders contact form', () => {
    render(<ContactPage />)
    
    // Check for form elements
    expect(screen.getByLabelText(/họ tên/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/số điện thoại/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/tiêu đề/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/nội dung/i)).toBeInTheDocument()
  })

  it('has submit button', () => {
    render(<ContactPage />)
    
    const submitButton = screen.getByText('Gửi tin nhắn')
    expect(submitButton).toBeInTheDocument()
  })
})
