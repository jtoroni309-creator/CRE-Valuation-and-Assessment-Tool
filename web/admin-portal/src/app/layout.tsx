import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers, ThemeScript } from '@/components/Providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Axxiom | AI-Powered CRE Valuation Platform',
    template: '%s | Axxiom',
  },
  description:
    'Transform your commercial real estate valuations with AI-powered analytics, automated appraisals, and intelligent tax appeal management.',
  keywords: [
    'commercial real estate',
    'property valuation',
    'CRE',
    'appraisal',
    'tax appeal',
    'AI',
    'machine learning',
    'property assessment',
  ],
  authors: [{ name: 'Axxiom' }],
  creator: 'Axxiom',
  publisher: 'Axxiom',
  robots: 'noindex, nofollow', // Private admin portal
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <ThemeScript />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
