
import { Metadata } from 'next';
import { Globe, Zap, Shield, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import UrlToPdfConverter from '@/components/url-to-pdf-converter';

export const metadata: Metadata = {
  title: 'URL to PDF - Convert Any Website to PDF | ProductivityHub',
  description: 'Convert any website to high-quality PDF format. Perfect formatting, fast processing, and secure conversion.',
};

export default function UrlToPdfPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-6">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            URL to PDF Converter
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform any website into a professional PDF document with perfect formatting and high quality
          </p>
        </div>

        {/* Main Converter */}
        <div className="mb-12">
          <UrlToPdfConverter />
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">
                Convert websites to PDF in seconds with our optimized processing engine
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-gray-600">
                All processing happens on our secure servers. No data is stored permanently
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Perfect Quality</h3>
              <p className="text-gray-600">
                Maintains original website layout, images, and styling in PDF format
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pro Tips Section */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-gray-100">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Pro Tips</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">
                    <strong>Full URLs work best:</strong> Include "https://" for optimal results
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">
                    <strong>Wait for content:</strong> Enable "Wait for network idle" for JavaScript-heavy sites
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">
                    <strong>Choose the right format:</strong> A4 Portrait works for most websites
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">
                    <strong>Include backgrounds:</strong> Enable for websites with colored backgrounds
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
