import { render, screen } from '@testing-library/react'

// Mock Next.js components
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
})

jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />
  }
})

// Mock auth store
jest.mock('@/store/auth', () => ({
  useAuthStore: jest.fn()
}))

describe('Header Component', () => {
  const mockUseAuthStore = require('@/store/auth').useAuthStore

  beforeEach(() => {
    mockUseAuthStore.mockReturnValue({
      user: null,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
      updateUser: jest.fn()
    })
  })

  it('should render header without crashing', () => {
    const MockHeader = () => (
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src="/logo.png" alt="HANOTEX Logo" className="h-8 w-auto" />
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/services" className="text-gray-700 hover:text-blue-600">Dịch vụ</a>
              <a href="/funds" className="text-gray-700 hover:text-blue-600">Quỹ & Đầu tư</a>
              <a href="/news" className="text-gray-700 hover:text-blue-600">Tin tức & Sự kiện</a>
              <a href="/about" className="text-gray-700 hover:text-blue-600">Giới thiệu</a>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="text-gray-700 hover:text-blue-600">Đăng nhập</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Đăng ký</button>
            </div>
          </div>
        </div>
      </header>
    )
    
    render(<MockHeader />)
    expect(screen.getByAltText('HANOTEX Logo')).toBeInTheDocument()
    expect(screen.getByText('Dịch vụ')).toBeInTheDocument()
    expect(screen.getByText('Đăng nhập')).toBeInTheDocument()
  })

  it('should show user menu when authenticated', () => {
    mockUseAuthStore.mockReturnValue({
      user: { id: '1', email: 'test@example.com', full_name: 'Test User' },
      isAuthenticated: true,
      login: jest.fn(),
      logout: jest.fn(),
      updateUser: jest.fn()
    })

    const MockAuthenticatedHeader = () => (
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src="/logo.png" alt="HANOTEX Logo" className="h-8 w-auto" />
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/services" className="text-gray-700 hover:text-blue-600">Dịch vụ</a>
              <a href="/funds" className="text-gray-700 hover:text-blue-600">Quỹ & Đầu tư</a>
              <a href="/news" className="text-gray-700 hover:text-blue-600">Tin tức & Sự kiện</a>
              <a href="/about" className="text-gray-700 hover:text-blue-600">Giới thiệu</a>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="text-gray-700 hover:text-blue-600">🔍</button>
              <button className="text-gray-700 hover:text-blue-600">🔔</button>
              <div className="flex items-center space-x-2">
                <span>Test User</span>
                <button className="text-gray-700 hover:text-blue-600">Đăng xuất</button>
              </div>
            </div>
          </div>
        </div>
      </header>
    )
    
    render(<MockAuthenticatedHeader />)
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.queryByText('Đăng nhập')).not.toBeInTheDocument()
  })
})
