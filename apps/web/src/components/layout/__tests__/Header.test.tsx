import { render, screen } from '@testing-library/react'
import { useAuthStore } from '@/store/auth'
import Header from '../Header'

// Mock the auth store
jest.mock('@/store/auth', () => ({
  useAuthStore: jest.fn()
}))

// Mock Next.js Link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
})

// Mock Next.js Image
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />
  }
})

describe('Header', () => {
  const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>

  beforeEach(() => {
    mockUseAuthStore.mockReturnValue({
      user: null,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
      updateUser: jest.fn()
    })
  })

  it('renders without crashing', () => {
    render(<Header />)
    expect(screen.getByAltText('HANOTEX Logo')).toBeInTheDocument()
  })

  it('renders navigation menu', () => {
    render(<Header />)
    
    expect(screen.getByText('Dịch vụ')).toBeInTheDocument()
    expect(screen.getByText('Quỹ & Đầu tư')).toBeInTheDocument()
    expect(screen.getByText('Tin tức & Sự kiện')).toBeInTheDocument()
    expect(screen.getByText('Giới thiệu')).toBeInTheDocument()
  })

  it('shows login button when not authenticated', () => {
    render(<Header />)
    
    expect(screen.getByText('Đăng nhập')).toBeInTheDocument()
    expect(screen.getByText('Đăng ký')).toBeInTheDocument()
  })

  it('shows user menu when authenticated', () => {
    mockUseAuthStore.mockReturnValue({
      user: { id: '1', email: 'test@example.com', full_name: 'Test User' },
      isAuthenticated: true,
      login: jest.fn(),
      logout: jest.fn(),
      updateUser: jest.fn()
    })

    render(<Header />)
    
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.queryByText('Đăng nhập')).not.toBeInTheDocument()
  })

  it('shows search and notification icons when authenticated', () => {
    mockUseAuthStore.mockReturnValue({
      user: { id: '1', email: 'test@example.com', full_name: 'Test User' },
      isAuthenticated: true,
      login: jest.fn(),
      logout: jest.fn(),
      updateUser: jest.fn()
    })

    render(<Header />)
    
    // Check for search and notification icons (they should be present)
    const searchIcon = screen.getByRole('button', { name: /tìm kiếm/i })
    const notificationIcon = screen.getByRole('button', { name: /thông báo/i })
    
    expect(searchIcon).toBeInTheDocument()
    expect(notificationIcon).toBeInTheDocument()
  })
})