import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us — Our Story, Textile Philosophy & Mission',
  description:
    'Learn about AYRO Clothing BD (Timeless Essential), our mission to empower independent apparel creators, and our commitment to sustainable slow-fashion circularity.',
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
