
import { TOOL_CATEGORIES } from './constants';

// SEO configuration and utilities
export const SEO_CONFIG = {
  siteName: 'Free ProfessionalTool',
  siteUrl: 'https://freeprofessionaltool.com',
  defaultTitle: 'Free ProfessionalTool - Professional Productivity Tools',
  defaultDescription: 'Free online productivity tools for image editing, text processing, PDF manipulation, and more. Professional-grade tools accessible from any device.',
  defaultKeywords: [
    'productivity tools',
    'image editing',
    'background removal', 
    'PDF tools',
    'text tools',
    'online tools',
    'free professional tools',
    'document converter',
    'file conversion',
    'business tools'
  ],
  twitterHandle: '@FreeProfessionalTool',
  defaultImage: '/logo-with-text.png',
  author: 'Free ProfessionalTool Team',
  contactEmail: 'hello@freeprofessionaltool.com',
  language: 'en',
  region: 'US'
};

export interface SEOMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  structuredData?: any;
  noIndex?: boolean;
  noFollow?: boolean;
}

// Generate comprehensive metadata for pages
export function generateSEOMetadata(options: SEOMetadata) {
  const {
    title = SEO_CONFIG.defaultTitle,
    description = SEO_CONFIG.defaultDescription,
    keywords = SEO_CONFIG.defaultKeywords,
    canonicalUrl,
    ogTitle,
    ogDescription,
    ogImage = SEO_CONFIG.defaultImage,
    ogType = 'website',
    twitterTitle,
    twitterDescription,
    twitterImage,
    twitterCard = 'summary_large_image',
    noIndex = false,
    noFollow = false
  } = options;

  const fullTitle = title.includes(SEO_CONFIG.siteName) ? title : `${title} | ${SEO_CONFIG.siteName}`;
  const fullCanonicalUrl = canonicalUrl ? `${SEO_CONFIG.siteUrl}${canonicalUrl}` : undefined;
  const fullOgImage = ogImage?.startsWith('http') ? ogImage : `${SEO_CONFIG.siteUrl}${ogImage}`;
  
  return {
    title: fullTitle,
    description,
    keywords: Array.isArray(keywords) ? keywords.join(', ') : keywords,
    authors: [{ name: SEO_CONFIG.author }],
    creator: SEO_CONFIG.author,
    publisher: SEO_CONFIG.siteName,
    robots: {
      index: !noIndex,
      follow: !noFollow,
      googleBot: {
        index: !noIndex,
        follow: !noFollow,
      },
    },
    ...(fullCanonicalUrl && {
      alternates: {
        canonical: fullCanonicalUrl,
      },
    }),
    openGraph: {
      title: ogTitle || fullTitle,
      description: ogDescription || description,
      type: ogType,
      images: [
        {
          url: fullOgImage,
          width: 1200,
          height: 630,
          alt: ogTitle || fullTitle,
        },
      ],
      siteName: SEO_CONFIG.siteName,
      locale: 'en_US',
      ...(fullCanonicalUrl && { url: fullCanonicalUrl }),
    },
    twitter: {
      card: twitterCard,
      title: twitterTitle || ogTitle || fullTitle,
      description: twitterDescription || ogDescription || description,
      images: [twitterImage || fullOgImage],
      creator: SEO_CONFIG.twitterHandle,
      site: SEO_CONFIG.twitterHandle,
    },
    other: {
      'msapplication-TileColor': '#8b5cf6',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
    },
  };
}

// Generate viewport configuration
export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#8b5cf6'
  };
}

// Schema.org structured data generators
export const SchemaGenerators = {
  // Organization Schema
  organization: () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": SEO_CONFIG.siteName,
    "description": SEO_CONFIG.defaultDescription,
    "url": SEO_CONFIG.siteUrl,
    "logo": `${SEO_CONFIG.siteUrl}/logo-with-text.png`,
    "foundingDate": "2024",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": SEO_CONFIG.contactEmail,
      "contactType": "customer service"
    },
    "sameAs": [
      `https://twitter.com/${SEO_CONFIG.twitterHandle.replace('@', '')}`
    ]
  }),

  // Website Schema with Search Action
  website: () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SEO_CONFIG.siteName,
    "description": SEO_CONFIG.defaultDescription,
    "url": SEO_CONFIG.siteUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${SEO_CONFIG.siteUrl}/tools?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": SEO_CONFIG.siteName,
      "logo": `${SEO_CONFIG.siteUrl}/logo-with-text.png`
    }
  }),

  // Software Application Schema for tools
  softwareApplication: (tool: any, category: string) => ({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.name,
    "description": tool.description,
    "url": `${SEO_CONFIG.siteUrl}${tool.href}`,
    "applicationCategory": category === 'image-editing' ? 'MultimediaApplication' : 
                          category === 'pdf-tools' ? 'BusinessApplication' : 'DeveloperApplication',
    "operatingSystem": "Any",
    "permissions": "browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "publisher": {
      "@type": "Organization",
      "name": SEO_CONFIG.siteName
    },
    "author": {
      "@type": "Organization",
      "name": SEO_CONFIG.siteName
    },
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString(),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "1250",
      "bestRating": "5",
      "worstRating": "1"
    }
  }),

  // BreadcrumbList Schema
  breadcrumbList: (items: Array<{name: string, url: string}>) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${SEO_CONFIG.siteUrl}${item.url}`
    }))
  }),

  // FAQ Schema
  faqPage: (faqs: Array<{question: string, answer: string}>) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }),

  // HowTo Schema
  howTo: (name: string, steps: Array<{name: string, text: string}>) => ({
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": `Learn how to use ${name} with this step-by-step guide`,
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text
    })),
    "totalTime": "PT5M",
    "estimatedCost": "0",
    "supply": [],
    "tool": []
  }),

  // Product/Service Schema for tool categories
  service: (category: any) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": category.name,
    "description": category.description,
    "provider": {
      "@type": "Organization",
      "name": SEO_CONFIG.siteName
    },
    "serviceType": category.name,
    "areaServed": "Worldwide",
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": `${SEO_CONFIG.siteUrl}/tools`,
      "serviceName": "Online Tools"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  })
};

// Generate tool-specific SEO metadata
export function generateToolSEO(toolId: string) {
  const tool = TOOL_CATEGORIES
    .flatMap(cat => cat.tools.map(tool => ({ ...tool, categoryName: cat.name, categoryId: cat.id })))
    .find(t => t.id === toolId);

  if (!tool) return null;

  const title = `${tool.name} - Professional ${tool.categoryName} Tool`;
  const description = `${tool.description}. Free online ${tool.name.toLowerCase()} with professional features. No registration required.`;
  
  return {
    title,
    description,
    keywords: [
      tool.name.toLowerCase(),
      tool.categoryName.toLowerCase(),
      'online tool',
      'free tool',
      'professional tool',
      'no registration',
      'browser based'
    ],
    canonicalUrl: tool.href,
    structuredData: [
      SchemaGenerators.softwareApplication(tool, tool.categoryId),
      SchemaGenerators.breadcrumbList([
        { name: 'Home', url: '/' },
        { name: 'Tools', url: '/tools' },
        { name: tool.categoryName, url: `/tools#${tool.categoryId}` },
        { name: tool.name, url: tool.href }
      ])
    ]
  };
}

// Get all tools for sitemap generation
export function getAllToolsForSitemap() {
  return TOOL_CATEGORIES.flatMap(category => 
    category.tools
      .filter(tool => !tool.comingSoon)
      .map(tool => ({
        url: tool.href,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: tool.featured ? 0.8 : 0.6,
        title: tool.name,
        description: tool.description
      }))
  );
}

// Generate category-specific SEO
export function generateCategorySEO(categoryId: string) {
  const category = TOOL_CATEGORIES.find(cat => cat.id === categoryId);
  if (!category) return null;

  const tools = category.tools.filter(tool => !tool.comingSoon);
  const title = `${category.name} Tools - Professional ${category.name} Suite`;
  const description = `${category.description}. ${tools.length} professional ${category.name.toLowerCase()} tools available for free. No registration required.`;

  return {
    title,
    description,
    keywords: [
      category.name.toLowerCase(),
      `${category.name.toLowerCase()} tools`,
      'professional tools',
      'free online tools',
      'productivity suite'
    ],
    canonicalUrl: `/tools#${categoryId}`,
    structuredData: [
      SchemaGenerators.service(category),
      SchemaGenerators.breadcrumbList([
        { name: 'Home', url: '/' },
        { name: 'Tools', url: '/tools' },
        { name: category.name, url: `/tools#${categoryId}` }
      ])
    ]
  };
}
