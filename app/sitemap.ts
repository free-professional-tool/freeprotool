
import { MetadataRoute } from 'next'
import { SEO_CONFIG, getAllToolsForSitemap } from '@/lib/seo'
import { TOOL_CATEGORIES } from '@/lib/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SEO_CONFIG.siteUrl

  // Main pages
  const mainPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }
  ]

  // Tool category pages (virtual pages for SEO)
  const categoryPages = TOOL_CATEGORIES.map(category => ({
    url: `${baseUrl}/tools#${category.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Individual tool pages
  const toolPages = getAllToolsForSitemap().map(tool => ({
    url: `${baseUrl}${tool.url}`,
    lastModified: tool.lastModified,
    changeFrequency: tool.changeFrequency,
    priority: tool.priority,
  }))

  return [
    ...mainPages,
    ...categoryPages,
    ...toolPages
  ]
}
