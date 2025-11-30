import { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Building,
  TrendingUp,
  PieChart,
  Bell,
  CheckCircle,
  BarChart3,
  DollarSign,
  Users,
  Clock,
  Target,
  RefreshCw,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Solutions for Property Managers - Optimize Portfolio Performance',
  description: 'Axxiom helps property managers optimize portfolio performance with AI-powered valuations, market intelligence, and asset management tools.',
  openGraph: {
    title: 'For Property Managers | Axxiom',
    description: 'Optimize portfolio performance with AI-powered insights.',
  },
};

const benefits = [
  {
    icon: PieChart,
    title: 'Portfolio Analytics',
    description: 'Real-time visibility into your entire portfolio with comprehensive performance metrics.',
  },
  {
    icon: TrendingUp,
    title: 'Value Tracking',
    description: 'Continuous monitoring of property values and market conditions across your portfolio.',
  },
  {
    icon: Bell,
    title: 'Smart Alerts',
    description: 'Automated notifications for market changes, lease expirations, and optimization opportunities.',
  },
  {
    icon: Target,
    title: 'NOI Optimization',
    description: 'AI-powered recommendations to maximize net operating income across properties.',
  },
];

const features = [
  {
    title: 'Portfolio Dashboard',
    description: 'Complete visibility into portfolio performance with real-time valuations and KPIs.',
    items: ['Multi-property views', 'Custom KPI tracking', 'Benchmarking', 'Trend analysis'],
  },
  {
    title: 'Asset Valuation',
    description: 'Continuous property valuations using AI-powered analysis and market data.',
    items: ['Real-time valuations', 'Market comparisons', 'Value-add analysis', 'Disposition timing'],
  },
  {
    title: 'Lease Analytics',
    description: 'Comprehensive lease analysis with expiration tracking and rent optimization.',
    items: ['Lease abstraction', 'Expiration alerts', 'Market rent analysis', 'Renewal strategy'],
  },
  {
    title: 'Investor Reporting',
    description: 'Automated generation of investor-ready reports and presentations.',
    items: ['Customizable templates', 'Scheduled delivery', 'Multiple formats', 'White labeling'],
  },
];

const stats = [
  { value: '12%', label: 'Avg. NOI improvement' },
  { value: '85%', label: 'Time saved on reporting' },
  { value: '$8.5B', label: 'Assets under management' },
  { value: '450+', label: 'Properties monitored' },
];

const testimonial = {
  quote: "Axxiom gives us a real-time view of our entire portfolio that we never had before. The AI-driven insights have helped us identify opportunities we would have missed.",
  author: 'Lisa Chang',
  title: 'VP of Asset Management',
  company: 'Greystar Real Estate Partners',
};

export default function PropertyManagersPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="badge inline-flex mb-6">
                <Building className="w-4 h-4 mr-2" />
                <span>For Property Managers</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Optimize Every{' '}
                <span className="gradient-text">Asset.</span>
              </h1>

              <p className="text-xl text-gray-400 mb-8">
                AI-powered portfolio management that helps you maximize performance,
                track valuations, and deliver exceptional investor returns.
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
                  <h3 className="text-white font-semibold">Portfolio Overview</h3>
                  <span className="badge badge-accent">12 Properties</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-dark-800 rounded-xl p-4">
                    <div className="text-gray-400 text-sm mb-1">Total Value</div>
                    <div className="text-xl font-bold text-white">$142.5M</div>
                    <div className="text-accent-400 text-sm flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +6.2% YTD
                    </div>
                  </div>
                  <div className="bg-dark-800 rounded-xl p-4">
                    <div className="text-gray-400 text-sm mb-1">Annual NOI</div>
                    <div className="text-xl font-bold text-white">$8.7M</div>
                    <div className="text-accent-400 text-sm flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +4.8% YoY
                    </div>
                  </div>
                  <div className="bg-dark-800 rounded-xl p-4">
                    <div className="text-gray-400 text-sm mb-1">Avg. Occupancy</div>
                    <div className="text-xl font-bold text-white">94.2%</div>
                  </div>
                  <div className="bg-dark-800 rounded-xl p-4">
                    <div className="text-gray-400 text-sm mb-1">WALT</div>
                    <div className="text-xl font-bold text-white">4.2 yrs</div>
                  </div>
                </div>

                <div className="bg-dark-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400 text-sm">Asset Performance</span>
                    <RefreshCw className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="flex items-end space-x-2 h-16">
                    {[65, 80, 72, 88, 75, 92, 68, 85, 78, 95, 82, 90].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-primary-600 to-primary-400 rounded-t"
                        style={{ height: `${h}%` }}
                      />
                    ))}
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
              Complete <span className="gradient-text">Portfolio Visibility</span>
            </h2>
            <p className="section-subheading">
              Everything you need to manage and optimize your real estate portfolio.
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
              Built for <span className="gradient-text">Asset Management</span>
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
            Ready to Optimize Your Portfolio?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            See how Axxiom can help you maximize asset performance and deliver better returns.
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
