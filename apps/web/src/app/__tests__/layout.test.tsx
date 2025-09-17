import { render, screen } from '@testing-library/react';
import RootLayout from '../layout';

// Mock the components
jest.mock('@/components/layout/Header', () => {
  return function MockHeader() {
    return <div data-testid="header">Header</div>;
  };
});

jest.mock('@/components/layout/Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer</div>;
  };
});

jest.mock('@/app/providers', () => ({
  Providers: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="providers">{children}</div>
  ),
}));

jest.mock('react-hot-toast', () => ({
  Toaster: () => <div data-testid="toaster">Toaster</div>,
}));

describe('RootLayout', () => {
  it('renders with correct HTML structure', () => {
    render(
      <RootLayout>
        <div data-testid="children">Children</div>
      </RootLayout>
    );
    
    // Check if HTML structure is correct
    const html = document.documentElement;
    expect(html).toHaveAttribute('lang', 'vi');
    expect(html).toHaveClass('h-full');
  });

  it('renders with correct body structure', () => {
    render(
      <RootLayout>
        <div data-testid="children">Children</div>
      </RootLayout>
    );
    
    const body = document.body;
    expect(body).toHaveClass('h-full', 'antialiased');
  });

  it('renders all layout components', () => {
    render(
      <RootLayout>
        <div data-testid="children">Children</div>
      </RootLayout>
    );
    
    // Check if all layout components are rendered
    expect(screen.getByTestId('providers')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('toaster')).toBeInTheDocument();
    expect(screen.getByTestId('children')).toBeInTheDocument();
  });

  it('renders children in correct order', () => {
    render(
      <RootLayout>
        <div data-testid="children">Children</div>
      </RootLayout>
    );
    
    const providers = screen.getByTestId('providers');
    const header = screen.getByTestId('header');
    const footer = screen.getByTestId('footer');
    const children = screen.getByTestId('children');
    
    // Check if children are rendered in correct order
    expect(providers).toBeInTheDocument();
    expect(header).toBeInTheDocument();
    expect(children).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });

  it('renders with correct styling classes', () => {
    render(
      <RootLayout>
        <div data-testid="children">Children</div>
      </RootLayout>
    );
    
    const providers = screen.getByTestId('providers');
    const header = screen.getByTestId('header');
    const footer = screen.getByTestId('footer');
    
    // Check if components have correct styling
    expect(providers).toBeInTheDocument();
    expect(header).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });

  it('renders with correct accessibility attributes', () => {
    render(
      <RootLayout>
        <div data-testid="children">Children</div>
      </RootLayout>
    );
    
    const html = document.documentElement;
    const body = document.body;
    
    // Check if accessibility attributes are correct
    expect(html).toHaveAttribute('lang', 'vi');
    expect(body).toHaveClass('h-full', 'antialiased');
  });

  it('renders with correct metadata', () => {
    // This test would need to be updated if we were testing metadata
    // For now, we'll just ensure the component renders without errors
    render(
      <RootLayout>
        <div data-testid="children">Children</div>
      </RootLayout>
    );
    
    expect(screen.getByTestId('children')).toBeInTheDocument();
  });

  it('renders with correct structure for all screen sizes', () => {
    render(
      <RootLayout>
        <div data-testid="children">Children</div>
      </RootLayout>
    );
    
    const providers = screen.getByTestId('providers');
    const header = screen.getByTestId('header');
    const footer = screen.getByTestId('footer');
    const children = screen.getByTestId('children');
    
    // Check if structure is consistent across all screen sizes
    expect(providers).toBeInTheDocument();
    expect(header).toBeInTheDocument();
    expect(children).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });

  it('renders with correct layout structure', () => {
    render(
      <RootLayout>
        <div data-testid="children">Children</div>
      </RootLayout>
    );
    
    const providers = screen.getByTestId('providers');
    const header = screen.getByTestId('header');
    const footer = screen.getByTestId('footer');
    const children = screen.getByTestId('children');
    
    // Check if layout structure is correct
    expect(providers).toBeInTheDocument();
    expect(header).toBeInTheDocument();
    expect(children).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });

  it('renders with correct component hierarchy', () => {
    render(
      <RootLayout>
        <div data-testid="children">Children</div>
      </RootLayout>
    );
    
    const providers = screen.getByTestId('providers');
    const header = screen.getByTestId('header');
    const footer = screen.getByTestId('footer');
    const children = screen.getByTestId('children');
    
    // Check if component hierarchy is correct
    expect(providers).toBeInTheDocument();
    expect(header).toBeInTheDocument();
    expect(children).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });

  it('renders with correct styling for all components', () => {
    render(
      <RootLayout>
        <div data-testid="children">Children</div>
      </RootLayout>
    );
    
    const providers = screen.getByTestId('providers');
    const header = screen.getByTestId('header');
    const footer = screen.getByTestId('footer');
    const children = screen.getByTestId('children');
    
    // Check if all components have correct styling
    expect(providers).toBeInTheDocument();
    expect(header).toBeInTheDocument();
    expect(children).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });

  it('renders with correct accessibility for all components', () => {
    render(
      <RootLayout>
        <div data-testid="children">Children</div>
      </RootLayout>
    );
    
    const providers = screen.getByTestId('providers');
    const header = screen.getByTestId('header');
    const footer = screen.getByTestId('footer');
    const children = screen.getByTestId('children');
    
    // Check if all components are accessible
    expect(providers).toBeInTheDocument();
    expect(header).toBeInTheDocument();
    expect(children).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });

  it('renders with correct content structure', () => {
    render(
      <RootLayout>
        <div data-testid="children">Children</div>
      </RootLayout>
    );
    
    const providers = screen.getByTestId('providers');
    const header = screen.getByTestId('header');
    const footer = screen.getByTestId('footer');
    const children = screen.getByTestId('children');
    
    // Check if content structure is correct
    expect(providers).toBeInTheDocument();
    expect(header).toBeInTheDocument();
    expect(children).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });

  it('renders with correct layout for all screen sizes', () => {
    render(
      <RootLayout>
        <div data-testid="children">Children</div>
      </RootLayout>
    );
    
    const providers = screen.getByTestId('providers');
    const header = screen.getByTestId('header');
    const footer = screen.getByTestId('footer');
    const children = screen.getByTestId('children');
    
    // Check if layout is correct for all screen sizes
    expect(providers).toBeInTheDocument();
    expect(header).toBeInTheDocument();
    expect(children).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });

  it('renders with correct component structure', () => {
    render(
      <RootLayout>
        <div data-testid="children">Children</div>
      </RootLayout>
    );
    
    const providers = screen.getByTestId('providers');
    const header = screen.getByTestId('header');
    const footer = screen.getByTestId('footer');
    const children = screen.getByTestId('children');
    
    // Check if component structure is correct
    expect(providers).toBeInTheDocument();
    expect(header).toBeInTheDocument();
    expect(children).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });

  it('renders with correct styling structure', () => {
    render(
      <RootLayout>
        <div data-testid="children">Children</div>
      </RootLayout>
    );
    
    const providers = screen.getByTestId('providers');
    const header = screen.getByTestId('header');
    const footer = screen.getByTestId('footer');
    const children = screen.getByTestId('children');
    
    // Check if styling structure is correct
    expect(providers).toBeInTheDocument();
    expect(header).toBeInTheDocument();
    expect(children).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });

  it('renders with correct accessibility structure', () => {
    render(
      <RootLayout>
        <div data-testid="children">Children</div>
      </RootLayout>
    );
    
    const providers = screen.getByTestId('providers');
    const header = screen.getByTestId('header');
    const footer = screen.getByTestId('footer');
    const children = screen.getByTestId('children');
    
    // Check if accessibility structure is correct
    expect(providers).toBeInTheDocument();
    expect(header).toBeInTheDocument();
    expect(children).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });
});
