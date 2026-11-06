import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { Jost } from 'next/font/google';
import './globals.css';

import { ThemeProvider } from '@/context/theme-context';
import { AuthProvider } from '@/context/auth-context';
import { WishlistProvider } from '@/context/wishlist-context';
import { Navbar } from '@/components/navbar';
import { SearchModal } from '@/components/search-modal';
import { SizeChartModal } from '@/components/size-chart-modal';
import { Footer } from '@/components/footer';
import { Toaster } from 'sonner';

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-sans',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ayroclothingbd.vercel.app';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'AYRO Clothing BD — Timeless Essential & Peer-to-Peer Apparel Marketplace',
    template: '%s | AYRO Clothing BD',
  },
  description:
    'Discover, buy, and trade bespoke designer garments, curated streetwear, and handcrafted apparel. Peer-to-peer sustainable fashion marketplace with real-time atomic inventory deduction.',
  keywords: [
    'AYRO Clothing BD',
    'AYRO',
    'Timeless Essential',
    'Clothing BD',
    'Apparel Marketplace Bangladesh',
    'Designer Clothes Dhaka',
    'Streetwear Bangladesh',
    'Boutique Apparel Atelier',
    'Peer-to-Peer Clothing Sharing',
    'Sustainable Fashion BD',
  ],
  authors: [{ name: 'AYRO Clothing BD', url: siteUrl }],
  creator: 'AYRO Clothing BD',
  publisher: 'AYRO Clothing BD',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'AYRO Clothing BD',
    title: 'AYRO Clothing BD — Timeless Essential',
    description:
      'The premier apparel marketplace dedicated to independent fashion creators, boutique ateliers, and discerning clothing connoisseurs.',
    images: [
      {
        url: '/home-1.jpg',
        width: 1200,
        height: 630,
        alt: 'AYRO Clothing BD — Timeless Essential Apparel Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AYRO Clothing BD — Timeless Essential',
    description:
      'The premier apparel marketplace dedicated to independent fashion creators, boutique ateliers, and discerning clothing connoisseurs.',
    images: ['/home-1.jpg'],
    creator: '@ayroclothingbd',
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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'AYRO Clothing BD',
      url: siteUrl,
      logo: `${siteUrl}/favicon.ico`,
      sameAs: [
        'https://x.com',
        'https://www.instagram.com/ayroclothingbd',
        'https://facebook.com',
      ],
      description:
        'AYRO Clothing BD • Timeless Essential. Premier apparel marketplace for independent fashion creators and boutique ateliers.',
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'AYRO Clothing BD',
      publisher: {
        '@id': `${siteUrl}/#organization`,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/clothes?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${jost.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen w-full max-w-full flex flex-col bg-background text-foreground transition-colors duration-200 font-sans"
      >
        <ThemeProvider>
          <AuthProvider>
            <WishlistProvider>
              <Suspense fallback={<div className="h-28 w-full border-b border-border/40 bg-background/70 backdrop-blur-xl" />}>
                <Navbar />
              </Suspense>
              <Suspense fallback={null}>
                <SearchModal />
              </Suspense>
              <Suspense fallback={null}>
                <SizeChartModal />
              </Suspense>
              <main className="flex-1 flex flex-col w-full max-w-full">{children}</main>
              <Suspense fallback={null}>
                <Footer />
              </Suspense>
              <Toaster richColors position="top-right" closeButton />
            </WishlistProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
