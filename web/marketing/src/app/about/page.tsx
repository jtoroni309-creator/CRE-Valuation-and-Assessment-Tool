import { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Target,
  Heart,
  Lightbulb,
  Users,
  Globe,
  Award,
  Linkedin,
  Twitter,
  Building2,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us - Our Mission & Team',
  description: 'Learn about Axxiom\'s mission to transform commercial real estate with AI. Meet our team of industry experts and technologists.',
  openGraph: {
    title: 'About Us | Axxiom',
    description: 'Our mission to transform commercial real estate with AI.',
  },
};

const stats = [
  { value: '2019', label: 'Founded' },
  { value: '150+', label: 'Team Members' },
  { value: '12', label: 'Countries' },
  { value: '$50M+', label: 'Funding Raised' },
];

const values = [
  {
    icon: Target,
    title: 'Accuracy First',
    description: 'We obsess over precision. Every feature we build is designed to deliver the most accurate valuations possible.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We push the boundaries of what\'s possible with AI and machine learning in commercial real estate.',
  },
  {
    icon: Heart,
    title: 'Customer Success',
    description: 'Your success is our success. We\'re committed to helping you make better decisions, faster.',
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'We work together—with each other and with our customers—to solve the hardest problems in CRE.',
  },
];

const team = [
  {
    name: 'Alexandra Chen',
    role: 'Co-Founder & CEO',
    bio: 'Former VP at Blackstone with 15 years in CRE. Stanford MBA.',
    image: null,
    linkedin: '#',
    twitter: '#',
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Co-Founder & CTO',
    bio: 'Ex-Google AI researcher. PhD in Machine Learning from MIT.',
    image: null,
    linkedin: '#',
    twitter: '#',
  },
  {
    name: 'Sarah Thompson',
    role: 'Chief Product Officer',
    bio: 'Previously led product at CoStar. 12 years in proptech.',
    image: null,
    linkedin: '#',
    twitter: '#',
  },
  {
    name: 'David Kim',
    role: 'VP of Engineering',
    bio: 'Former engineering lead at Zillow. 20+ years in tech.',
    image: null,
    linkedin: '#',
    twitter: '#',
  },
  {
    name: 'Jennifer Walsh',
    role: 'Chief Revenue Officer',
    bio: 'Built enterprise sales at Yardi. 18 years in B2B SaaS.',
    image: null,
    linkedin: '#',
    twitter: '#',
  },
  {
    name: 'Michael Patel',
    role: 'Head of AI Research',
    bio: 'Published researcher in computer vision. PhD from Stanford.',
    image: null,
    linkedin: '#',
    twitter: '#',
  },
];

const investors = [
  'Andreessen Horowitz',
  'Sequoia Capital',
  'Fifth Wall',
  'Tiger Global',
  'General Catalyst',
  'Greylock Partners',
];

const timeline = [
  {
    year: '2019',
    title: 'Company Founded',
    description: 'Alexandra and Marcus founded Axxiom with a vision to transform CRE valuation with AI.',
  },
  {
    year: '2020',
    title: 'Seed Round',
    description: 'Raised $5M seed funding led by Fifth Wall to build our core AI platform.',
  },
  {
    year: '2021',
    title: 'Platform Launch',
    description: 'Launched our AI valuation platform with first 100 enterprise customers.',
  },
  {
    year: '2022',
    title: 'Series A',
    description: 'Raised $20M Series A led by a]Andreessen Horowitz to accelerate growth.',
  },
  {
    year: '2023',
    title: 'Global Expansion',
    description: 'Expanded to 12 countries with offices in London, Singapore, and Toronto.',
  },
  {
    year: '2024',
    title: 'Series B',
    description: 'Raised $25M Series B to launch next-generation AI capabilities.',
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="badge inline-flex mb-6">
              <Building2 className="w-4 h-4 mr-2" />
              <span>About Axxiom</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Transforming CRE with{' '}
              <span className="gradient-text">Artificial Intelligence</span>
            </h1>

            <p className="text-xl text-gray-400 mb-8">
              We're on a mission to make commercial real estate valuation more accurate,
              accessible, and efficient through the power of AI.
            </p>

            <Link href="/contact" className="btn-primary">
              Join Our Team
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Our Mission
              </h2>
              <p className="text-gray-400 text-lg mb-6">
                Commercial real estate is one of the largest asset classes in the world, yet valuations
                are still largely manual, subjective, and time-consuming. We believe there's a better way.
              </p>
              <p className="text-gray-400 text-lg mb-6">
                Axxiom combines cutting-edge AI with deep industry expertise to deliver valuations that
                are faster, more accurate, and more defensible than ever before.
              </p>
              <p className="text-gray-400 text-lg">
                Our platform helps investment firms, appraisers, and assessors make better decisions,
                reduce risk, and save hundreds of hours every year.
              </p>
            </div>

            <div className="bg-dark-900 rounded-2xl border border-dark-700 p-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">$47B+ Properties Valued</h3>
                    <p className="text-gray-400 text-sm">Our AI has analyzed billions in real estate assets</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-accent-500/20 flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-accent-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">98.5% Accuracy Rate</h3>
                    <p className="text-gray-400 text-sm">Consistently outperforming traditional methods</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">2,500+ Enterprise Clients</h3>
                    <p className="text-gray-400 text-sm">Trusted by industry leaders worldwide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-dark-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading">
              Our <span className="gradient-text">Values</span>
            </h2>
            <p className="section-subheading">
              The principles that guide everything we do.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="card text-center">
                <div className="w-14 h-14 rounded-xl bg-primary-500/20 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading">
              Our <span className="gradient-text">Journey</span>
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-dark-700 -translate-x-1/2" />

            <div className="space-y-12">
              {timeline.map((event, index) => (
                <div
                  key={event.year}
                  className={`relative flex items-start gap-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className={`hidden md:block md:w-1/2 ${index % 2 === 0 ? 'text-right' : ''}`}>
                    <div className="card inline-block">
                      <div className="text-primary-400 font-bold text-lg mb-1">{event.year}</div>
                      <h3 className="text-white font-semibold mb-2">{event.title}</h3>
                      <p className="text-gray-400 text-sm">{event.description}</p>
                    </div>
                  </div>

                  <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-primary-500 border-4 border-dark-950 -translate-x-1/2 mt-6" />

                  <div className="pl-12 md:hidden">
                    <div className="text-primary-400 font-bold text-lg mb-1">{event.year}</div>
                    <h3 className="text-white font-semibold mb-2">{event.title}</h3>
                    <p className="text-gray-400 text-sm">{event.description}</p>
                  </div>

                  <div className="hidden md:block md:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section bg-dark-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading">
              Leadership <span className="gradient-text">Team</span>
            </h2>
            <p className="section-subheading">
              Industry veterans and world-class technologists united by a shared vision.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member) => (
              <div key={member.name} className="card group">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>

                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
                  <p className="text-primary-400 text-sm mb-3">{member.role}</p>
                  <p className="text-gray-400 text-sm mb-4">{member.bio}</p>

                  <div className="flex items-center justify-center space-x-3">
                    <a
                      href={member.linkedin}
                      className="w-8 h-8 rounded-lg bg-dark-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-dark-700 transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a
                      href={member.twitter}
                      className="w-8 h-8 rounded-lg bg-dark-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-dark-700 transition-colors"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/about/careers" className="btn-secondary">
              View Open Positions
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Investors */}
      <section className="section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading">
              Backed by the <span className="gradient-text">Best</span>
            </h2>
            <p className="section-subheading">
              We're proud to be supported by leading venture capital firms.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {investors.map((investor) => (
              <div
                key={investor}
                className="bg-dark-900 border border-dark-700 rounded-xl p-6 flex items-center justify-center h-24 hover:border-primary-500/50 transition-colors"
              >
                <span className="text-gray-400 font-medium text-center">{investor}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card bg-gradient-to-br from-primary-900/50 to-dark-900 border-primary-500/30 text-center p-12">
            <Sparkles className="w-12 h-12 text-primary-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Join Our Growing Team
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              We're always looking for talented people who are passionate about AI and real estate.
            </p>
            <Link href="/about/careers" className="btn-primary">
              View Open Positions
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
