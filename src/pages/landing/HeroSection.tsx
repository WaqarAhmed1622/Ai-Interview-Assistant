import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronRight, Play, Shield, Zap, Award } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { FadeIn, SlideUp } from '../../components/ui/motion';

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-background">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 blur-[120px] rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-secondary/10 blur-[100px] rounded-full opacity-30"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="max-w-2xl">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-white/10 text-xs font-medium text-primary mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Now with Gemini 1.5 Pro Support
              </div>
            </FadeIn>

            <SlideUp delay={0.1}>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6">
                Ace Every <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  Interview
                </span>
              </h1>
            </SlideUp>

            <SlideUp delay={0.2}>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-lg">
                Your invisible AI copilot for technical interviews. Get real-time transcription,
                smart hints, and coding assistance directly in your browser.
              </p>
            </SlideUp>

            <SlideUp delay={0.3} className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button variant="gradient" size="lg" className="group">
                Start Free Trial
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="group">
                <Play className="w-4 h-4 mr-2" />
                Watch Demo
              </Button>
            </SlideUp>

            <SlideUp delay={0.4} className="flex items-center gap-8 text-sm text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>Undetectable</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span>Zero Latency</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                <span>99% Success</span>
              </div>
            </SlideUp>
          </div>

          {/* Visual Content - 3D Placeholder / Mockup */}
          <motion.div
            style={{ y, opacity }}
            className="hidden lg:block relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative z-10 rounded-2xl border border-white/10 bg-surface/50 backdrop-blur-xl shadow-2xl p-2">
              <div className="rounded-xl overflow-hidden border border-white/5 bg-black/50 aspect-video relative group">
                {/* Simulated UI showing Extension Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3/4 h-3/4 rounded-lg bg-surface/80 border border-white/10 p-6 flex flex-col gap-4 shadow-2xl transform group-hover:scale-105 transition-transform duration-500">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="text-xs text-slate-400">Live Transcript</div>
                    </div>
                    <div className="space-y-3 flex-1">
                      <div className="h-2 w-3/4 bg-white/10 rounded animate-pulse"></div>
                      <div className="h-2 w-1/2 bg-white/10 rounded animate-pulse delay-75"></div>
                      <div className="h-2 w-full bg-white/10 rounded animate-pulse delay-150"></div>
                    </div>
                    <div className="p-3 rounded bg-primary/20 border border-primary/30">
                      <div className="text-xs text-primary mb-1 font-semibold">AI Assistant Hint</div>
                      <div className="text-xs text-slate-300">Here's an optimal approach using dynamic programming...</div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 -right-6 bg-surface border border-white/10 p-4 rounded-xl shadow-xl z-20"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Response Time</div>
                      <div className="text-sm font-bold text-white">120ms</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 20, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-6 -left-6 bg-surface border border-white/10 p-4 rounded-xl shadow-xl z-20"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Privacy Status</div>
                      <div className="text-sm font-bold text-white">Secure</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
