import { Metadata } from 'next';
import Link from 'next/link';
import {
  Check,
  X,
  ArrowRight,
  HelpCircle,
  Zap,
  Building2,
  Shield,
  Sparkles,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing - Plans That Scale With You',
  description: 'Simple, transparent pricing for AI-powered commercial real estate valuation. Start free, upgrade when you\'re ready.',
  openGraph: {
    title: 'Pricing | Axxiom',
    description: 'Simple, transparent pricing for AI-powered CRE valuation.',
  },
};

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for individual analysts and small teams getting started with AI-powered valuations.',
    monthlyPrice: 299,
    annualPrice: 249,
    features: {
      valuations: '50 valuations/month',
      users: '3 users',
      aiModels: 'Basic AI models',
      documentAi: '100 pages/month',
      visionAi: '50 images/month',
      support: 'Email support',
      api: false,
      customModels: false,
      sso: false,
      dedicatedManager: false,
      sla: false,
      onPremise: false,
    },
    cta: 'Start Free Trial',
    ctaLink: '/demo',
    popular: false,
  },
  {
    name: 'Professional',
    description: 'For growing investment firms and appraisal companies that need advanced AI capabilities.',
    monthlyPrice: 799,
    annualPrice: 649,
    features: {
      valuations: '250 valuations/month',
      users: '10 users',
      aiModels: 'Advanced AI models',
      documentAi: '500 pages/month',
      visionAi: '250 images/month',
      support: 'Priority support',
      api: true,
      customModels: false,
      sso: false,
      dedicatedManager: false,
      sla: false,
      onPremise: false,
    },
    cta: 'Start Free Trial',
    ctaLink: '/demo',
    popular: true,
  },
  {
    name: 'Business',
    description: 'For larger organizations requiring custom integrations and enhanced compliance features.',
    monthlyPrice: 1999,
    annualPrice: 1649,
    features: {
      valuations: '1,000 valuations/month',
      users: '50 users',
      aiModels: 'All AI models',
      documentAi: '2,500 pages/month',
      visionAi: '1,000 images/month',
      support: '24/7 phone support',
      api: true,
      customModels: true,
      sso: true,
      dedicatedManager: false,
      sla: '99.9% uptime',
      onPremise: false,
    },
    cta: 'Start Free Trial',
    ctaLink: '/demo',
    popular: false,
  },
  {
    name: 'Enterprise',
    description: 'For large organizations with custom requirements, on-premise deployment, and dedicated support.',
    monthlyPrice: null,
    annualPrice: null,
    features: {
      valuations: 'Unlimited',
      users: 'Unlimited',
      aiModels: 'Custom AI models',
      documentAi: 'Unlimited',
      visionAi: 'Unlimited',
      support: 'Dedicated support team',
      api: true,
      customModels: true,
      sso: true,
      dedicatedManager: true,
      sla: '99.99% uptime',
      onPremise: true,
    },
    cta: 'Contact Sales',
    ctaLink: '/contact',
    popular: false,
  },
];

const allFeatures = [
  { key: 'valuations', name: 'Monthly Valuations', category: 'Core' },
  { key: 'users', name: 'Team Members', category: 'Core' },
  { key: 'aiModels', name: 'AI Models', category: 'AI' },
  { key: 'documentAi', name: 'Document Processing', category: 'AI' },
  { key: 'visionAi', name: 'Vision Analysis', category: 'AI' },
  { key: 'api', name: 'API Access', category: 'Integration' },
  { key: 'customModels', name: 'Custom ML Models', category: 'AI' },
  { key: 'sso', name: 'SSO / SAML', category: 'Security' },
  { key: 'dedicatedManager', name: 'Dedicated Success Manager', category: 'Support' },
  { key: 'sla', name: 'SLA Guarantee', category: 'Support' },
  { key: 'onPremise', name: 'On-Premise Deployment', category: 'Deployment' },
  { key: 'support', name: 'Support Level', category: 'Support' },
];

const faqs = [
  {
    question: 'What counts as a valuation?',
    answer: 'A valuation is a complete property analysis including all three approaches (income, sales comparison, and cost). Each unique property address counts as one valuation regardless of how many times you view or update it within a billing period.',
  },
  {
    question: 'Can I upgrade or downgrade my plan?',
    answer: 'Yes, you can change your plan at any time. Upgrades are effective immediately, and you\'ll be credited for the unused portion of your current plan. Downgrades take effect at the start of your next billing cycle.',
  },
  {
    question: 'Do you offer discounts for annual billing?',
    answer: 'Yes! Annual billing saves you approximately 17% compared to monthly billing. Enterprise customers can also negotiate multi-year discounts.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express) and ACH bank transfers. Enterprise customers can pay via invoice with net-30 terms.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes, all plans include a 14-day free trial with full access to features. No credit card required to start. Enterprise trials can be extended upon request.',
  },
  {
    question: 'What happens if I exceed my plan limits?',
    answer: 'We\'ll notify you when you reach 80% and 100% of your limits. You can upgrade at any time, or purchase additional capacity. We never cut off access without warning.',
  },
];

export default function PricingPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="badge inline-flex mb-6">
            <span>Simple, Transparent Pricing</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Plans That <span className="gradient-text">Scale</span> With You
          </h1>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10">
            Start free, upgrade when you're ready. No hidden fees, no long-term contracts.
            Cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center space-x-4 bg-dark-800 rounded-full p-1.5 mb-12">
            <button className="px-6 py-2 rounded-full bg-primary-600 text-white font-medium">
              Monthly
            </button>
            <button className="px-6 py-2 rounded-full text-gray-400 hover:text-white transition-colors">
              Annual <span className="text-accent-400 text-sm ml-1">Save 17%</span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`card relative ${
                  plan.popular ? 'border-primary-500 ring-2 ring-primary-500/20 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary-500 text-white text-sm font-medium px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm">{plan.description}</p>
                </div>

                <div className="mb-6">
                  {plan.monthlyPrice !== null ? (
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-white">${plan.monthlyPrice}</span>
                      <span className="text-gray-400 ml-2">/month</span>
                    </div>
                  ) : (
                    <div className="text-4xl font-bold text-white">Custom</div>
                  )}
                  {plan.annualPrice && (
                    <p className="text-sm text-gray-500 mt-1">
                      or ${plan.annualPrice}/mo billed annually
                    </p>
                  )}
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-accent-500 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{plan.features.valuations}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-accent-500 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{plan.features.users}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-accent-500 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{plan.features.aiModels}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-accent-500 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{plan.features.documentAi}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-accent-500 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{plan.features.support}</span>
                  </div>
                  {plan.features.api && (
                    <div className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-accent-500 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">API Access</span>
                    </div>
                  )}
                  {plan.features.sso && (
                    <div className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-accent-500 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">SSO / SAML</span>
                    </div>
                  )}
                </div>

                <Link
                  href={plan.ctaLink}
                  className={`w-full text-center ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="section bg-dark-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading">
              Compare <span className="gradient-text">Features</span>
            </h2>
            <p className="section-subheading">
              Detailed comparison of what's included in each plan.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700">
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Feature</th>
                  {plans.map((plan) => (
                    <th key={plan.name} className="text-center py-4 px-4">
                      <span className={`font-bold ${plan.popular ? 'text-primary-400' : 'text-white'}`}>
                        {plan.name}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allFeatures.map((feature) => (
                  <tr key={feature.key} className="border-b border-dark-800">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-300">{feature.name}</span>
                      </div>
                    </td>
                    {plans.map((plan) => {
                      const value = plan.features[feature.key as keyof typeof plan.features];
                      return (
                        <td key={plan.name} className="text-center py-4 px-4">
                          {typeof value === 'boolean' ? (
                            value ? (
                              <Check className="w-5 h-5 text-accent-500 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-gray-600 mx-auto" />
                            )
                          ) : (
                            <span className="text-gray-300 text-sm">{value}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card bg-gradient-to-br from-dark-800 to-dark-900 border-dark-600 p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="badge inline-flex mb-4">
                  <Building2 className="w-4 h-4 mr-2" />
                  <span>Enterprise</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Custom Solutions for Large Organizations
                </h2>
                <p className="text-gray-400 mb-6">
                  Get a tailored solution with dedicated infrastructure, custom AI models,
                  advanced security, and premium support.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-accent-500" />
                    <span className="text-gray-300">Custom ML model training</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-accent-500" />
                    <span className="text-gray-300">On-premise deployment options</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-accent-500" />
                    <span className="text-gray-300">Dedicated success manager</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-accent-500" />
                    <span className="text-gray-300">99.99% uptime SLA</span>
                  </li>
                </ul>
                <Link href="/contact" className="btn-primary">
                  Contact Sales
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>

              <div className="space-y-4">
                <div className="bg-dark-800/50 rounded-xl p-6 border border-dark-700">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-primary-500/20 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-primary-400" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">SOC 2 Type II</div>
                      <div className="text-gray-400 text-sm">Enterprise-grade security</div>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-800/50 rounded-xl p-6 border border-dark-700">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-accent-500/20 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-accent-400" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">99.99% Uptime</div>
                      <div className="text-gray-400 text-sm">Guaranteed availability</div>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-800/50 rounded-xl p-6 border border-dark-700">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">Custom AI Models</div>
                      <div className="text-gray-400 text-sm">Trained on your data</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section bg-dark-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="card">
                <div className="flex items-start space-x-4">
                  <HelpCircle className="w-6 h-6 text-primary-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-white font-semibold mb-2">{faq.question}</h3>
                    <p className="text-gray-400">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-400 mb-4">Still have questions?</p>
            <Link href="/contact" className="btn-secondary">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
