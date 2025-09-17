'use client';

import { Suspense } from 'react';
import HeroSection from '@/components/home/HeroSection';
import IntroSection from '@/components/home/IntroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import MainFeaturesSection from '@/components/home/MainFeaturesSection';
import FeaturedTechnologies from '@/components/home/FeaturedTechnologies';
import SupplyDemandSection from '@/components/home/SupplyDemandSection';
import NewsEventsSection from '@/components/home/NewsEventsSection';
import PartnersSection from '@/components/home/PartnersSection';
import StatsSection from '@/components/home/StatsSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/home/CTASection';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Metadata moved to layout.tsx since this is now a client component

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Intro Section */}
      <IntroSection />
      
      {/* Categories Section */}
      <Suspense fallback={<LoadingSpinner />}>
        <CategoriesSection />
      </Suspense>
      
      {/* Main Features Section */}
      <MainFeaturesSection />
      
      {/* Featured Technologies */}
      <Suspense fallback={<LoadingSpinner />}>
        <FeaturedTechnologies />
      </Suspense>
      
      {/* Supply-Demand Section */}
      <Suspense fallback={<LoadingSpinner />}>
        <SupplyDemandSection />
      </Suspense>
      
      {/* News & Events Section */}
      <NewsEventsSection />
      
      {/* Partners Section */}
      <PartnersSection />
      
      {/* Stats Section */}
      <StatsSection />
      
      {/* How It Works Section */}
      <HowItWorksSection />
      
      {/* Testimonials Section */}
      <TestimonialsSection />
      
      {/* CTA Section */}
      <CTASection />
    </main>
  );
}

