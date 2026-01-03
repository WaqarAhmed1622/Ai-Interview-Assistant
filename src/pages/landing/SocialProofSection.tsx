import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { Section } from '../../components/ui/Section';
import { Card } from '../../components/ui/Card';
import { StaggerContainer, StaggerItem } from '../../components/ui/motion';

const stats = [
  { label: 'Active Users', value: 10000, suffix: '+' },
  { label: 'Interviews Aced', value: 50000, suffix: '+' },
  { label: 'Success Rate', value: 98, suffix: '%' },
  { label: 'Supported Platforms', value: 8, suffix: '' },
];

const companies = [
  'Google', 'Meta', 'Amazon', 'Netflix', 'Microsoft', 'Uber', 'Airbnb', 'Stripe'
];

export function SocialProofSection() {
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true
  });

  return (
    <Section className="bg-surface/30 border-y border-white/5">
      {/* Client Logos Ticker */}
      <div className="mb-16 text-center">
        <p className="text-sm font-medium text-slate-500 mb-8 uppercase tracking-wider">Trusted by candidates interviewing at</p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          {companies.map((company) => (
            <span key={company} className="text-xl font-bold text-slate-300">{company}</span>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div ref={ref}>
        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StaggerItem key={index}>
              <Card className="text-center p-8 bg-surface/50 border-white/5 hover:border-primary/50 transition-colors">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 font-mono">
                  {inView ? (
                    <CountUp end={stat.value} duration={2.5} separator="," suffix={stat.suffix} />
                  ) : '0'}
                </div>
                <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </Section>
  );
}
