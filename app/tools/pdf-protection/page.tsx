
'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Unlock, GitCompare, Droplets, Edit3, Settings } from 'lucide-react';
import { useEffect } from 'react';
import PdfProtectionSuite from '@/components/pdf-protection-suite';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PDF Protection Suite',
  description: 'Comprehensive PDF security and utility tools for protecting, comparing, and managing PDF documents',
  url: 'https://productivityhub.com/tools/pdf-protection',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  permissions: 'browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD'
  },
  featureList: [
    'Password Protection',
    'PDF Unlocking',
    'Document Comparison',
    'Watermarking',
    'Metadata Editing',
    'Permission Management'
  ],
  provider: {
    '@type': 'Organization',
    name: 'ProductivityHub',
    url: 'https://productivityhub.com'
  }
};

export default function PdfProtectionPage() {
  useEffect(() => {
    // Set document title and meta tags dynamically
    document.title = 'PDF Protection Suite - Secure, Compare & Edit PDF Files | ProductivityHub';
    
    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Comprehensive PDF security and utility tools. Password protect PDFs, unlock encrypted files, compare documents, add watermarks, edit metadata, and set permissions. Free online PDF protection suite.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Comprehensive PDF security and utility tools. Password protect PDFs, unlock encrypted files, compare documents, add watermarks, edit metadata, and set permissions. Free online PDF protection suite.';
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <Shield className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              PDF Protection Suite
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Comprehensive PDF security and utility tools. Protect with passwords, compare documents, 
              add watermarks, edit metadata, and manage permissions - all processed securely in your browser.
            </p>
          </motion.div>

          {/* Tool Component */}
          <PdfProtectionSuite />

          {/* Features Overview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <Lock className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Password Protection</h3>
              </div>
              <p className="text-gray-600">
                Secure your PDFs with strong password encryption. Choose between standard 128-bit 
                or high-security 256-bit AES encryption levels.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <Unlock className="w-8 h-8 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">PDF Unlocking</h3>
              </div>
              <p className="text-gray-600">
                Remove password protection from PDFs when you have the correct password. 
                Safely unlock encrypted documents for easier access.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <GitCompare className="w-8 h-8 text-purple-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Document Comparison</h3>
              </div>
              <p className="text-gray-600">
                Compare two PDF documents to identify differences in content, metadata, 
                or structure. Get detailed comparison reports.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <Droplets className="w-8 h-8 text-cyan-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Watermarking</h3>
              </div>
              <p className="text-gray-600">
                Add custom text watermarks, timestamps, or predefined stamps to your PDFs. 
                Control position, opacity, rotation, and styling.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <Edit3 className="w-8 h-8 text-orange-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Metadata Editor</h3>
              </div>
              <p className="text-gray-600">
                View and edit PDF metadata including title, author, subject, keywords, 
                creation date, and other document properties.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <Settings className="w-8 h-8 text-red-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Permission Control</h3>
              </div>
              <p className="text-gray-600">
                Set granular permissions for printing, copying, editing, annotations, 
                and form filling. Control how users can interact with your PDFs.
              </p>
            </div>
          </motion.div>

          {/* Security Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Security & Privacy First
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Client-Side Processing</h3>
                <p className="text-gray-600">
                  All PDF operations are performed directly in your browser. Your documents 
                  never leave your computer, ensuring complete privacy and security.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Professional Encryption</h3>
                <p className="text-gray-600">
                  We use industry-standard AES encryption (128-bit and 256-bit) to protect 
                  your PDFs, meeting enterprise security requirements.
                </p>
              </div>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  How secure is PDF password protection?
                </h3>
                <p className="text-gray-600">
                  Our PDF protection uses industry-standard AES encryption. Standard mode uses 
                  128-bit encryption, while High mode uses 256-bit AES encryption, providing 
                  enterprise-level security for your documents.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  What permissions can I restrict on PDFs?
                </h3>
                <p className="text-gray-600">
                  You can control printing, content modification, copying, annotations, form filling, 
                  accessibility features, document assembly, and high-quality printing permissions.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  How does PDF comparison work?
                </h3>
                <p className="text-gray-600">
                  Our comparison tool analyzes text content, metadata, document structure, and visual 
                  elements to identify differences between two PDFs, providing detailed reports with 
                  similarity percentages.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Are my PDF files stored on your servers?
                </h3>
                <p className="text-gray-600">
                  No, all processing happens directly in your browser. Your PDF files never leave 
                  your computer, ensuring complete privacy and security for sensitive documents.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  What watermark options are available?
                </h3>
                <p className="text-gray-600">
                  You can add custom text, timestamps, or predefined stamps (Confidential, Draft, 
                  Approved). Control position, opacity, rotation, font size, color, and page ranges.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Can I edit existing PDF metadata?
                </h3>
                <p className="text-gray-600">
                  Yes, you can view and edit all standard PDF metadata fields including title, 
                  author, subject, keywords, creator, and producer information.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Use Cases */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Perfect For
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Legal Documents</h3>
                <p className="text-sm text-gray-600">Secure contracts, agreements, and legal papers</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Financial Reports</h3>
                <p className="text-sm text-gray-600">Protect sensitive financial information</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <GitCompare className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Document Review</h3>
                <p className="text-sm text-gray-600">Compare versions and track changes</p>
              </div>
              
              <div className="text-center">
                <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Droplets className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Brand Protection</h3>
                <p className="text-sm text-gray-600">Add watermarks and prevent unauthorized use</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
