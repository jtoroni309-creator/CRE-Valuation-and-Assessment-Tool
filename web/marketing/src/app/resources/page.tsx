import { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  FileText,
  Video,
  Newspaper,
  HelpCircle,
  Download,
  PlayCircle,
  Users,
  Calendar,
  Code,
  GraduationCap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Resources - Guides, Documentation & Learning',
  description: 'Access guides, documentation, webinars, and case studies to get the most out of Axxiom\'s AI-powered CRE platform.',
  openGraph: {
    title: 'Resources | Axxiom',
    description: 'Guides, documentation, and learning resources.',
  },
};

const resourceCategories = [
  {
    icon: BookOpen,
    title: 'Documentation',
    description: 'Comprehensive guides and API documentation',
    link: '/resources/docs',
    items: ['Getting Started', 'API Reference', 'Integration Guides', 'Best Practices'],
  },
  {
    icon: Video,
    title: 'Webinars',
    description: 'Live and on-demand educational webinars',
    link: '/resources/webinars',
    items: ['Product Demos', 'Industry Insights', 'Expert Panels', 'Q&A Sessions'],
  },
  {
    icon: FileText,
    title: 'Case Studies',
    description: 'Real-world success stories from our customers',
    link: '/resources/case-studies',
    items: ['Investment Firms', 'Appraisal Districts', 'Property Managers', 'Enterprises'],
  },
  {
    icon: Newspaper,
    title: 'Blog',
    description: 'Latest news, insights, and industry trends',
    link: '/resources/blog',
    items: ['AI in CRE', 'Market Analysis', 'Product Updates', 'Thought Leadership'],
  },
];

const featuredResources = [
  {
    type: 'Guide',
    title: 'The Complete Guide to AI-Powered CRE Valuation',
    description: 'Learn how AI is transforming property valuation and how to leverage it for better decisions.',
    image: null,
    link: '/resources/guides/ai-valuation',
    readTime: '15 min read',
  },
  {
    type: 'Webinar',
    title: 'Maximizing ROI with Predictive Analytics',
    description: 'Watch our experts explain how to use predictive models to identify high-value investments.',
    image: null,
    link: '/resources/webinars/predictive-analytics',
    readTime: '45 min watch',
  },
  {
    type: 'Case Study',
    title: 'How Blackstone Reduced Due Diligence Time by 80%',
    description: 'Learn how one of the world\'s largest investment firms uses Axxiom to accelerate acquisitions.',
    image: null,
    link: '/resources/case-studies/blackstone',
    readTime: '8 min read',
  },
];

const tools = [
  {
    icon: Download,
    title: 'Cap Rate Calculator',
    description: 'Calculate cap rates for any property type',
    link: '/resources/tools/cap-rate-calculator',
  },
  {
    icon: Download,
    title: 'IRR Calculator',
    description: 'Model investment returns with our IRR tool',
    link: '/resources/tools/irr-calculator',
  },
  {
    icon: Download,
    title: 'NOI Calculator',
    description: 'Calculate net operating income quickly',
    link: '/resources/tools/noi-calculator',
  },
  {
    icon: Download,
    title: 'Rent Comp Analyzer',
    description: 'Analyze comparable rental properties',
    link: '/resources/tools/rent-comp-analyzer',
  },
];

const upcomingEvents = [
  {
    date: 'Dec 15, 2024',
    title: 'AI in Commercial Real Estate: 2025 Outlook',
    type: 'Webinar',
    link: '/resources/events/ai-cre-2025',
  },
  {
    date: 'Jan 10, 2025',
    title: 'Getting Started with Axxiom',
    type: 'Training',
    link: '/resources/events/getting-started',
  },
  {
    date: 'Jan 22, 2025',
    title: 'Advanced Valuation Techniques',
    type: 'Workshop',
    link: '/resources/events/advanced-valuation',
  },
];

export default function ResourcesPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="badge inline-flex mb-6">
            <BookOpen className="w-4 h-4 mr-2" />
            <span>Resources</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Learn. Grow. <span className="gradient-text">Succeed.</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10">
            Everything you need to master AI-powered real estate analysis and get the most
            from the Axxiom platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/resources/docs" className="btn-primary">
              View Documentation
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/resources/webinars" className="btn-secondary">
              <PlayCircle className="w-5 h-5 mr-2" />
              Watch Webinars
            </Link>
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resourceCategories.map((category) => (
              <Link key={category.title} href={category.link} className="card group hover:border-primary-500/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center mb-4 group-hover:bg-primary-500/30 transition-colors">
                  <category.icon className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{category.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{category.description}</p>
                <ul className="space-y-1">
                  {category.items.map((item) => (
                    <li key={item} className="text-gray-500 text-sm">• {item}</li>
                  ))}
                </ul>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="section bg-dark-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading">
              Featured <span className="gradient-text">Resources</span>
            </h2>
            <p className="section-subheading">
              Popular content to help you get started.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredResources.map((resource) => (
              <Link key={resource.title} href={resource.link} className="card group hover:border-primary-500/50 transition-colors">
                <div className="aspect-video bg-dark-800 rounded-xl mb-4 flex items-center justify-center">
                  <FileText className="w-12 h-12 text-dark-600" />
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="badge text-xs">{resource.type}</span>
                  <span className="text-gray-500 text-xs">{resource.readTime}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-gray-400 text-sm">{resource.description}</p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/resources/all" className="btn-secondary">
              View All Resources
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Tools & Calculators */}
      <section className="section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading">
              Free <span className="gradient-text">Tools</span>
            </h2>
            <p className="section-subheading">
              Useful calculators and tools for real estate professionals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <Link key={tool.title} href={tool.link} className="card text-center group hover:border-primary-500/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-accent-500/20 flex items-center justify-center mx-auto mb-4">
                  <tool.icon className="w-6 h-6 text-accent-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{tool.title}</h3>
                <p className="text-gray-400 text-sm">{tool.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="section bg-dark-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading">
              Upcoming <span className="gradient-text">Events</span>
            </h2>
          </div>

          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <Link key={event.title} href={event.link} className="card flex items-center justify-between group hover:border-primary-500/50 transition-colors">
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <Calendar className="w-6 h-6 text-primary-400 mx-auto mb-1" />
                    <div className="text-sm text-gray-400">{event.date}</div>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold group-hover:text-primary-400 transition-colors">
                      {event.title}
                    </h3>
                    <span className="badge text-xs mt-1">{event.type}</span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-primary-400 transition-colors" />
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/resources/events" className="text-primary-400 hover:text-primary-300 font-medium inline-flex items-center">
              View All Events
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-14 h-14 rounded-xl bg-primary-500/20 flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-7 h-7 text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Help Center</h3>
              <p className="text-gray-400 text-sm mb-4">
                Find answers to common questions and troubleshooting guides.
              </p>
              <Link href="/resources/help" className="text-primary-400 hover:text-primary-300 font-medium inline-flex items-center">
                Visit Help Center
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            <div className="card text-center">
              <div className="w-14 h-14 rounded-xl bg-accent-500/20 flex items-center justify-center mx-auto mb-4">
                <Code className="w-7 h-7 text-accent-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">API Docs</h3>
              <p className="text-gray-400 text-sm mb-4">
                Technical documentation for developers and integrations.
              </p>
              <Link href="/resources/api-docs" className="text-primary-400 hover:text-primary-300 font-medium inline-flex items-center">
                View API Docs
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            <div className="card text-center">
              <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Community</h3>
              <p className="text-gray-400 text-sm mb-4">
                Connect with other Axxiom users and share best practices.
              </p>
              <Link href="/resources/community" className="text-primary-400 hover:text-primary-300 font-medium inline-flex items-center">
                Join Community
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
