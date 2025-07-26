
import { Metadata } from 'next';
import { Code2, Zap, Shield, FileText, CheckCircle, HelpCircle } from 'lucide-react';
import TextUtilitiesTool from '@/components/text-utilities-tool';

export const metadata: Metadata = {
  title: 'Text Data Utilities - JSON, YAML, CSV Formatter & Regex Tester | ProductivityHub',
  description: 'Professional text data processing tools. Format and validate JSON, YAML, CSV. Convert between formats. Test regex patterns. Free, secure, browser-based utilities.',
  keywords: [
    'json formatter',
    'yaml validator',
    'csv converter',
    'regex tester',
    'text data utilities',
    'json to csv converter',
    'yaml formatter',
    'data format converter',
    'text processing tools',
    'regex pattern tester'
  ],
  openGraph: {
    title: 'Text Data Utilities - JSON, YAML, CSV Tools & Regex Tester',
    description: 'Format, validate, and convert JSON, YAML, CSV data. Test regex patterns with real-time matching. Professional text processing tools.',
    type: 'website',
    url: '/tools/text-utilities',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Text Data Utilities - JSON, YAML, CSV & Regex Tools',
    description: 'Professional text data processing suite. Format, validate, convert data formats. Test regex patterns.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TextUtilitiesPage() {
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Text Data Utilities",
    "description": "Comprehensive text data processing tools including JSON formatter, YAML validator, CSV converter, and regex tester",
    "url": "/tools/text-utilities",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "JSON formatter and validator",
      "YAML formatter and validator", 
      "CSV formatter and validator",
      "CSV to JSON converter",
      "JSON to CSV converter",
      "Regex pattern tester",
      "Syntax highlighting",
      "Error detection and reporting",
      "File upload and download",
      "Real-time processing"
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-indigo-600/20" />
        <div className="relative container max-w-7xl mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center">
                <Code2 className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Text Data Utilities
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Professional text data processing suite with JSON formatter, YAML validator, CSV converter, and regex tester
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>100% Private & Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>Real-time Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Multiple Formats</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tool */}
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <TextUtilitiesTool />
      </div>

      {/* Features Section */}
      <div className="container max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Comprehensive Text Processing Tools</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need for professional text data processing, formatting, and validation
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-background/60 backdrop-blur rounded-xl p-6 border shadow-sm">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">JSON Tools</h3>
            <p className="text-muted-foreground">
              Format, validate, and beautify JSON data with syntax highlighting and error detection
            </p>
          </div>
          
          <div className="bg-background/60 backdrop-blur rounded-xl p-6 border shadow-sm">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">YAML Tools</h3>
            <p className="text-muted-foreground">
              Format and validate YAML documents with proper indentation and structure validation
            </p>
          </div>
          
          <div className="bg-background/60 backdrop-blur rounded-xl p-6 border shadow-sm">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-4">
              <Code2 className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">CSV Tools</h3>
            <p className="text-muted-foreground">
              Parse, format, and validate CSV data with customizable delimiters and headers
            </p>
          </div>
          
          <div className="bg-background/60 backdrop-blur rounded-xl p-6 border shadow-sm">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Format Converters</h3>
            <p className="text-muted-foreground">
              Convert between JSON, CSV, and other formats with intelligent data mapping
            </p>
          </div>
          
          <div className="bg-background/60 backdrop-blur rounded-xl p-6 border shadow-sm">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Regex Tester</h3>
            <p className="text-muted-foreground">
              Test regex patterns with real-time matching, capture groups, and detailed results
            </p>
          </div>
          
          <div className="bg-background/60 backdrop-blur rounded-xl p-6 border shadow-sm">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">File Support</h3>
            <p className="text-muted-foreground">
              Upload files or paste text directly. Download results in your preferred format
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <HelpCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
        </div>
        
        <div className="space-y-6">
          <div className="bg-background/60 backdrop-blur rounded-xl p-6 border">
            <h3 className="text-lg font-semibold mb-2">What file formats are supported?</h3>
            <p className="text-muted-foreground">
              Our tools support JSON, YAML, CSV, and plain text files. You can upload files up to 10MB or paste content directly into the editor.
            </p>
          </div>
          
          <div className="bg-background/60 backdrop-blur rounded-xl p-6 border">
            <h3 className="text-lg font-semibold mb-2">Is my data secure and private?</h3>
            <p className="text-muted-foreground">
              Yes! All processing happens entirely in your browser. No data is uploaded to our servers, ensuring complete privacy and security for your sensitive information.
            </p>
          </div>
          
          <div className="bg-background/60 backdrop-blur rounded-xl p-6 border">
            <h3 className="text-lg font-semibold mb-2">How do I convert between different formats?</h3>
            <p className="text-muted-foreground">
              Use the dedicated converter tabs to transform data between JSON and CSV formats. The tool automatically detects your input format and provides intelligent conversion options.
            </p>
          </div>
          
          <div className="bg-background/60 backdrop-blur rounded-xl p-6 border">
            <h3 className="text-lg font-semibold mb-2">What regex features are supported?</h3>
            <p className="text-muted-foreground">
              Our regex tester supports all JavaScript regex features including global matching, case-insensitive matching, multiline mode, capture groups, and named groups with real-time highlighting.
            </p>
          </div>
        </div>
      </div>

      {/* How-to Guide */}
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How to Use Text Data Utilities</h2>
          <p className="text-lg text-muted-foreground">
            Step-by-step guide for each tool in our comprehensive suite
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">JSON Formatter</h3>
            <ol className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">1</span>
                <span>Paste your JSON data or upload a .json file</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">2</span>
                <span>Click "Format" to beautify and validate</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">3</span>
                <span>Copy formatted result or download as file</span>
              </li>
            </ol>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">CSV Converter</h3>
            <ol className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">1</span>
                <span>Upload CSV file or paste CSV data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">2</span>
                <span>Choose conversion options (headers, delimiters)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">3</span>
                <span>Convert to JSON or format as clean CSV</span>
              </li>
            </ol>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Regex Tester</h3>
            <ol className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">1</span>
                <span>Enter your regex pattern with flags</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">2</span>
                <span>Add test string to match against</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">3</span>
                <span>View real-time matches and capture groups</span>
              </li>
            </ol>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">YAML Formatter</h3>
            <ol className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">1</span>
                <span>Paste YAML content or upload .yaml file</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">2</span>
                <span>Click "Format" to validate and indent</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">3</span>
                <span>Download formatted YAML or copy to clipboard</span>
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* Pro Tips */}
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-indigo-600/10 rounded-2xl p-8 border">
          <h2 className="text-2xl font-bold mb-6 text-center">Pro Tips for Text Data Processing</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-purple-600 dark:text-purple-400">JSON Best Practices</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Use consistent indentation (2-4 spaces)</li>
                <li>• Validate JSON before using in applications</li>
                <li>• Use meaningful key names for clarity</li>
                <li>• Avoid deeply nested structures when possible</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-blue-600 dark:text-blue-400">CSV Optimization</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Always include headers for clarity</li>
                <li>• Use consistent delimiters throughout</li>
                <li>• Escape special characters properly</li>
                <li>• Test with various spreadsheet applications</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-indigo-600 dark:text-indigo-400">Regex Efficiency</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Use specific patterns over greedy matching</li>
                <li>• Test with edge cases and empty strings</li>
                <li>• Escape special characters when matching literals</li>
                <li>• Use named groups for complex patterns</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-orange-600 dark:text-orange-400">YAML Guidelines</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Maintain consistent indentation levels</li>
                <li>• Use descriptive keys and comments</li>
                <li>• Validate syntax before deployment</li>
                <li>• Be careful with special YAML characters</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
