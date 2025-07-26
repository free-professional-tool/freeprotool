
'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit3, FileText, Layers, Settings, Zap, Shield, Globe } from 'lucide-react';
import PdfEditorSuite from '@/components/pdf-editor-suite';

export default function PdfEditorPage() {
  useEffect(() => {
    // Set dynamic meta tags
    document.title = 'Advanced PDF Editor - Professional PDF Editing Tools | ProductivityHub';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Professional PDF editor with annotations, markup, drawing tools, page management, and comprehensive editing features. Edit PDFs online with our advanced editor.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5" />
        <div className="relative container max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6">
              <Edit3 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6">
              Advanced PDF Editor
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Professional-grade PDF editing with comprehensive annotation tools, markup features, drawing capabilities, and advanced page management. Edit PDFs like a pro with our full-featured editor.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Editor Component */}
      <div className="container max-w-7xl mx-auto px-4 pb-16">
        <PdfEditorSuite />
      </div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="py-16 bg-white"
      >
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Professional PDF Editing Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Complete Annotation Suite</h3>
              <p className="text-gray-600">
                Add text, highlights, underlines, strikeouts, shapes, arrows, and freehand drawings with full customization options.
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-600 rounded-xl mb-4">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Advanced Layer System</h3>
              <p className="text-gray-600">
                Organize annotations in separate layers with visibility controls, opacity settings, and layer-based editing.
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-600 rounded-xl mb-4">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Page Management</h3>
              <p className="text-gray-600">
                Rotate, delete, duplicate, and rearrange pages with drag-and-drop interface and batch operations.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Advanced Features */}
      <div className="py-16 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Advanced Editing Capabilities
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white rounded-xl shadow-sm border">
              <Zap className="w-8 h-8 text-yellow-600 mb-3" />
              <h3 className="font-semibold mb-2">Real-time Editing</h3>
              <p className="text-sm text-gray-600">Instant feedback and live preview of all changes</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border">
              <Shield className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-semibold mb-2">Secure Processing</h3>
              <p className="text-sm text-gray-600">All editing happens locally in your browser</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border">
              <Globe className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-semibold mb-2">Cross-Platform</h3>
              <p className="text-sm text-gray-600">Works on all devices and operating systems</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border">
              <FileText className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-semibold mb-2">Export Options</h3>
              <p className="text-sm text-gray-600">Save as PDF or export annotations separately</p>
            </div>
          </div>
        </div>
      </div>

      {/* How-to Guide */}
      <div className="py-16 bg-white">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How to Use the PDF Editor</h2>
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">1</div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Upload Your PDF</h3>
                <p className="text-gray-600">Select or drag-and-drop your PDF file to begin editing. Files are processed locally for security.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">2</div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Choose Your Tools</h3>
                <p className="text-gray-600">Select from text annotation, highlighting, drawing tools, shapes, stamps, and more from the comprehensive toolbar.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">3</div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Edit and Annotate</h3>
                <p className="text-gray-600">Add annotations, markup text, draw shapes, insert images, and manage pages with intuitive controls.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">4</div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Save Your Work</h3>
                <p className="text-gray-600">Download your edited PDF with all annotations embedded or export annotations separately for collaboration.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-gray-50">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border">
              <h3 className="text-lg font-semibold mb-3">What editing features are available?</h3>
              <p className="text-gray-600">
                Our PDF editor includes text annotations, highlighting, underlining, strikeout, shapes (rectangles, circles, lines, arrows), 
                freehand drawing, stamps, image insertion, page management (rotate, delete, rearrange), and advanced layer control.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border">
              <h3 className="text-lg font-semibold mb-3">Is my PDF processed securely?</h3>
              <p className="text-gray-600">
                Yes, all PDF editing happens entirely in your browser using client-side processing. Your files never leave your device, 
                ensuring complete privacy and security of your documents.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border">
              <h3 className="text-lg font-semibold mb-3">What file formats are supported?</h3>
              <p className="text-gray-600">
                The editor supports standard PDF files up to 100MB. You can save your edited document as a PDF with embedded annotations 
                or export annotation data separately for collaboration purposes.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border">
              <h3 className="text-lg font-semibold mb-3">Can I undo and redo changes?</h3>
              <p className="text-gray-600">
                Yes, the editor includes a comprehensive undo/redo system that tracks all your changes, allowing you to easily revert 
                or restore modifications throughout your editing session.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border">
              <h3 className="text-lg font-semibold mb-3">How do layers work in the editor?</h3>
              <p className="text-gray-600">
                Annotations are organized into separate layers (content, annotations, drawings, stamps) that can be individually controlled 
                for visibility, opacity, and editing. This allows for organized, professional document editing.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border">
              <h3 className="text-lg font-semibold mb-3">What browsers are supported?</h3>
              <p className="text-gray-600">
                The PDF editor works in all modern browsers including Chrome, Firefox, Safari, and Edge. For best performance, 
                we recommend using the latest version of your preferred browser.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Advanced PDF Editor",
            "description": "Professional PDF editor with comprehensive annotation tools, markup features, drawing capabilities, and page management",
            "url": "https://productivityhub.com/tools/pdf-editor",
            "applicationCategory": "ProductivityApplication",
            "operatingSystem": "Any",
            "permissions": "browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "Text annotations and markup",
              "Drawing tools and shapes",
              "Page management and organization",
              "Layer-based editing system",
              "Secure client-side processing",
              "Professional export options"
            ]
          })
        }}
      />
    </div>
  );
}
