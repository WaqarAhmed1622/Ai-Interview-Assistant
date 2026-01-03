import { Section } from '../../components/ui/Section';
import { FadeIn, StaggerContainer, StaggerItem } from '../../components/ui/motion';
import { Chrome, Video, Mic, Sparkles } from 'lucide-react';

const steps = [
  {
    id: 1,
    icon: Chrome,
    title: 'Install Extension',
    description: 'Add our secure extension to Chrome in one click. Pin it for easy access during interviews.'
  },
  {
    id: 2,
    icon: Video,
    title: 'Join Interview',
    description: 'Hop on your Google Meet, Zoom, or Teams call. The extension automatically detects the session.'
  },
  {
    id: 3,
    icon: Mic,
    title: 'AI Listens',
    description: 'Our system transcribes the conversation in real-time with high accuracy, capturing every detail.'
  },
  {
    id: 4,
    icon: Sparkles,
    title: 'Get Answers',
    description: 'Receive instant, context-aware hints and code snippets on your dashboard without leaving the tab.'
  }
];

export function HowItWorksSection() {
  return (
    <Section className="bg-surface/30 border-y border-white/5">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <FadeIn>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Effortless integration
          </h2>
          <p className="text-lg text-slate-400">
            Works silently in the background so you can focus on delivering the perfect answer.
          </p>
        </FadeIn>
      </div>

      <StaggerContainer className="grid md:grid-cols-4 gap-8 relative">
        {/* Connecting Line (Desktop) */}
        <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 z-0"></div>

        {steps.map((step, index) => (
          <StaggerItem key={index} className="relative z-10 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-2xl bg-surface border border-white/10 flex items-center justify-center mb-6 shadow-xl group hover:border-primary/50 transition-colors duration-300 relative">
              <div className="absolute inset-0 bg-primary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <step.icon className="w-10 h-10 text-white group-hover:text-primary transition-colors" />
              <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm border-4 border-background">
                {step.id}
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
            <p className="text-slate-400 text-sm">{step.description}</p>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </Section>
  );
}
