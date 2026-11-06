import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works — Transparent Peer-to-Peer Fashion Marketplace',
  description:
    'Learn how AYRO Clothing BD connects independent fashion creators and discerning buyers with atomic stock deduction, escrow guarantees, and genuine fiber verification.',
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
