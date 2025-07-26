
import { MetadataRoute } from 'next'
import { SEO_CONFIG } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/uploads/',
          '/_next/',
          '/admin/',
          '*.json',
          '/*?*utm_*', // Block UTM parameters
          '/*?*ref=*', // Block referrer parameters
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'Google-Extended',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      }
    ],
    sitemap: `${SEO_CONFIG.siteUrl}/sitemap.xml`,
    host: SEO_CONFIG.siteUrl,
  }
}
