import { Metadata } from 'next';
import Link from 'next/link';
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Clock,
  ArrowRight,
  Building2,
  Headphones,
  FileText,
  Users,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us - Get in Touch',
  description: 'Contact Axxiom for sales inquiries, support, or partnership opportunities. Our team is ready to help you transform your CRE workflow.',
  openGraph: {
    title: 'Contact Us | Axxiom',
    description: 'Get in touch with our team for sales, support, or partnerships.',
  },
};

const offices = [
  {
    city: 'San Francisco',
    address: '100 Market Street, Suite 500',
    region: 'San Francisco, CA 94105',
    country: 'United States',
    phone: '+1 (415) 555-1234',
    email: 'sf@axxiom.io',
    type: 'Headquarters',
  },
  {
    city: 'New York',
    address: '350 Fifth Avenue, Suite 7820',
    region: 'New York, NY 10118',
    country: 'United States',
    phone: '+1 (212) 555-5678',
    email: 'nyc@axxiom.io',
    type: 'Sales Office',
  },
  {
    city: 'London',
    address: '25 Old Broad Street',
    region: 'London EC2N 1HN',
    country: 'United Kingdom',
    phone: '+44 20 7123 4567',
    email: 'london@axxiom.io',
    type: 'EMEA Office',
  },
  {
    city: 'Singapore',
    address: '1 Raffles Place, #20-61',
    region: 'Singapore 048616',
    country: 'Singapore',
    phone: '+65 6123 4567',
    email: 'singapore@axxiom.io',
    type: 'APAC Office',
  },
];

const contactOptions = [
  {
    icon: Headphones,
    title: 'Sales',
    description: 'Talk to our sales team about pricing and features.',
    email: 'sales@axxiom.io',
    response: 'Response within 4 hours',
  },
  {
    icon: MessageSquare,
    title: 'Support',
    description: 'Get help with your existing account or technical issues.',
    email: 'support@axxiom.io',
    response: 'Response within 2 hours',
  },
  {
    icon: Users,
    title: 'Partnerships',
    description: 'Explore integration and partnership opportunities.',
    email: 'partners@axxiom.io',
    response: 'Response within 24 hours',
  },
  {
    icon: FileText,
    title: 'Press',
    description: 'Media inquiries and press kit requests.',
    email: 'press@axxiom.io',
    response: 'Response within 24 hours',
  },
];

export default function ContactPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="badge inline-flex mb-6">
            <MessageSquare className="w-4 h-4 mr-2" />
            <span>Contact Us</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Let's <span className="gradient-text">Talk</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Have questions about Axxiom? Want to schedule a demo? Our team is here to help.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="card">
              <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="input-label">First Name *</label>
                    <input type="text" className="input" placeholder="John" required />
                  </div>
                  <div>
                    <label className="input-label">Last Name *</label>
                    <input type="text" className="input" placeholder="Smith" required />
                  </div>
                </div>

                <div>
                  <label className="input-label">Work Email *</label>
                  <input type="email" className="input" placeholder="john@company.com" required />
                </div>

                <div>
                  <label className="input-label">Company</label>
                  <input type="text" className="input" placeholder="Company name" />
                </div>

                <div>
                  <label className="input-label">Phone</label>
                  <input type="tel" className="input" placeholder="+1 (555) 000-0000" />
                </div>

                <div>
                  <label className="input-label">How can we help? *</label>
                  <select className="input">
                    <option value="">Select a topic</option>
                    <option value="demo">Request a demo</option>
                    <option value="pricing">Pricing inquiry</option>
                    <option value="support">Technical support</option>
                    <option value="partnership">Partnership opportunity</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="input-label">Message *</label>
                  <textarea
                    className="input min-h-[150px]"
                    placeholder="Tell us more about your needs..."
                    required
                  />
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="consent"
                    className="mt-1 w-4 h-4 rounded border-dark-600 bg-dark-800 text-primary-500 focus:ring-primary-500"
                  />
                  <label htmlFor="consent" className="text-sm text-gray-400">
                    I agree to receive communications from Axxiom. You can unsubscribe at any time.
                    View our{' '}
                    <Link href="/legal/privacy-policy" className="text-primary-400 hover:text-primary-300">
                      Privacy Policy
                    </Link>
                    .
                  </label>
                </div>

                <button type="submit" className="btn-primary w-full">
                  Send Message
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </form>
            </div>

            {/* Contact Options */}
            <div className="space-y-6">
              <div className="grid gap-4">
                {contactOptions.map((option) => (
                  <div key={option.title} className="card hover:border-primary-500/50 transition-colors">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                        <option.icon className="w-6 h-6 text-primary-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold mb-1">{option.title}</h3>
                        <p className="text-gray-400 text-sm mb-2">{option.description}</p>
                        <a
                          href={`mailto:${option.email}`}
                          className="text-primary-400 hover:text-primary-300 text-sm font-medium"
                        >
                          {option.email}
                        </a>
                        <div className="flex items-center space-x-2 mt-2 text-gray-500 text-xs">
                          <Clock className="w-3 h-3" />
                          <span>{option.response}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Contact */}
              <div className="card bg-gradient-to-br from-primary-900/30 to-dark-900 border-primary-500/30">
                <h3 className="text-white font-semibold mb-4">Need immediate assistance?</h3>
                <div className="space-y-3">
                  <a
                    href="tel:+14155551234"
                    className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
                  >
                    <Phone className="w-5 h-5 text-primary-400" />
                    <span>+1 (415) 555-1234</span>
                  </a>
                  <a
                    href="mailto:hello@axxiom.io"
                    className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
                  >
                    <Mail className="w-5 h-5 text-primary-400" />
                    <span>hello@axxiom.io</span>
                  </a>
                </div>
                <p className="text-gray-500 text-sm mt-4">
                  Available Monday–Friday, 6am–6pm PT
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="section bg-dark-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading">
              Our <span className="gradient-text">Offices</span>
            </h2>
            <p className="section-subheading">
              We have offices around the world to better serve our global customers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {offices.map((office) => (
              <div key={office.city} className="card">
                <div className="flex items-center space-x-2 mb-4">
                  <Building2 className="w-5 h-5 text-primary-400" />
                  <span className="text-xs text-gray-500 uppercase tracking-wider">{office.type}</span>
                </div>

                <h3 className="text-xl font-semibold text-white mb-4">{office.city}</h3>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="text-gray-400">
                      <div>{office.address}</div>
                      <div>{office.region}</div>
                      <div>{office.country}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <a href={`tel:${office.phone}`} className="text-gray-400 hover:text-white transition-colors">
                      {office.phone}
                    </a>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <a href={`mailto:${office.email}`} className="text-primary-400 hover:text-primary-300 transition-colors">
                      {office.email}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ CTA */}
      <section className="section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Looking for answers?
          </h2>
          <p className="text-gray-400 mb-8">
            Check out our FAQ section for quick answers to common questions.
          </p>
          <Link href="/resources/faq" className="btn-secondary">
            View FAQs
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
