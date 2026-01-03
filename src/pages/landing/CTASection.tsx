import { ChevronRight } from 'lucide-react';
import { Section } from '../../components/ui/Section';
import { Button } from '../../components/ui/Button';
import { FadeIn } from '../../components/ui/motion';

export function CTASection() {
  return (
    <Section className="py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <FadeIn>
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary to-secondary p-12 md:p-20 text-center">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20 mix-blend-overlay"></div>
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-black/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Ready to ace your next interview?
              </h2>
              <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed">
                Join thousands of software engineers who have already secured their dream jobs using Interview Copilot.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="bg-white text-primary hover:bg-slate-100 min-w-[200px] shadow-xl">
                  Get Started for Free
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 min-w-[200px]">
                  View Pricing
                </Button>
              </div>
              
              <p className="mt-6 text-sm text-white/60">
                No credit card required. Cancel anytime.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </Section>
  );
}
