import { render, screen } from '@testing-library/react'
import HomePage from '../page'

// Mock the components that might cause issues
jest.mock('@/components/home/HeroSection', () => {
  return function MockHeroSection() {
    return <div data-testid="hero-section">Hero Section</div>
  }
})

jest.mock('@/components/home/IntroSection', () => {
  return function MockIntroSection() {
    return <div data-testid="intro-section">Intro Section</div>
  }
})

jest.mock('@/components/home/MainFeaturesSection', () => {
  return function MockMainFeaturesSection() {
    return <div data-testid="main-features-section">Main Features Section</div>
  }
})

jest.mock('@/components/home/StatsSection', () => {
  return function MockStatsSection() {
    return <div data-testid="stats-section">Stats Section</div>
  }
})

jest.mock('@/components/home/CategoriesSection', () => {
  return function MockCategoriesSection() {
    return <div data-testid="categories-section">Categories Section</div>
  }
})

jest.mock('@/components/home/FeaturedTechnologies', () => {
  return function MockFeaturedTechnologies() {
    return <div data-testid="featured-technologies">Featured Technologies</div>
  }
})

jest.mock('@/components/home/SupplyDemandSection', () => {
  return function MockSupplyDemandSection() {
    return <div data-testid="supply-demand-section">Supply Demand Section</div>
  }
})

jest.mock('@/components/home/NewsEventsSection', () => {
  return function MockNewsEventsSection() {
    return <div data-testid="news-events-section">News Events Section</div>
  }
})

jest.mock('@/components/home/TestimonialsSection', () => {
  return function MockTestimonialsSection() {
    return <div data-testid="testimonials-section">Testimonials Section</div>
  }
})

jest.mock('@/components/home/PartnersSection', () => {
  return function MockPartnersSection() {
    return <div data-testid="partners-section">Partners Section</div>
  }
})

jest.mock('@/components/home/HowItWorksSection', () => {
  return function MockHowItWorksSection() {
    return <div data-testid="how-it-works-section">How It Works Section</div>
  }
})

jest.mock('@/components/home/CTASection', () => {
  return function MockCTASection() {
    return <div data-testid="cta-section">CTA Section</div>
  }
})

describe('HomePage', () => {
  it('renders without crashing', () => {
    render(<HomePage />)
    expect(screen.getByTestId('hero-section')).toBeInTheDocument()
  })

  it('renders all main sections', () => {
    render(<HomePage />)
    
    expect(screen.getByTestId('hero-section')).toBeInTheDocument()
    expect(screen.getByTestId('intro-section')).toBeInTheDocument()
    expect(screen.getByTestId('main-features-section')).toBeInTheDocument()
    expect(screen.getByTestId('stats-section')).toBeInTheDocument()
    expect(screen.getByTestId('categories-section')).toBeInTheDocument()
    expect(screen.getByTestId('featured-technologies')).toBeInTheDocument()
    expect(screen.getByTestId('supply-demand-section')).toBeInTheDocument()
    expect(screen.getByTestId('news-events-section')).toBeInTheDocument()
    expect(screen.getByTestId('testimonials-section')).toBeInTheDocument()
    expect(screen.getByTestId('partners-section')).toBeInTheDocument()
    expect(screen.getByTestId('how-it-works-section')).toBeInTheDocument()
    expect(screen.getByTestId('cta-section')).toBeInTheDocument()
  })
})
