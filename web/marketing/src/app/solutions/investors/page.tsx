import { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  TrendingUp,
  Target,
  Shield,
  LineChart,
  BarChart3,
  Brain,
  Clock,
  DollarSign,
  CheckCircle,
  Building2,
  Zap,
  PieChart,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Solutions for Investors - Maximize ROI with AI',
  description: 'Axxiom helps real estate investors make faster, more confident investment decisions with AI-powered valuations and predictive analytics.',
  openGraph: {
    title: 'For Investors | Axxiom',
    description: 'Maximize ROI with AI-powered investment analysis.',
  },
};

const benefits = [
  {
    icon: TrendingUp,
    title: 'Identify Undervalued Assets',
    description: 'Our AI analyzes thousands of data points to find properties trading below their true value.',
  },
  {
    icon: LineChart,
    title: 'Predict Future Performance',
    description: 'ML-powered forecasting helps you anticipate market shifts and time your investments.',
  },
  {
    icon: Target,
    title: 'Score Deal Quality',
    description: 'Instant deal scoring based on risk, return potential, and market conditions.',
  },
  {
    icon: Clock,
    title: 'Close Faster',
    description: 'Complete due diligence in hours, not weeks. Move quickly on competitive deals.',
  },
];

const features = [
  {
    title: 'Investment Analyzer',
    description: 'Comprehensive IRR, NPV, and cash flow analysis with sensitivity testing and scenario modeling.',
    items: ['Multi-scenario modeling', 'Exit strategy optimization', 'Sensitivity analysis', 'Waterfall distributions'],
  },
  {
    title: 'Market Intelligence',
    description: 'Real-time market data, trends, and forecasts for any market across the country.',
    items: ['Submarket analytics', 'Rent growth projections', 'Cap rate trends', 'Demand indicators'],
  },
  {
    title: 'Portfolio Optimization',
    description: 'AI-driven recommendations to optimize your portfolio allocation and maximize returns.',
    items: ['Risk-adjusted returns', 'Diversification scoring', 'Rebalancing alerts', 'Performance benchmarking'],
  },
  {
    title: 'Automated Reporting',
    description: 'Generate investor-ready reports and presentations with a single click.',
    items: ['Custom branding', 'Multiple formats', 'Scheduled delivery', 'Data room integration'],
  },
];

const stats = [
  { value: '23%', label: 'Average IRR improvement' },
  { value: '80%', label: 'Faster due diligence' },
  { value: '15hrs', label: 'Saved per deal' },
  { value: '$2.1M', label: 'Avg. deal size analyzed' },
];

const testimonial = {
  quote: "Axxiom has completely transformed our acquisition process. We're now able to evaluate twice as many deals with half the team, and our hit rate has improved by 40%.",
  author: 'David Park',
  title: 'Managing Partner',
  company: 'Meridian Capital Partners',
};

export default function InvestorsPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-500/15 rounded-full blur-[80px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="badge inline-flex mb-6">
                <TrendingUp className="w-4 h-4 mr-2" />
                <span>For Investors</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Find Better Deals.{' '}
                <span className="gradient-text">Close Faster.</span>
              </h1>

              <p className="text-xl text-gray-400 mb-8">
                AI-powered investment analysis that helps you identify opportunities,
                quantify risk, and make confident decisions in competitive markets.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/demo" className="btn-primary text-lg px-8 py-4">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link href="/contact" className="btn-secondary text-lg px-8 py-4">
                  Talk to Sales
                </Link>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-accent-500" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-accent-500" />
                  <span>No credit card</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-dark-900 rounded-2xl border border-dark-700 p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-semibold">Deal Analysis</h3>
                  <span className="badge badge-accent">AI Score: 87</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-dark-800 rounded-xl p-4">
                    <div className="text-gray-400 text-sm mb-1">Purchase Price</div>
                    <div className="text-xl font-bold text-white">$18.5M</div>
                  </div>
                  <div className="bg-dark-800 rounded-xl p-4">
                    <div className="text-gray-400 text-sm mb-1">AI Valuation</div>
                    <div className="text-xl font-bold text-accent-400">$21.2M</div>
                  </div>
                  <div className="bg-dark-800 rounded-xl p-4">
                    <div className="text-gray-400 text-sm mb-1">Projected IRR</div>
                    <div className="text-xl font-bold text-white">18.5%</div>
                  </div>
                  <div className="bg-dark-800 rounded-xl p-4">
                    <div className="text-gray-400 text-sm mb-1">Cash on Cash</div>
                    <div className="text-xl font-bold text-white">9.2%</div>
                  </div>
                </div>

                <div className="bg-dark-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Upside Potential</span>
                    <span className="text-accent-400 font-medium">+14.5%</span>
                  </div>
                  <div className="w-full bg-dark-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-dark-900/30 border-y border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading">
              Gain an <span className="gradient-text">Unfair Advantage</span>
            </h2>
            <p className="section-subheading">
              Use AI to see opportunities others miss and move faster than the competition.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="card text-center">
                <div className="w-14 h-14 rounded-xl bg-primary-500/20 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-7 h-7 text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{benefit.title}</h3>
                <p className="text-gray-400 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section bg-dark-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading">
              Purpose-Built for <span className="gradient-text">Investment Teams</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="card">
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.items.map((item) => (
                    <li key={item} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card bg-gradient-to-br from-primary-900/30 to-dark-900 border-primary-500/30 text-center p-12">
            <blockquote className="text-2xl text-white font-medium mb-8 leading-relaxed">
              "{testimonial.quote}"
            </blockquote>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
                {testimonial.author.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="text-left">
                <div className="text-white font-semibold">{testimonial.author}</div>
                <div className="text-gray-400 text-sm">{testimonial.title}</div>
                <div className="text-gray-500 text-sm">{testimonial.company}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-dark-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Investment Process?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Start your free trial and see why leading investment firms trust Axxiom.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/demo" className="btn-primary text-lg px-8 py-4">
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/contact" className="btn-secondary text-lg px-8 py-4">
              Schedule Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
