import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ayroclothingbd.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard',
          '/dashboard/',
          '/my-listings',
          '/my-listings/',
          '/my-orders',
          '/my-orders/',
          '/clothes/edit/',
          '/add-cloth',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

