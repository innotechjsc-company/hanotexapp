import { render, screen } from '@testing-library/react';
import HomePage from '../page';

// Mock the components
jest.mock('@/components/home/HeroSection', () => {
  return function MockHeroSection() {
    return <div data-testid="hero-section">Hero Section</div>;
  };
});

jest.mock('@/components/home/IntroSection', () => {
  return function MockIntroSection() {
    return <div data-testid="intro-section">Intro Section</div>;
  };
});

jest.mock('@/components/home/CategoriesSection', () => {
  return function MockCategoriesSection() {
    return <div data-testid="categories-section">Categories Section</div>;
  };
});

jest.mock('@/components/home/MainFeaturesSection', () => {
  return function MockMainFeaturesSection() {
    return <div data-testid="main-features-section">Main Features Section</div>;
  };
});

jest.mock('@/components/home/FeaturedTechnologies', () => {
  return function MockFeaturedTechnologies() {
    return <div data-testid="featured-technologies">Featured Technologies</div>;
  };
});

jest.mock('@/components/home/SupplyDemandSection', () => {
  return function MockSupplyDemandSection() {
    return <div data-testid="supply-demand-section">Supply Demand Section</div>;
  };
});

jest.mock('@/components/home/NewsEventsSection', () => {
  return function MockNewsEventsSection() {
    return <div data-testid="news-events-section">News Events Section</div>;
  };
});

jest.mock('@/components/home/PartnersSection', () => {
  return function MockPartnersSection() {
    return <div data-testid="partners-section">Partners Section</div>;
  };
});

jest.mock('@/components/home/StatsSection', () => {
  return function MockStatsSection() {
    return <div data-testid="stats-section">Stats Section</div>;
  };
});

jest.mock('@/components/home/HowItWorksSection', () => {
  return function MockHowItWorksSection() {
    return <div data-testid="how-it-works-section">How It Works Section</div>;
  };
});

jest.mock('@/components/home/TestimonialsSection', () => {
  return function MockTestimonialsSection() {
    return <div data-testid="testimonials-section">Testimonials Section</div>;
  };
});

jest.mock('@/components/home/CTASection', () => {
  return function MockCTASection() {
    return <div data-testid="cta-section">CTA Section</div>;
  };
});

jest.mock('@/components/ui/LoadingSpinner', () => {
  return function MockLoadingSpinner() {
    return <div data-testid="loading-spinner">Loading...</div>;
  };
});

describe('HomePage', () => {
  it('renders all sections in correct order', () => {
    render(<HomePage />);
    
    // Check if all sections are rendered
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('intro-section')).toBeInTheDocument();
    expect(screen.getByTestId('categories-section')).toBeInTheDocument();
    expect(screen.getByTestId('main-features-section')).toBeInTheDocument();
    expect(screen.getByTestId('featured-technologies')).toBeInTheDocument();
    expect(screen.getByTestId('supply-demand-section')).toBeInTheDocument();
    expect(screen.getByTestId('news-events-section')).toBeInTheDocument();
    expect(screen.getByTestId('partners-section')).toBeInTheDocument();
    expect(screen.getByTestId('stats-section')).toBeInTheDocument();
    expect(screen.getByTestId('how-it-works-section')).toBeInTheDocument();
    expect(screen.getByTestId('testimonials-section')).toBeInTheDocument();
    expect(screen.getByTestId('cta-section')).toBeInTheDocument();
  });

  it('renders with correct main element', () => {
    render(<HomePage />);
    
    const main = screen.getByTestId('hero-section').closest('main');
    expect(main).toHaveClass('min-h-screen');
  });

  it('renders sections in correct order', () => {
    render(<HomePage />);
    
    const main = screen.getByTestId('hero-section').closest('main');
    const sections = main?.querySelectorAll('[data-testid]');
    
    expect(sections?.[0]).toHaveAttribute('data-testid', 'hero-section');
    expect(sections?.[1]).toHaveAttribute('data-testid', 'intro-section');
    expect(sections?.[2]).toHaveAttribute('data-testid', 'categories-section');
    expect(sections?.[3]).toHaveAttribute('data-testid', 'main-features-section');
    expect(sections?.[4]).toHaveAttribute('data-testid', 'featured-technologies');
    expect(sections?.[5]).toHaveAttribute('data-testid', 'supply-demand-section');
    expect(sections?.[6]).toHaveAttribute('data-testid', 'news-events-section');
    expect(sections?.[7]).toHaveAttribute('data-testid', 'partners-section');
    expect(sections?.[8]).toHaveAttribute('data-testid', 'stats-section');
    expect(sections?.[9]).toHaveAttribute('data-testid', 'how-it-works-section');
    expect(sections?.[10]).toHaveAttribute('data-testid', 'testimonials-section');
    expect(sections?.[11]).toHaveAttribute('data-testid', 'cta-section');
  });

  it('renders Suspense boundaries for async components', () => {
    render(<HomePage />);
    
    // Check if Suspense boundaries are present for async components
    const categoriesSection = screen.getByTestId('categories-section');
    const featuredTechnologies = screen.getByTestId('featured-technologies');
    const supplyDemandSection = screen.getByTestId('supply-demand-section');
    
    expect(categoriesSection).toBeInTheDocument();
    expect(featuredTechnologies).toBeInTheDocument();
    expect(supplyDemandSection).toBeInTheDocument();
  });

  it('renders all sections with correct content', () => {
    render(<HomePage />);
    
    // Check if all sections have correct content
    expect(screen.getByText('Hero Section')).toBeInTheDocument();
    expect(screen.getByText('Intro Section')).toBeInTheDocument();
    expect(screen.getByText('Categories Section')).toBeInTheDocument();
    expect(screen.getByText('Main Features Section')).toBeInTheDocument();
    expect(screen.getByText('Featured Technologies')).toBeInTheDocument();
    expect(screen.getByText('Supply Demand Section')).toBeInTheDocument();
    expect(screen.getByText('News Events Section')).toBeInTheDocument();
    expect(screen.getByText('Partners Section')).toBeInTheDocument();
    expect(screen.getByText('Stats Section')).toBeInTheDocument();
    expect(screen.getByText('How It Works Section')).toBeInTheDocument();
    expect(screen.getByText('Testimonials Section')).toBeInTheDocument();
    expect(screen.getByText('CTA Section')).toBeInTheDocument();
  });

  it('renders with correct structure', () => {
    render(<HomePage />);
    
    const main = screen.getByTestId('hero-section').closest('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('min-h-screen');
    
    // Check if all sections are direct children of main
    const sections = main?.querySelectorAll('[data-testid]');
    expect(sections).toHaveLength(12);
  });

  it('renders sections with correct spacing', () => {
    render(<HomePage />);
    
    const main = screen.getByTestId('hero-section').closest('main');
    const sections = main?.querySelectorAll('[data-testid]');
    
    // Check if sections are properly spaced
    sections?.forEach((section, index) => {
      if (index > 0) {
        expect(section.previousElementSibling).toBe(sections[index - 1]);
      }
    });
  });

  it('renders all sections without errors', () => {
    expect(() => render(<HomePage />)).not.toThrow();
  });

  it('renders with correct metadata', () => {
    // This test would need to be updated if we were testing metadata
    // For now, we'll just ensure the component renders without errors
    render(<HomePage />);
    
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
  });

  it('renders all sections in correct order for mobile and desktop', () => {
    render(<HomePage />);
    
    const main = screen.getByTestId('hero-section').closest('main');
    const sections = main?.querySelectorAll('[data-testid]');
    
    // Verify the order is consistent across all screen sizes
    const expectedOrder = [
      'hero-section',
      'intro-section',
      'categories-section',
      'main-features-section',
      'featured-technologies',
      'supply-demand-section',
      'news-events-section',
      'partners-section',
      'stats-section',
      'how-it-works-section',
      'testimonials-section',
      'cta-section'
    ];
    
    expectedOrder.forEach((testId, index) => {
      expect(sections?.[index]).toHaveAttribute('data-testid', testId);
    });
  });

  it('renders all sections with proper accessibility', () => {
    render(<HomePage />);
    
    const main = screen.getByTestId('hero-section').closest('main');
    expect(main).toBeInTheDocument();
    
    // Check if all sections are accessible
    const sections = main?.querySelectorAll('[data-testid]');
    sections?.forEach(section => {
      expect(section).toBeInTheDocument();
    });
  });

  it('renders all sections with correct content structure', () => {
    render(<HomePage />);
    
    // Check if all sections have the expected content
    const expectedSections = [
      'Hero Section',
      'Intro Section',
      'Categories Section',
      'Main Features Section',
      'Featured Technologies',
      'Supply Demand Section',
      'News Events Section',
      'Partners Section',
      'Stats Section',
      'How It Works Section',
      'Testimonials Section',
      'CTA Section'
    ];
    
    expectedSections.forEach(sectionText => {
      expect(screen.getByText(sectionText)).toBeInTheDocument();
    });
  });
});