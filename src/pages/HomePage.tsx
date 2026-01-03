import { HeroSection } from './landing/HeroSection';
import { SocialProofSection } from './landing/SocialProofSection';
import { FeaturesGrid } from './landing/FeaturesGrid';
import { HowItWorksSection } from './landing/HowItWorksSection';
import { PricingTeaser } from './landing/PricingTeaser';
import { CTASection } from './landing/CTASection';

import { SEO } from '../components/SEO';

export function HomePage() {
  return (
    <div className="bg-background min-h-screen text-slate-200 selection:bg-primary/30">
      <SEO 
        title="AI Interview Copilot - Ace Technical Interviews" 
        description="Your invisible AI assistant for technical interviews. Get real-time transcription, smart hints, and coding assistance directly in your browser."
      />
      <HeroSection />
      <SocialProofSection />
      <FeaturesGrid />
      <HowItWorksSection />
      <PricingTeaser />
      <CTASection />
    </div>
  );
}
