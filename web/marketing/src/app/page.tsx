import Link from 'next/link';
import {
  ArrowRight,
  Play,
  Check,
  Brain,
  BarChart3,
  Building2,
  Shield,
  Zap,
  LineChart,
  FileText,
  Eye,
  MapPin,
  TrendingUp,
  Users,
  Globe,
  Clock,
  Star,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

const stats = [
  { value: '$47B+', label: 'Properties Valued' },
  { value: '98.5%', label: 'Accuracy Rate' },
  { value: '2,500+', label: 'Enterprise Clients' },
  { value: '15min', label: 'Average Analysis Time' },
];

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Valuation',
    description: 'Multi-model AI analysis using income, sales comparison, and cost approaches for institutional-grade accuracy.',
    color: 'from-primary-500 to-primary-600',
  },
  {
    icon: Eye,
    title: 'Computer Vision',
    description: 'Analyze property images to assess condition, detect features, and identify renovation opportunities.',
    color: 'from-accent-500 to-accent-600',
  },
  {
    icon: FileText,
    title: 'Document Intelligence',
    description: 'Extract data from leases, appraisals, and financials with 99% accuracy using advanced OCR.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: LineChart,
    title: 'Predictive Analytics',
    description: 'Forecast market trends, property values, and investment returns with ML-powered predictions.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: MapPin,
    title: '3D Property Mapping',
    description: 'Interactive 3D visualization with Google Maps integration for spatial analysis and comparables.',
    color: 'from-rose-500 to-rose-600',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'SOC 2 Type II certified with end-to-end encryption, GDPR compliance, and audit logging.',
    color: 'from-emerald-500 to-emerald-600',
  },
];

const testimonials = [
  {
    quote: "Axxiom has transformed how we approach property valuations. The AI accuracy is remarkable, and it's cut our analysis time by 80%.",
    author: 'Sarah Chen',
    title: 'Chief Investment Officer',
    company: 'Blackstone Real Estate',
    image: '/images/testimonials/sarah.jpg',
    rating: 5,
  },
  {
    quote: "The most sophisticated CRE platform we've used. The predictive analytics have given us a significant edge in competitive markets.",
    author: 'Michael Torres',
    title: 'Managing Director',
    company: 'CBRE Investment Management',
    image: '/images/testimonials/michael.jpg',
    rating: 5,
  },
  {
    quote: "As a county assessor, Axxiom has revolutionized our mass appraisal process. Defense-ready valuations with unprecedented accuracy.",
    author: 'Jennifer Williams',
    title: 'Chief Appraiser',
    company: 'Harris County Appraisal District',
    image: '/images/testimonials/jennifer.jpg',
    rating: 5,
  },
];

const logos = [
  'Blackstone', 'CBRE', 'JLL', 'Cushman & Wakefield', 'Brookfield', 'Prologis',
  'Boston Properties', 'Equity Residential', 'AvalonBay', 'Digital Realty'
];

const pricingPlans = [
  {
    name: 'Starter',
    description: 'For individual analysts and small teams',
    price: 299,
    features: [
      '50 valuations per month',
      'Basic AI analysis',
      'Market comparables',
      'PDF reports',
      'Email support',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Professional',
    description: 'For growing investment firms',
    price: 799,
    features: [
      '250 valuations per month',
      'Advanced AI models',
      'Document intelligence',
      'Computer vision analysis',
      'API access',
      'Priority support',
      'Custom branding',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    description: 'For large organizations',
    price: null,
    features: [
      'Unlimited valuations',
      'Custom ML models',
      'Full platform access',
      'Dedicated success manager',
      'SLA guarantee',
      'On-premise deployment',
      'SSO & advanced security',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[100px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-500/15 rounded-full blur-[80px] animate-pulse-slow animate-delay-500" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 badge mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Powered by Google Gemini AI</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                The Future of{' '}
                <span className="gradient-text">Commercial Real Estate</span>{' '}
                Valuation
              </h1>

              <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0">
                AI-powered valuations, predictive analytics, and market intelligence
                that give you an unfair advantage in commercial real estate.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
                <Link href="/demo" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link href="/demo-video" className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Link>
              </div>

              <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-accent-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-accent-500" />
                  <span>14-day free trial</span>
                </div>
              </div>
            </div>

            {/* Right Column - Dashboard Preview */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary-500/10 border border-dark-700/50">
                {/* Browser Chrome */}
                <div className="bg-dark-800 px-4 py-3 flex items-center space-x-2">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="bg-dark-900 rounded-lg px-4 py-1 text-sm text-gray-400">
                      app.axxiom.io
                    </div>
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="bg-dark-900 p-6">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-dark-800 rounded-xl p-4">
                      <div className="text-gray-400 text-sm mb-1">Property Value</div>
                      <div className="text-2xl font-bold text-white">$12.5M</div>
                      <div className="text-accent-400 text-sm flex items-center mt-1">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        +8.3%
                      </div>
                    </div>
                    <div className="bg-dark-800 rounded-xl p-4">
                      <div className="text-gray-400 text-sm mb-1">Cap Rate</div>
                      <div className="text-2xl font-bold text-white">6.2%</div>
                      <div className="text-gray-400 text-sm mt-1">Market: 6.5%</div>
                    </div>
                    <div className="bg-dark-800 rounded-xl p-4">
                      <div className="text-gray-400 text-sm mb-1">AI Confidence</div>
                      <div className="text-2xl font-bold text-white">94%</div>
                      <div className="text-primary-400 text-sm mt-1">High accuracy</div>
                    </div>
                  </div>

                  <div className="bg-dark-800 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white font-medium">Valuation Analysis</span>
                      <span className="badge">AI Generated</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Income Approach</span>
                        <span className="text-white">$12.8M</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Sales Comparison</span>
                        <span className="text-white">$12.2M</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Cost Approach</span>
                        <span className="text-white">$12.4M</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-32 bg-dark-800 rounded-xl flex items-center justify-center">
                    <div className="flex items-end space-x-2 h-20">
                      {[40, 65, 45, 80, 55, 70, 90, 75, 85, 95, 88, 92].map((h, i) => (
                        <div
                          key={i}
                          className="w-4 bg-gradient-to-t from-primary-600 to-primary-400 rounded-t"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-dark-800 rounded-xl p-4 shadow-xl border border-dark-700 animate-float">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-accent-500/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-accent-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium">Analysis Complete</div>
                    <div className="text-gray-400 text-sm">Just now</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-dark-800 rounded-xl p-4 shadow-xl border border-dark-700 animate-float animate-delay-300">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium">15 Comps Found</div>
                    <div className="text-gray-400 text-sm">Within 2 miles</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <section className="py-16 border-y border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm uppercase tracking-wider mb-8">
            Trusted by Industry Leaders
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {logos.map((logo) => (
              <div key={logo} className="text-gray-500 text-lg font-semibold hover:text-gray-400 transition-colors">
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-dark-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="badge inline-flex mb-4">
              <span>Platform Features</span>
            </div>
            <h2 className="section-heading">
              Everything You Need for{' '}
              <span className="gradient-text">Smarter Decisions</span>
            </h2>
            <p className="section-subheading">
              Our comprehensive suite of AI-powered tools gives you the edge in every aspect of
              commercial real estate valuation and analysis.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="card group hover:scale-[1.02] transition-transform duration-300">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/features" className="btn-secondary">
              Explore All Features
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* AI Showcase Section */}
      <section className="section bg-gradient-to-b from-dark-950 via-dark-900/50 to-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="badge inline-flex mb-4">
                <Sparkles className="w-4 h-4 mr-2" />
                <span>AI-Powered</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Valuations That Defend Themselves
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Our multi-model AI approach combines income, sales comparison, and cost methods
                with machine learning to deliver valuations that stand up to the most rigorous scrutiny.
              </p>

              <div className="space-y-6">
                {[
                  { icon: Brain, title: 'Multi-Model Analysis', desc: 'Three valuation approaches analyzed simultaneously' },
                  { icon: BarChart3, title: 'Confidence Scoring', desc: 'Know exactly how reliable each valuation is' },
                  { icon: FileText, title: 'Audit-Ready Reports', desc: 'Comprehensive documentation for every decision' },
                  { icon: Shield, title: 'Appeal Defense', desc: 'Built-in support for assessment challenges' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">{item.title}</h4>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/features" className="btn-primary mt-8 inline-flex">
                Learn More
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>

            <div className="relative">
              <div className="bg-dark-900 rounded-2xl border border-dark-700 p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-semibold">AI Valuation Summary</h3>
                  <span className="badge badge-accent">98% Confidence</span>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="bg-dark-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">Income Approach</span>
                      <span className="text-white font-semibold">$24,500,000</span>
                    </div>
                    <div className="w-full bg-dark-700 rounded-full h-2">
                      <div className="bg-primary-500 h-2 rounded-full" style={{ width: '95%' }} />
                    </div>
                  </div>

                  <div className="bg-dark-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">Sales Comparison</span>
                      <span className="text-white font-semibold">$23,800,000</span>
                    </div>
                    <div className="w-full bg-dark-700 rounded-full h-2">
                      <div className="bg-accent-500 h-2 rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>

                  <div className="bg-dark-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">Cost Approach</span>
                      <span className="text-white font-semibold">$25,100,000</span>
                    </div>
                    <div className="w-full bg-dark-700 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '88%' }} />
                    </div>
                  </div>
                </div>

                <div className="border-t border-dark-700 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Reconciled Value</span>
                    <span className="text-2xl font-bold gradient-text">$24,200,000</span>
                  </div>
                </div>
              </div>

              <div className="absolute -z-10 inset-0 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-2xl blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="badge inline-flex mb-4">
              <Star className="w-4 h-4 mr-2" />
              <span>Customer Success</span>
            </div>
            <h2 className="section-heading">
              Loved by Industry <span className="gradient-text">Leaders</span>
            </h2>
            <p className="section-subheading">
              See why the world's leading real estate professionals choose Axxiom.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.author} className="card">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <blockquote className="text-gray-300 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-white font-medium">{testimonial.author}</div>
                    <div className="text-gray-400 text-sm">{testimonial.title}</div>
                    <div className="text-gray-500 text-sm">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="section bg-dark-900/30" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="badge inline-flex mb-4">
              <span>Simple Pricing</span>
            </div>
            <h2 className="section-heading">
              Plans That <span className="gradient-text">Scale</span> With You
            </h2>
            <p className="section-subheading">
              Start free, upgrade when you're ready. No hidden fees, cancel anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`card relative ${plan.popular ? 'border-primary-500 ring-2 ring-primary-500/20' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary-500 text-white text-sm font-medium px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm">{plan.description}</p>
                </div>

                <div className="text-center mb-6">
                  {plan.price !== null ? (
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-white">${plan.price}</span>
                      <span className="text-gray-400 ml-2">/month</span>
                    </div>
                  ) : (
                    <div className="text-4xl font-bold text-white">Custom</div>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.price !== null ? '/demo' : '/contact'}
                  className={`w-full text-center ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/pricing" className="text-primary-400 hover:text-primary-300 font-medium inline-flex items-center">
              View full pricing details
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-dark-900" />
            <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-20" />

            <div className="relative px-8 py-16 md:px-16 md:py-24 text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Transform Your CRE Analysis?
              </h2>
              <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
                Join 2,500+ firms using Axxiom to make faster, smarter real estate decisions.
                Start your free trial today.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/demo" className="bg-white text-primary-700 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-200 inline-flex items-center">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link href="/contact" className="text-white border-2 border-white/30 hover:border-white/60 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 inline-flex items-center">
                  Talk to Sales
                  <ArrowUpRight className="w-5 h-5 ml-2" />
                </Link>
              </div>

              <div className="mt-10 flex items-center justify-center space-x-8 text-primary-200 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Onboarding included</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
