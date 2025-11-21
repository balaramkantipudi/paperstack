'use client'

// Import your beautiful HeroUI components  
import HeroSection from '@/components/hero-section.tsx';
import SocialProofBar from '@/components/social-proof-bar.tsx';
import FeaturesSection from '@/components/features-section.tsx';
import ProductShowcase from '@/components/product-showcase.tsx';
import HowItWorks from '@/components/how-it-works.tsx';
// import TestimonialSection from '@/components/testimonial-section'
import PricingSection from '@/components/pricing-section'
import Header from '@/components/header'
import FinalCta from '@/components/final-cta'
import Footer from '@/components/footer'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <SocialProofBar />
        <FeaturesSection />
        <ProductShowcase />
        <HowItWorks />
        <PricingSection />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}
