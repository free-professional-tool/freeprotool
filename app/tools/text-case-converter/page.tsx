

import { Metadata } from 'next';
import { Type, Zap, Shield, FileText, CheckCircle, HelpCircle } from 'lucide-react';
import TextCaseConverterTool from '@/components/text-case-converter-tool';

export const metadata: Metadata = {
  title: 'Text Case Converter - Transform Text Cases & Advanced Text Processing | ProductivityHub',
  description: 'Professional text case converter with 12+ case transformations: UPPERCASE, lowercase, Title Case, camelCase, snake_case, PascalCase, kebab-case and more. Free, secure, browser-based text transformation.',
  keywords: [
    'text case converter',
    'uppercase converter',
    'lowercase converter',
    'title case',
    'camelcase converter',
    'snake case converter',
    'pascalcase converter',
    'kebab case converter',
    'text transformation',
    'case conversion',
    'text processing',
    'string manipulation',
    'text formatter',
    'case changer',
    'text utilities'
  ],
  openGraph: {
    title: 'Text Case Converter - Professional Text Case Transformation',
    description: 'Convert text between 12+ case formats: UPPERCASE, lowercase, Title Case, camelCase, snake_case, PascalCase and more. Advanced text transformations with real-time statistics.',
    type: 'website',
    url: '/tools/text-case-converter',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Text Case Converter - Transform Text Cases',
    description: 'Professional text case converter with 12+ transformations and advanced text processing capabilities.',
  },
  alternates: {
    canonical: '/tools/text-case-converter',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Text Case Converter',
  description: 'Professional text case converter with comprehensive case transformations and text processing capabilities',
  url: '/tools/text-case-converter',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  permissions: 'browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'UPPERCASE conversion',
    'lowercase conversion', 
    'Title Case transformation',
    'Sentence case formatting',
    'camelCase conversion',
    'PascalCase transformation',
    'snake_case formatting',
    'kebab-case conversion',
    'Text statistics tracking',
    'Real-time processing',
    'File download support',
    'Clipboard integration'
  ]
};

export default function TextCaseConverterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <Type className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Text Case Converter
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Transform your text with 12+ case conversion types and advanced text processing. 
              Convert between UPPERCASE, lowercase, Title Case, camelCase, snake_case, PascalCase and more with real-time statistics.
            </p>
          </div>

          {/* Main Tool */}
          <div className="mb-12">
            <TextCaseConverterTool />
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Lightning Fast Processing</h3>
              <p className="text-muted-foreground">
                Real-time text transformation with instant results. Process large texts up to 1M characters with optimized algorithms.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Complete Privacy</h3>
              <p className="text-muted-foreground">
                100% browser-based processing. Your text never leaves your device. No servers, no data collection, completely secure.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Advanced Features</h3>
              <p className="text-muted-foreground">
                Comprehensive text statistics, clipboard integration, file downloads, and batch processing capabilities.
              </p>
            </div>
          </div>

          {/* Case Types Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Supported Case Transformations</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'UPPERCASE', example: 'HELLO WORLD', description: 'Convert all text to uppercase letters' },
                { name: 'lowercase', example: 'hello world', description: 'Convert all text to lowercase letters' },
                { name: 'Title Case', example: 'Hello World', description: 'Capitalize the first letter of every word' },
                { name: 'Sentence case', example: 'Hello world', description: 'Capitalize the first letter of each sentence' },
                { name: 'camelCase', example: 'helloWorld', description: 'Convert to camelCase format' },
                { name: 'PascalCase', example: 'HelloWorld', description: 'Convert to PascalCase format' },
                { name: 'snake_case', example: 'hello_world', description: 'Convert to snake_case with underscores' },
                { name: 'kebab-case', example: 'hello-world', description: 'Convert to kebab-case with hyphens' },
                { name: 'InVeRsE CaSe', example: 'hELLo WoRLd', description: 'Swap uppercase and lowercase' },
                { name: 'aLtErNaTiNg', example: 'hElLo WoRlD', description: 'Alternating case pattern' },
                { name: 'dot.case', example: 'hello.world', description: 'Convert to dot.case format' },
                { name: 'Slugify', example: 'hello-world-123', description: 'URL-friendly format conversion' }
              ].map((caseType, index) => (
                <div key={index} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50 dark:border-gray-700/50">
                  <h3 className="font-semibold text-lg mb-1">{caseType.name}</h3>
                  <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded mb-2 block">
                    {caseType.example}
                  </code>
                  <p className="text-sm text-muted-foreground">{caseType.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* How to Use Guide */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">How to Use the Text Case Converter</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  Basic Conversion
                </h3>
                <ol className="space-y-2 text-muted-foreground">
                  <li>1. Paste or type your text in the input area</li>
                  <li>2. Select the desired case transformation from the grid</li>
                  <li>3. View the instant result in the output area</li>
                  <li>4. Copy or download the converted text</li>
                </ol>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  Advanced Features
                </h3>
                <ol className="space-y-2 text-muted-foreground">
                  <li>1. Use text transformations for advanced processing</li>
                  <li>2. Monitor real-time statistics as you type</li>
                  <li>3. Upload text files for batch processing</li>
                  <li>4. Download results in multiple formats</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Pro Tips */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Pro Tips for Text Case Conversion</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Programming Conventions',
                  tip: 'Use camelCase for JavaScript variables, PascalCase for classes, snake_case for Python, and kebab-case for CSS classes and URLs.'
                },
                {
                  title: 'Content Writing',
                  tip: 'Use Title Case for headings and titles, Sentence case for body text, and UPPERCASE sparingly for emphasis.'
                },
                {
                  title: 'SEO Optimization',
                  tip: 'Use slugify transformation to create SEO-friendly URLs from titles and headings automatically.'
                },
                {
                  title: 'Data Processing',
                  tip: 'Clean messy text with "Remove Extra Spaces" and "Remove Special Characters" before applying case transformations.'
                },
                {
                  title: 'Batch Processing',
                  tip: 'Upload text files to convert large amounts of content quickly, then download the results as formatted files.'
                },
                {
                  title: 'Text Analysis',
                  tip: 'Use the statistics panel to analyze text composition - word count, character distribution, and formatting quality.'
                }
              ].map((tip, index) => (
                <div key={index} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50 dark:border-gray-700/50">
                  <h3 className="font-semibold text-lg mb-2">{tip.title}</h3>
                  <p className="text-muted-foreground text-sm">{tip.tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center">
              <HelpCircle className="w-8 h-8 mr-3 text-blue-600" />
              Frequently Asked Questions
            </h2>
            
            <div className="grid gap-6 max-w-4xl mx-auto">
              {[
                {
                  question: "What's the difference between Title Case and Sentence case?",
                  answer: "Title Case capitalizes the first letter of every word (Hello World), while Sentence case only capitalizes the first letter of each sentence (Hello world). Title Case is used for headings and titles, Sentence case for regular text."
                },
                {
                  question: "How does camelCase differ from PascalCase?",
                  answer: "camelCase starts with a lowercase letter (firstName), while PascalCase starts with an uppercase letter (FirstName). camelCase is typically used for variables and functions, PascalCase for classes and types."
                },
                {
                  question: "What is slugify and when should I use it?",
                  answer: "Slugify converts text to a URL-friendly format by making it lowercase, replacing spaces with hyphens, and removing special characters. Use it for creating SEO-friendly URLs, filenames, and identifiers."
                },
                {
                  question: "Can I process very large text files?",
                  answer: "Yes, the tool can handle up to 1 million characters efficiently. For even larger files, consider breaking them into smaller chunks for optimal performance."
                },
                {
                  question: "Is my text data secure?",
                  answer: "Absolutely! All processing happens in your browser. Your text never leaves your device, ensuring complete privacy and security. No data is sent to any servers."
                },
                {
                  question: "What text transformations are available?",
                  answer: "Beyond case conversions, you can remove extra spaces, strip special characters, reverse text, extract numbers or letters, add/remove line breaks, and create various formatted outputs."
                }
              ].map((faq, index) => (
                <details key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-lg group">
                  <summary className="p-6 cursor-pointer font-semibold text-lg hover:text-blue-600 transition-colors">
                    {faq.question}
                  </summary>
                  <div className="px-6 pb-6 text-muted-foreground border-t border-gray-200/50 dark:border-gray-700/50 pt-4">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
