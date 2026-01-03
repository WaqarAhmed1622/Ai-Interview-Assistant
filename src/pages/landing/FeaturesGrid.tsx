import { Mic, Zap, Shield, Monitor, Clock, Database, Code, Globe } from 'lucide-react';
import { Section } from '../../components/ui/Section';
import { Card } from '../../components/ui/Card';
import { FadeIn } from '../../components/ui/motion';

const features = [
  {
    icon: Mic,
    title: 'Real-time Transcription',
    description: 'Instant speech-to-text with sub-second latency using robust Deepgram Nova-2 models.'
  },
  {
    icon: Zap,
    title: 'AI Hint Generation',
    description: 'Context-aware suggestions powered by GPT-4 and Claude 3.5 Sonnet to help you answer smoothly.'
  },
  {
    icon: Code,
    title: 'Live Coding Assist',
    description: 'Paste code snippets or capture screenshots to get instant algorithm optimization tips.'
  },
  {
    icon: Monitor,
    title: 'Universal Compatibility',
    description: 'Works seamlessly on Google Meet, Zoom, Microsoft Teams, and Webex via Chrome Extension.'
  },
  {
    icon: Shield,
    title: 'Undetectable Privacy',
    description: 'Runs discreetly in your browser. Audio is processed ephemerally and never stored.'
  },
  {
    icon: Clock,
    title: 'Zero Latency Sync',
    description: 'WebSocket streaming ensures hints appear instantly as the interviewer speaks.'
  },
  {
    icon: Database,
    title: 'Session History',
    description: 'Review past interviews, analyze performance, and search through transcripts.',
    commingSoon: false,
  },
  {
    icon: Globe,
    title: 'Multi-language Support',
    description: 'Currently optimized for English technical interviews, with more languages coming soon.',
    commingSoon: true,
  }
];

export function FeaturesGrid() {
  return (
    <Section>
      <div className="text-center max-w-3xl mx-auto mb-16">
        <FadeIn>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Everything you need to <span className="text-primary">succeed</span>
          </h2>
          <p className="text-lg text-slate-400">
            Comprehensive tools designed to give you the competitive edge in high-stakes technical interviews.
          </p>
        </FadeIn>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <FadeIn key={index} delay={index * 0.1}>
            <Card hoverEffect className="h-full group hover:bg-surface/80">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </Card>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
