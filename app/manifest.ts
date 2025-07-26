
import { MetadataRoute } from 'next'
import { SEO_CONFIG } from '@/lib/seo'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SEO_CONFIG.siteName,
    short_name: 'FreeProfessionalTool',
    description: SEO_CONFIG.defaultDescription,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#8b5cf6',
    icons: [
      {
        src: '/favicon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['productivity', 'utilities', 'business'],
    lang: 'en',
    orientation: 'portrait-primary',
    scope: '/',
    screenshots: [
      {
        src: '/logo-with-text.png',
        sizes: '1280x720',
        type: 'image/png'
      }
    ]
  }
}
