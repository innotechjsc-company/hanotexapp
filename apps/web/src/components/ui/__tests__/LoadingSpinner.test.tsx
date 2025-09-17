import { render, screen } from '@/test-utils'
import LoadingSpinner from '../LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders with default size', () => {
    render(<LoadingSpinner />)
    
    const spinner = screen.getByRole('status')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveClass('animate-spin')
  })

  it('renders with small size', () => {
    render(<LoadingSpinner size="sm" />)
    
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('h-4', 'w-4')
  })

  it('renders with medium size', () => {
    render(<LoadingSpinner size="md" />)
    
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('h-6', 'w-6')
  })

  it('renders with large size', () => {
    render(<LoadingSpinner size="lg" />)
    
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('h-8', 'w-8')
  })

  it('renders with custom className', () => {
    render(<LoadingSpinner className="custom-class" />)
    
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('custom-class')
  })

  it('has accessible label', () => {
    render(<LoadingSpinner />)
    
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveAttribute('aria-label', 'Loading')
  })
})
