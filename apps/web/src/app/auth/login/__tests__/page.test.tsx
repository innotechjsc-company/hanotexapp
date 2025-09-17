import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import LoginPage from '../page';
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

describe('LoginPage', () => {
  const mockPush = jest.fn();
  const mockLogin = jest.fn();
  
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    });

    mockUseAuthStore.mockReturnValue({
      login: mockLogin,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form correctly', () => {
    render(<LoginPage />);
    
    expect(screen.getByText('Đăng nhập tài khoản')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Mật khẩu')).toBeInTheDocument();
    expect(screen.getByText('Đăng nhập')).toBeInTheDocument();
  });

  it('shows register link', () => {
    render(<LoginPage />);
    
    const registerLink = screen.getByText('tạo tài khoản mới');
    expect(registerLink).toBeInTheDocument();
    expect(registerLink.closest('a')).toHaveAttribute('href', '/auth/register');
  });

  it('updates form data when input values change', () => {
    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Mật khẩu');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('calls login function when form is submitted', async () => {
    mockLogin.mockResolvedValue(undefined);
    
    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Mật khẩu');
    const submitButton = screen.getByText('Đăng nhập');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('redirects to home page after successful login', async () => {
    mockLogin.mockResolvedValue(undefined);
    
    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Mật khẩu');
    const submitButton = screen.getByText('Đăng nhập');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('shows error message when login fails', async () => {
    const errorMessage = 'Invalid credentials';
    mockLogin.mockRejectedValue(new Error(errorMessage));
    
    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Mật khẩu');
    const submitButton = screen.getByText('Đăng nhập');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('shows loading state when submitting', async () => {
    mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Mật khẩu');
    const submitButton = screen.getByText('Đăng nhập');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    expect(screen.getByText('Đang đăng nhập...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('validates required fields', () => {
    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Mật khẩu');
    
    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });

  it('has remember me checkbox', () => {
    render(<LoginPage />);
    
    const rememberCheckbox = screen.getByLabelText('Ghi nhớ đăng nhập');
    expect(rememberCheckbox).toBeInTheDocument();
    expect(rememberCheckbox).toHaveAttribute('type', 'checkbox');
  });

  it('has forgot password link', () => {
    render(<LoginPage />);
    
    const forgotPasswordLink = screen.getByText('Quên mật khẩu?');
    expect(forgotPasswordLink).toBeInTheDocument();
  });

  it('has proper form attributes', () => {
    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Mật khẩu');
    
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('autocomplete', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('autocomplete', 'current-password');
  });
});

