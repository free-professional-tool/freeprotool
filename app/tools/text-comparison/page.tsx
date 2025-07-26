
import type { Metadata } from 'next';
import { GitCompare } from 'lucide-react';
import TextComparisonTool from '@/components/text-comparison-tool';

export const metadata: Metadata = {
  title: 'Text Comparison Tool - Compare & Highlight Text Differences | Free Online Diff Checker',
  description: 'Advanced text comparison tool to compare two texts and highlight differences. Features word-based, character-based, and line-based diff algorithms with color-coded highlighting. Free online text diff checker.',
  keywords: 'text comparison, diff tool, text diff, compare text, highlight differences, text checker, file comparison, document comparison, side by side comparison, unified diff',
  openGraph: {
    title: 'Text Comparison Tool - Advanced Diff Checker',
    description: 'Compare two texts and highlight differences with advanced diff algorithms. Word-based, character-based, and line-based comparison modes.',
    type: 'website',
    url: '/tools/text-comparison',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Text Comparison Tool - Advanced Diff Checker',
    description: 'Compare two texts and highlight differences with advanced diff algorithms.',
  },
  alternates: {
    canonical: '/tools/text-comparison',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Text Comparison Tool',
  description: 'Advanced text comparison tool to compare two texts and highlight differences with multiple diff algorithms',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Word-based text comparison',
    'Character-based text comparison',
    'Line-based text comparison',
    'Side-by-side view mode',
    'Unified diff view mode',
    'Inline diff view mode',
    'Color-coded highlighting',
    'Similarity percentage calculation',
    'Statistics and metrics',
    'File upload support',
    'Export diff results',
    'Case-sensitive comparison',
    'Whitespace handling options'
  ],
  mainEntity: {
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How does the text comparison algorithm work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our text comparison tool uses advanced diff algorithms including Longest Common Subsequence (LCS) to identify differences between texts. It can compare texts word-by-word, character-by-character, or line-by-line for precise difference detection.'
        }
      },
      {
        '@type': 'Question',
        name: 'What do the different colors mean in the comparison?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Red highlights indicate deletions (text removed from original), green highlights show additions (text added in modified version), yellow/orange indicates modifications (text changed), and gray shows unchanged text.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can I compare large text files?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, our tool can handle text files up to 500,000 characters per text block. For optimal performance with very large files, we recommend using line-based comparison mode.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is my text data secure when using this tool?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolutely! All text comparison processing happens entirely in your browser. No text data is sent to our servers, ensuring complete privacy and security of your sensitive documents.'
        }
      }
    ]
  }
};

export default function TextComparisonPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 mb-6">
              <GitCompare className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Text Comparison Tool
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Compare two texts and highlight differences with advanced diff algorithms. 
              Features word-based, character-based, and line-based comparison modes with color-coded highlighting.
            </p>
          </div>

          {/* Main Tool Component */}
          <div className="mb-16">
            <TextComparisonTool />
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <GitCompare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Algorithms</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Uses Longest Common Subsequence (LCS) and other advanced diff algorithms for precise comparison results.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <GitCompare className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multiple View Modes</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Choose from side-by-side, unified, or inline view modes to visualize differences in the way that works best for you.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <GitCompare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
              <p className="text-gray-600 dark:text-gray-300">
                All processing happens in your browser. No text data is sent to servers, ensuring complete privacy and security.
              </p>
            </div>
          </div>

          {/* Color Legend */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mb-16">
            <h2 className="text-2xl font-bold mb-6">Color Legend</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                <span className="text-sm">Added text</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
                <span className="text-sm">Removed text</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-amber-500 rounded mr-3"></div>
                <span className="text-sm">Modified text</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-500 rounded mr-3"></div>
                <span className="text-sm">Unchanged text</span>
              </div>
            </div>
          </div>

          {/* How to Use */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg mb-16">
            <h2 className="text-2xl font-bold mb-6">How to Use the Text Comparison Tool</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Step-by-Step Guide:</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Paste or type your original text in the left text area</li>
                  <li>Paste or type your modified text in the right text area</li>
                  <li>Choose your comparison mode (word, character, or line-based)</li>
                  <li>Select your preferred view mode (side-by-side, unified, or inline)</li>
                  <li>Adjust settings like case sensitivity and whitespace handling</li>
                  <li>Click "Compare" to see the highlighted differences</li>
                  <li>Review the statistics and similarity percentage</li>
                  <li>Export or copy the results as needed</li>
                </ol>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Pro Tips:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Use line-based comparison for code and structured documents</li>
                  <li>Word-based comparison works best for prose and articles</li>
                  <li>Character-based comparison provides the most detailed analysis</li>
                  <li>Enable case-sensitive mode for precise technical comparisons</li>
                  <li>Use ignore whitespace for comparing formatted documents</li>
                  <li>The unified view is great for code reviews</li>
                  <li>Side-by-side view helps with document editing</li>
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">How does the text comparison algorithm work?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our text comparison tool uses advanced diff algorithms including Longest Common Subsequence (LCS) to identify differences between texts. 
                  It can compare texts word-by-word, character-by-character, or line-by-line for precise difference detection.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">What do the different colors mean in the comparison?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Red highlights indicate deletions (text removed from original), green highlights show additions (text added in modified version), 
                  yellow/orange indicates modifications (text changed), and gray shows unchanged text.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Can I compare large text files?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes, our tool can handle text files up to 500,000 characters per text block. For optimal performance with very large files, 
                  we recommend using line-based comparison mode.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Is my text data secure when using this tool?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Absolutely! All text comparison processing happens entirely in your browser. No text data is sent to our servers, 
                  ensuring complete privacy and security of your sensitive documents.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">What file formats are supported for upload?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  You can upload plain text files (.txt), as well as paste content from any text-based format. 
                  The tool works with any text content including code, documents, articles, and more.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">How accurate is the similarity percentage?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  The similarity percentage is calculated based on the ratio of unchanged content to total content. 
                  It provides a quick overview of how similar the two texts are, with 100% meaning identical texts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
