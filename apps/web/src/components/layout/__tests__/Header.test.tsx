import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import Header from '../Header';
import { useAuthStore } from '@/store/auth';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock auth store
jest.mock('@/store/auth', () => ({
  useAuthStore: jest.fn(),
}));

// Mock SearchModal
jest.mock('@/components/ui/SearchModal', () => {
  return function MockSearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    return isOpen ? (
      <div data-testid="search-modal">
        <button onClick={onClose}>Close</button>
      </div>
    ) : null;
  };
});

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

describe('Header Component', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/');
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders logo and navigation correctly', () => {
    render(<Header />);
    
    expect(screen.getByText('HANOTEX')).toBeInTheDocument();
    expect(screen.getByText('Sàn giao dịch công nghệ Hà Nội')).toBeInTheDocument();
    expect(screen.getByText('Trang chủ')).toBeInTheDocument();
    expect(screen.getByText('Công nghệ')).toBeInTheDocument();
  });

  it('shows login and register buttons when not authenticated', () => {
    render(<Header />);
    
    expect(screen.getByText('Đăng nhập')).toBeInTheDocument();
    expect(screen.getByText('Đăng ký')).toBeInTheDocument();
  });

  it('shows user menu when authenticated', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { email: 'test@example.com', user_type: 'INDIVIDUAL' },
      logout: jest.fn(),
    });

    render(<Header />);
    
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.queryByText('Đăng nhập')).not.toBeInTheDocument();
  });

  it('opens search modal when search button is clicked', async () => {
    render(<Header />);
    
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('search-modal')).toBeInTheDocument();
    });
  });

  it('toggles user menu when user button is clicked', async () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { email: 'test@example.com', user_type: 'INDIVIDUAL' },
      logout: jest.fn(),
    });

    render(<Header />);
    
    const userButton = screen.getByText('test@example.com');
    fireEvent.click(userButton);
    
    await waitFor(() => {
      expect(screen.getByText('Hồ sơ cá nhân')).toBeInTheDocument();
      expect(screen.getByText('Đăng xuất')).toBeInTheDocument();
    });
  });

  it('calls logout when logout button is clicked', async () => {
    const mockLogout = jest.fn();
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { email: 'test@example.com', user_type: 'INDIVIDUAL' },
      logout: mockLogout,
    });

    render(<Header />);
    
    const userButton = screen.getByText('test@example.com');
    fireEvent.click(userButton);
    
    await waitFor(() => {
      const logoutButton = screen.getByText('Đăng xuất');
      fireEvent.click(logoutButton);
    });
    
    expect(mockLogout).toHaveBeenCalled();
  });

  it('shows active state for current page', () => {
    mockUsePathname.mockReturnValue('/technologies');
    
    render(<Header />);
    
    const technologiesLink = screen.getByText('Công nghệ');
    expect(technologiesLink.closest('a')).toHaveClass('bg-blue-100', 'text-blue-700');
  });

  it('toggles mobile menu when hamburger button is clicked', async () => {
    // Mock window.innerWidth for mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    render(<Header />);
    
    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);
    
    await waitFor(() => {
      expect(screen.getByText('Trang chủ')).toBeInTheDocument();
    });
  });

  it('shows notification badge', () => {
    render(<Header />);
    
    const notificationButton = screen.getByRole('button', { name: /bell/i });
    expect(notificationButton).toBeInTheDocument();
    
    // Check for notification badge
    const badge = notificationButton.querySelector('.bg-red-500');
    expect(badge).toBeInTheDocument();
  });
});