import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL('https://axxiom.io'),
  title: {
    default: 'Axxiom - AI-Powered Commercial Real Estate Valuation Platform',
    template: '%s | Axxiom',
  },
  description: 'The most advanced AI-powered platform for commercial real estate valuation, assessment, and investment analysis. Trusted by industry leaders worldwide.',
  keywords: [
    'commercial real estate',
    'CRE valuation',
    'property assessment',
    'AI valuation',
    'real estate AI',
    'property analytics',
    'investment analysis',
    'tax assessment',
    'property appraisal',
    'market intelligence',
    'real estate technology',
    'proptech',
  ],
  authors: [{ name: 'Axxiom Technologies' }],
  creator: 'Axxiom Technologies',
  publisher: 'Axxiom Technologies',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://axxiom.io',
    siteName: 'Axxiom',
    title: 'Axxiom - AI-Powered Commercial Real Estate Valuation Platform',
    description: 'The most advanced AI-powered platform for commercial real estate valuation, assessment, and investment analysis.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Axxiom - AI-Powered CRE Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Axxiom - AI-Powered Commercial Real Estate Valuation Platform',
    description: 'The most advanced AI-powered platform for commercial real estate valuation, assessment, and investment analysis.',
    site: '@axxiomhq',
    creator: '@axxiomhq',
    images: ['/images/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://axxiom.io',
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#030712" />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <Header />
        <main className="min-h-screen pt-20">
          {children}
        </main>
        <Footer />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Axxiom',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web',
              description: 'AI-powered commercial real estate valuation and assessment platform',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
                description: 'Free trial available',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                ratingCount: '1250',
              },
              provider: {
                '@type': 'Organization',
                name: 'Axxiom Technologies',
                url: 'https://axxiom.io',
                logo: 'https://axxiom.io/images/logo.png',
                sameAs: [
                  'https://twitter.com/axxiomhq',
                  'https://linkedin.com/company/axxiom',
                  'https://github.com/axxiom',
                ],
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
