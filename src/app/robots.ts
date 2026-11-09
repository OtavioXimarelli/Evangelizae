import type {MetadataRoute} from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://evangelizae.org';
  return {
    rules: {userAgent: '*', allow: ['/', '/pt', '/pt/inicio', '/pt/about', '/pt/privacy'], disallow: ['/pt/sanctuary', '/pt/rosary', '/pt/liturgy', '/pt/settings', '/pt/comecar', '/pt/admin', '/en']},
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
