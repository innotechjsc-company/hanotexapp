import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import ProfilePage from '../page';
import { useAuthStore } from '@/store/auth';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock auth store
jest.mock('@/store/auth', () => ({
  useAuthStore: jest.fn(),
}));

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

describe('ProfilePage', () => {
  const mockPush = jest.fn();
  
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to login when not authenticated', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      user: null,
    });

    render(<ProfilePage />);
    
    expect(mockPush).toHaveBeenCalledWith('/auth/login');
  });

  it('renders profile page when authenticated', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      user_type: 'INDIVIDUAL',
      role: 'USER',
      created_at: '2023-01-01T00:00:00Z',
      profile: {
        full_name: 'John Doe',
        phone: '0123456789',
        profession: 'Developer',
      },
    };

    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: mockUser,
    });

    render(<ProfilePage />);
    
    expect(screen.getByText('Hồ sơ cá nhân')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('shows individual user type correctly', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      user_type: 'INDIVIDUAL',
      role: 'USER',
      created_at: '2023-01-01T00:00:00Z',
      profile: {
        full_name: 'John Doe',
        phone: '0123456789',
        profession: 'Developer',
      },
    };

    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: mockUser,
    });

    render(<ProfilePage />);
    
    expect(screen.getByText('Cá nhân')).toBeInTheDocument();
    expect(screen.getByText('Nghề nghiệp')).toBeInTheDocument();
  });

  it('shows company user type correctly', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      user_type: 'COMPANY',
      role: 'USER',
      created_at: '2023-01-01T00:00:00Z',
      profile: {
        full_name: 'John Doe',
        phone: '0123456789',
        company_name: 'Test Company',
        tax_code: '123456789',
        legal_representative: 'John Doe',
      },
    };

    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: mockUser,
    });

    render(<ProfilePage />);
    
    expect(screen.getByText('Doanh nghiệp')).toBeInTheDocument();
    expect(screen.getByText('Tên công ty')).toBeInTheDocument();
    expect(screen.getByText('Mã số thuế')).toBeInTheDocument();
  });

  it('shows research institution user type correctly', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      user_type: 'RESEARCH_INSTITUTION',
      role: 'USER',
      created_at: '2023-01-01T00:00:00Z',
      profile: {
        full_name: 'John Doe',
        phone: '0123456789',
        institution_name: 'Test University',
        institution_code: 'TU001',
        governing_body: 'Ministry of Education',
      },
    };

    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: mockUser,
    });

    render(<ProfilePage />);
    
    expect(screen.getByText('Viện/Trường')).toBeInTheDocument();
    expect(screen.getByText('Tên viện/trường')).toBeInTheDocument();
    expect(screen.getByText('Mã viện/trường')).toBeInTheDocument();
  });

  it('toggles edit mode when edit button is clicked', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      user_type: 'INDIVIDUAL',
      role: 'USER',
      created_at: '2023-01-01T00:00:00Z',
      profile: {
        full_name: 'John Doe',
        phone: '0123456789',
        profession: 'Developer',
      },
    };

    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: mockUser,
    });

    render(<ProfilePage />);
    
    const editButton = screen.getByText('Chỉnh sửa');
    fireEvent.click(editButton);
    
    await waitFor(() => {
      expect(screen.getByText('Lưu')).toBeInTheDocument();
      expect(screen.getByText('Hủy')).toBeInTheDocument();
    });
  });

  it('cancels edit mode when cancel button is clicked', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      user_type: 'INDIVIDUAL',
      role: 'USER',
      created_at: '2023-01-01T00:00:00Z',
      profile: {
        full_name: 'John Doe',
        phone: '0123456789',
        profession: 'Developer',
      },
    };

    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: mockUser,
    });

    render(<ProfilePage />);
    
    const editButton = screen.getByText('Chỉnh sửa');
    fireEvent.click(editButton);
    
    await waitFor(() => {
      const cancelButton = screen.getByText('Hủy');
      fireEvent.click(cancelButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Chỉnh sửa')).toBeInTheDocument();
      expect(screen.queryByText('Lưu')).not.toBeInTheDocument();
    });
  });

  it('updates form data when input values change', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      user_type: 'INDIVIDUAL',
      role: 'USER',
      created_at: '2023-01-01T00:00:00Z',
      profile: {
        full_name: 'John Doe',
        phone: '0123456789',
        profession: 'Developer',
      },
    };

    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: mockUser,
    });

    render(<ProfilePage />);
    
    const editButton = screen.getByText('Chỉnh sửa');
    fireEvent.click(editButton);
    
    await waitFor(() => {
      const nameInput = screen.getByDisplayValue('John Doe');
      fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
      
      expect(nameInput).toHaveValue('Jane Doe');
    });
  });

  it('shows statistics section', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      user_type: 'INDIVIDUAL',
      role: 'USER',
      created_at: '2023-01-01T00:00:00Z',
      profile: {
        full_name: 'John Doe',
        phone: '0123456789',
        profession: 'Developer',
      },
    };

    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: mockUser,
    });

    render(<ProfilePage />);
    
    expect(screen.getByText('Thống kê')).toBeInTheDocument();
    expect(screen.getByText('Công nghệ đã đăng')).toBeInTheDocument();
    expect(screen.getByText('Nhu cầu đã đăng')).toBeInTheDocument();
    expect(screen.getByText('Đấu giá tham gia')).toBeInTheDocument();
  });
});

