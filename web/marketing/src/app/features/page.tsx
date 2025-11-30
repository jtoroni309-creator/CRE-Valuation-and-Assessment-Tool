import { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
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
  Database,
  Cloud,
  Lock,
  RefreshCw,
  Globe,
  Cpu,
  Layers,
  Target,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Features - AI-Powered CRE Platform',
  description: 'Explore Axxiom\'s comprehensive suite of AI-powered tools for commercial real estate valuation, analysis, and investment decision-making.',
  openGraph: {
    title: 'Features | Axxiom',
    description: 'Explore our comprehensive AI-powered CRE platform features.',
  },
};

const coreFeatures = [
  {
    icon: Brain,
    title: 'AI Valuation Engine',
    description: 'Multi-model valuation using income, sales comparison, and cost approaches. Our AI synthesizes all three methods for institutional-grade accuracy.',
    features: [
      'Income Capitalization Analysis',
      'Sales Comparison Approach',
      'Cost Approach Estimation',
      'Automated Reconciliation',
      'Confidence Scoring',
    ],
    gradient: 'from-primary-500 to-primary-600',
  },
  {
    icon: Eye,
    title: 'Computer Vision',
    description: 'Advanced image analysis powered by Google Vision AI to assess property condition, identify features, and detect maintenance needs.',
    features: [
      'Condition Assessment',
      'Feature Detection',
      'Defect Identification',
      'Quality Scoring',
      'Renovation Estimates',
    ],
    gradient: 'from-accent-500 to-accent-600',
  },
  {
    icon: FileText,
    title: 'Document Intelligence',
    description: 'Extract structured data from any document including leases, rent rolls, appraisals, and financial statements with 99% accuracy.',
    features: [
      'Lease Abstraction',
      'Financial Statement Parsing',
      'Rent Roll Analysis',
      'Appraisal Data Extraction',
      'Multi-format Support',
    ],
    gradient: 'from-purple-500 to-purple-600',
  },
  {
    icon: LineChart,
    title: 'Predictive Analytics',
    description: 'ML-powered forecasting for property values, market trends, and investment returns using historical data and market signals.',
    features: [
      'Value Forecasting',
      'Market Trend Prediction',
      'Risk Assessment',
      'Portfolio Optimization',
      'Scenario Modeling',
    ],
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    icon: MapPin,
    title: '3D Property Mapping',
    description: 'Interactive 3D visualization with Google Maps integration for spatial analysis, comparable mapping, and market heatmaps.',
    features: [
      'Photorealistic 3D Views',
      'Comparable Mapping',
      'Market Heatmaps',
      'Demographic Overlays',
      'Transit & Amenity Analysis',
    ],
    gradient: 'from-rose-500 to-rose-600',
  },
  {
    icon: Target,
    title: 'Investment Analyzer',
    description: 'Comprehensive investment analysis including IRR, NPV, cash-on-cash returns, and sensitivity analysis for any CRE asset.',
    features: [
      'IRR & NPV Calculation',
      'Cash Flow Modeling',
      'Sensitivity Analysis',
      'Exit Strategy Planning',
      'Deal Scoring',
    ],
    gradient: 'from-amber-500 to-amber-600',
  },
];

const enterpriseFeatures = [
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'SOC 2 Type II certified with end-to-end encryption, role-based access control, and comprehensive audit logging.',
  },
  {
    icon: Database,
    title: 'Data Integration',
    description: 'Connect to CoStar, ATTOM, public records, and your internal systems via our extensive API library.',
  },
  {
    icon: Cloud,
    title: 'Cloud Infrastructure',
    description: 'Built on Google Cloud Platform with 99.99% uptime SLA, auto-scaling, and global edge deployment.',
  },
  {
    icon: Lock,
    title: 'Compliance Ready',
    description: 'GDPR, CCPA, and USPAP compliant with full audit trails and data retention controls.',
  },
  {
    icon: RefreshCw,
    title: 'Real-time Sync',
    description: 'Continuous data synchronization across all connected sources for always-current valuations.',
  },
  {
    icon: Globe,
    title: 'Multi-tenant',
    description: 'Complete tenant isolation with custom branding, SSO, and organization-level controls.',
  },
];

const integrations = [
  { name: 'CoStar', category: 'Data' },
  { name: 'ATTOM', category: 'Data' },
  { name: 'Zillow', category: 'Data' },
  { name: 'Yardi', category: 'PM' },
  { name: 'MRI Software', category: 'PM' },
  { name: 'RealPage', category: 'PM' },
  { name: 'Salesforce', category: 'CRM' },
  { name: 'HubSpot', category: 'CRM' },
  { name: 'QuickBooks', category: 'Finance' },
  { name: 'Xero', category: 'Finance' },
  { name: 'Slack', category: 'Comm' },
  { name: 'Microsoft Teams', category: 'Comm' },
];

export default function FeaturesPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-500/15 rounded-full blur-[80px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="badge inline-flex mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            <span>Platform Features</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Built for <span className="gradient-text">Real Estate Professionals</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10">
            Our comprehensive AI-powered platform gives you every tool you need to make
            smarter, faster decisions in commercial real estate.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/demo" className="btn-primary text-lg px-8 py-4">
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/contact" className="btn-secondary text-lg px-8 py-4">
              Request Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading">
              Core <span className="gradient-text">Capabilities</span>
            </h2>
            <p className="section-subheading">
              Six powerful modules that work together to deliver unmatched valuation accuracy.
            </p>
          </div>

          <div className="space-y-24">
            {coreFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-3xl font-bold text-white mb-4">
                    {feature.title}
                  </h3>

                  <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    {feature.description}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {feature.features.map((item) => (
                      <li key={item} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0" />
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href={`/features/${feature.title.toLowerCase().replace(/\s+/g, '-')}`} className="text-primary-400 hover:text-primary-300 font-medium inline-flex items-center">
                    Learn more
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>

                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="bg-dark-900 rounded-2xl border border-dark-700 p-8 shadow-xl">
                    <div className="aspect-video bg-dark-800 rounded-xl flex items-center justify-center">
                      <feature.icon className="w-24 h-24 text-dark-600" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="section bg-dark-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="badge inline-flex mb-4">
              <Shield className="w-4 h-4 mr-2" />
              <span>Enterprise Ready</span>
            </div>
            <h2 className="section-heading">
              Built for <span className="gradient-text">Scale</span>
            </h2>
            <p className="section-subheading">
              Enterprise-grade infrastructure and security to support organizations of any size.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enterpriseFeatures.map((feature) => (
              <div key={feature.title} className="card">
                <div className="w-12 h-12 rounded-xl bg-dark-800 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="section" id="integrations">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading">
              Seamless <span className="gradient-text">Integrations</span>
            </h2>
            <p className="section-subheading">
              Connect with the tools you already use for a unified workflow.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {integrations.map((integration) => (
              <div
                key={integration.name}
                className="bg-dark-900 border border-dark-700 rounded-xl p-6 text-center hover:border-primary-500/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-dark-800 mx-auto mb-3 flex items-center justify-center">
                  <Layers className="w-6 h-6 text-gray-400" />
                </div>
                <div className="text-white font-medium">{integration.name}</div>
                <div className="text-gray-500 text-sm">{integration.category}</div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/features/integrations" className="btn-secondary">
              View All Integrations
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card bg-gradient-to-br from-primary-900/50 to-dark-900 border-primary-500/30 text-center p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to See It in Action?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Schedule a personalized demo and see how Axxiom can transform your CRE workflow.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/demo" className="btn-primary text-lg px-8 py-4">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/contact" className="btn-secondary text-lg px-8 py-4">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
