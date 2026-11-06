import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Designer Apparel, Streetwear & Knitwear Drops',
  description:
    'Discover and shop handcrafted apparel, Italian wool overcoats, raw denim, bespoke streetwear, and vintage garments listed by verified ateliers.',
  openGraph: {
    title: 'Explore Apparel Catalog | AYRO Clothing BD',
    description:
      'Curated streetwear, bespoke blazers, and handcrafted knitwear directly from boutique designers.',
    url: 'https://ayroclothingbd.vercel.app/clothes',
  },
};

export default function ClothesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

