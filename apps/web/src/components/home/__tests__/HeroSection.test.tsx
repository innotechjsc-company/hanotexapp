import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import HeroSection from '../HeroSection';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock window.location
const mockLocation = {
  href: '',
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

describe('HeroSection', () => {
  const mockPush = jest.fn();
  const mockRouter = {
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    mockLocation.href = '';
    jest.clearAllMocks();
  });

  it('renders hero section with correct content', () => {
    render(<HeroSection />);
    
    // Check if main elements are rendered
    expect(screen.getByText('HANOTEX')).toBeInTheDocument();
    expect(screen.getByText('Kết nối công nghệ – Thúc đẩy đổi mới')).toBeInTheDocument();
    expect(screen.getByText('Sàn giao dịch công nghệ trực tuyến của thành phố Hà Nội')).toBeInTheDocument();
  });

  it('renders search input with correct placeholder', () => {
    render(<HeroSection />);
    
    const searchInput = screen.getByPlaceholderText('Tìm công nghệ, nhu cầu, chuyên gia...');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('type', 'text');
  });

  it('renders CTA buttons', () => {
    render(<HeroSection />);
    
    expect(screen.getByText('Đăng sản phẩm công nghệ')).toBeInTheDocument();
    expect(screen.getByText('Đăng nhu cầu công nghệ')).toBeInTheDocument();
  });

  it('renders statistics section', () => {
    render(<HeroSection />);
    
    expect(screen.getByText('500+')).toBeInTheDocument();
    expect(screen.getByText('2,500+')).toBeInTheDocument();
    expect(screen.getByText('150+')).toBeInTheDocument();
    expect(screen.getByText('1-9')).toBeInTheDocument();
    
    expect(screen.getByText('Công nghệ')).toBeInTheDocument();
    expect(screen.getByText('Người dùng')).toBeInTheDocument();
    expect(screen.getByText('Giao dịch')).toBeInTheDocument();
    expect(screen.getByText('TRL Level')).toBeInTheDocument();
  });

  it('updates search input value when typing', () => {
    render(<HeroSection />);
    
    const searchInput = screen.getByPlaceholderText('Tìm công nghệ, nhu cầu, chuyên gia...');
    
    fireEvent.change(searchInput, { target: { value: 'AI technology' } });
    
    expect(searchInput).toHaveValue('AI technology');
  });

  it('navigates to search results when form is submitted', async () => {
    render(<HeroSection />);
    
    const searchInput = screen.getByPlaceholderText('Tìm công nghệ, nhu cầu, chuyên gia...');
    const searchButton = screen.getByText('Tìm kiếm');
    
    fireEvent.change(searchInput, { target: { value: 'AI technology' } });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(mockLocation.href).toBe('/technologies?q=AI%20technology');
    });
  });

  it('does not navigate when search input is empty', async () => {
    render(<HeroSection />);
    
    const searchButton = screen.getByText('Tìm kiếm');
    
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(mockLocation.href).toBe('');
    });
  });

  it('does not navigate when search input contains only whitespace', async () => {
    render(<HeroSection />);
    
    const searchInput = screen.getByPlaceholderText('Tìm công nghệ, nhu cầu, chuyên gia...');
    const searchButton = screen.getByText('Tìm kiếm');
    
    fireEvent.change(searchInput, { target: { value: '   ' } });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(mockLocation.href).toBe('');
    });
  });

  it('has correct links for CTA buttons', () => {
    render(<HeroSection />);
    
    const registerTechButton = screen.getByText('Đăng sản phẩm công nghệ').closest('a');
    const registerDemandButton = screen.getByText('Đăng nhu cầu công nghệ').closest('a');
    
    expect(registerTechButton).toHaveAttribute('href', '/technologies/register');
    expect(registerDemandButton).toHaveAttribute('href', '/demands/register');
  });

  it('renders with correct styling classes', () => {
    render(<HeroSection />);
    
    const heroSection = screen.getByText('HANOTEX').closest('section');
    expect(heroSection).toHaveClass('relative', 'bg-gradient-to-br', 'from-blue-50', 'via-white', 'to-blue-50');
  });

  it('renders floating elements', () => {
    render(<HeroSection />);
    
    // Check if floating elements are present (they should have specific classes)
    const floatingElements = document.querySelectorAll('.absolute');
    expect(floatingElements.length).toBeGreaterThan(0);
  });

  it('has proper accessibility attributes', () => {
    render(<HeroSection />);
    
    const searchInput = screen.getByPlaceholderText('Tìm công nghệ, nhu cầu, chuyên gia...');
    const searchButton = screen.getByText('Tìm kiếm');
    
    expect(searchInput).toHaveAttribute('type', 'text');
    expect(searchButton).toHaveAttribute('type', 'submit');
  });
});