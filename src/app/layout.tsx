import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';

import { ThemeProvider } from '@/context/theme-context';
import { AuthProvider } from '@/context/auth-context';
import { WishlistProvider } from '@/context/wishlist-context';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'ClothSpace — Peer-to-Peer Apparel Marketplace & Designer Clothing Sharing Platform',
  description:
    'Discover, inspect dynamic sizes and stock availability, and place orders with transparent pricing and real-time order management for independent fashion designers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>
            <WishlistProvider>
              <Navbar />
              <main className="flex-1 flex flex-col">{children}</main>
              <Footer />
              <Toaster richColors position="top-right" closeButton />
            </WishlistProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
