import { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Scale,
  FileText,
  Shield,
  Clock,
  CheckCircle,
  Building2,
  BarChart3,
  Users,
  AlertTriangle,
  Layers,
  Database,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Solutions for Assessors - Defensible Mass Appraisal',
  description: 'Axxiom helps property assessors and appraisal districts deliver accurate, defensible valuations at scale with AI-powered analysis.',
  openGraph: {
    title: 'For Assessors | Axxiom',
    description: 'Defensible mass appraisal with AI-powered analysis.',
  },
};

const benefits = [
  {
    icon: Scale,
    title: 'Defense-Ready Valuations',
    description: 'Every valuation comes with complete documentation and audit trails for appeal defense.',
  },
  {
    icon: BarChart3,
    title: 'Mass Appraisal at Scale',
    description: 'Process thousands of properties with consistent methodology and accuracy.',
  },
  {
    icon: Shield,
    title: 'USPAP Compliant',
    description: 'Built-in compliance with Uniform Standards of Professional Appraisal Practice.',
  },
  {
    icon: Clock,
    title: 'Reduce Appeal Burden',
    description: 'Accurate initial valuations mean fewer appeals and faster resolution when they occur.',
  },
];

const features = [
  {
    title: 'Automated Mass Appraisal',
    description: 'Process entire jurisdictions with AI-powered valuation models calibrated to your market.',
    items: ['Jurisdiction-wide processing', 'Automated model calibration', 'Quality control checks', 'Ratio analysis'],
  },
  {
    title: 'Appeal Management',
    description: 'Streamlined workflow for handling appeals with AI-assisted evidence gathering.',
    items: ['Case management', 'Evidence compilation', 'Comparable analysis', 'Settlement recommendations'],
  },
  {
    title: 'Market Analysis',
    description: 'Comprehensive market studies and neighborhood analysis to support valuations.',
    items: ['Time adjustments', 'Neighborhood delineation', 'Trend analysis', 'Economic factors'],
  },
  {
    title: 'Compliance & Reporting',
    description: 'Generate required reports and maintain compliance with state and local regulations.',
    items: ['State compliance reports', 'Ratio studies', 'Audit documentation', 'Public disclosure'],
  },
];

const stats = [
  { value: '42%', label: 'Reduction in appeals' },
  { value: '98.5%', label: 'Assessment accuracy' },
  { value: '70%', label: 'Time savings' },
  { value: '3.2M', label: 'Parcels assessed' },
];

const testimonial = {
  quote: "Axxiom has revolutionized how we approach mass appraisal. Our assessment accuracy has improved dramatically, and we've seen a 40% reduction in successful appeals.",
  author: 'Robert Martinez',
  title: 'Chief Appraiser',
  company: 'Maricopa County Assessor\'s Office',
};

export default function AssessorsPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="badge inline-flex mb-6">
                <Scale className="w-4 h-4 mr-2" />
                <span>For Assessors</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Accurate. Defensible.{' '}
                <span className="gradient-text">Efficient.</span>
              </h1>

              <p className="text-xl text-gray-400 mb-8">
                AI-powered mass appraisal that delivers consistent, accurate valuations
                with the documentation you need to defend every assessment.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/demo" className="btn-primary text-lg px-8 py-4">
                  Request Demo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link href="/contact" className="btn-secondary text-lg px-8 py-4">
                  Contact Sales
                </Link>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-accent-500" />
                  <span>USPAP compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-accent-500" />
                  <span>IAAO standards</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-dark-900 rounded-2xl border border-dark-700 p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-semibold">Assessment Analysis</h3>
                  <span className="badge">USPAP Compliant</span>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="bg-dark-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">Market Value</span>
                      <span className="text-white font-semibold">$485,000</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Confidence</span>
                      <span className="text-accent-400">96%</span>
                    </div>
                  </div>

                  <div className="bg-dark-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-400 text-sm">Valuation Approaches</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Sales Comparison</span>
                        <span className="text-white">$492,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Cost Approach</span>
                        <span className="text-white">$478,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Income Approach</span>
                        <span className="text-white">$485,000</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-dark-800 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Appeal Risk</span>
                      <span className="text-accent-400 font-medium">Low</span>
                    </div>
                    <div className="w-full bg-dark-700 rounded-full h-2 mt-2">
                      <div className="bg-accent-500 h-2 rounded-full" style={{ width: '15%' }} />
                    </div>
                  </div>
                </div>

                <button className="btn-secondary w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Defense Package
                </button>
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
              Built for <span className="gradient-text">Assessment Professionals</span>
            </h2>
            <p className="section-subheading">
              The tools you need to deliver accurate assessments and defend them with confidence.
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
              Complete <span className="gradient-text">Assessment Toolkit</span>
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

      {/* Compliance Section */}
      <section className="section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Compliance You Can Trust
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Axxiom is built from the ground up to meet the exacting standards of
                property assessment professionals and regulatory bodies.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">USPAP Compliant</h4>
                    <p className="text-gray-400 text-sm">Full compliance with Uniform Standards of Professional Appraisal Practice</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-accent-500/20 flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-5 h-5 text-accent-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">IAAO Standards</h4>
                    <p className="text-gray-400 text-sm">Meets International Association of Assessing Officers standards</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Database className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Complete Audit Trail</h4>
                    <p className="text-gray-400 text-sm">Every valuation is fully documented for transparency and appeal defense</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-dark-900 rounded-2xl border border-dark-700 p-8">
              <h3 className="text-white font-semibold mb-6">Supported Standards</h3>
              <div className="grid grid-cols-2 gap-4">
                {['USPAP', 'IAAO', 'State Requirements', 'Local Regulations', 'Ratio Studies', 'Audit Requirements'].map((standard) => (
                  <div key={standard} className="flex items-center space-x-3 bg-dark-800 rounded-lg p-3">
                    <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{standard}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="section bg-dark-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card text-center p-12">
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
      <section className="section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Modernize Your Assessment Office?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            See how Axxiom can help you deliver more accurate assessments with less effort.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/demo" className="btn-primary text-lg px-8 py-4">
              Request Demo
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/contact" className="btn-secondary text-lg px-8 py-4">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
