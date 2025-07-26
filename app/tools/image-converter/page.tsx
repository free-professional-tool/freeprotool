

import ImageFormatConverter from '@/components/image-format-converter';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image Format Converter - Convert JPG, PNG, WebP, GIF, BMP & More',
  description: 'Convert images between all major formats including JPG, PNG, WebP, GIF, BMP, TIFF, ICO. Fast, secure, client-side processing with quality control.',
  keywords: 'image converter, format converter, JPG to PNG, PNG to WebP, image format conversion, online image converter, free image converter',
  openGraph: {
    title: 'Image Format Converter - Convert Any Image Format',
    description: 'Convert images between all major formats with quality control. 100% client-side processing.',
    type: 'website',
  },
};

// Structured Data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Image Format Converter",
  "description": "Convert images between different formats including JPG, PNG, WebP, GIF, BMP, and more",
  "url": "https://productivityhub.com/tools/image-converter",
  "applicationCategory": "ImageApplication",
  "operatingSystem": "Any",
  "permissions": "none",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "Convert between JPG, PNG, WebP, GIF, BMP, ICO formats",
    "Quality control and compression options",
    "Batch conversion support",
    "Client-side processing for privacy",
    "No file size limits"
  ]
};

export default function ImageConverterPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <main className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mr-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Image Format Converter
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Convert images between all major formats with precision and control. Support for JPG, PNG, WebP, GIF, BMP, ICO and more.
            All processing happens in your browser - secure, fast, and private.
          </p>
        </div>

        {/* Tool Component */}
        <ImageFormatConverter />

        {/* Supported Formats Section */}
        <section className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-8">Supported Formats</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'JPEG', ext: 'JPG', color: 'bg-red-500', desc: 'Best for photos' },
              { name: 'PNG', ext: 'PNG', color: 'bg-blue-500', desc: 'Supports transparency' },
              { name: 'WebP', ext: 'WebP', color: 'bg-green-500', desc: 'Modern web format' },
              { name: 'GIF', ext: 'GIF', color: 'bg-yellow-500', desc: 'Animated images' },
              { name: 'BMP', ext: 'BMP', color: 'bg-purple-500', desc: 'Uncompressed format' },
              { name: 'ICO', ext: 'ICO', color: 'bg-indigo-500', desc: 'Icon files' }
            ].map((format, index) => (
              <div key={index} className="text-center p-4 border rounded-lg bg-card hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 ${format.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                  <span className="text-white font-bold text-sm">{format.ext}</span>
                </div>
                <h3 className="font-semibold mb-1">{format.name}</h3>
                <p className="text-xs text-muted-foreground">{format.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 border rounded-lg bg-card">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Lightning Fast</h3>
            <p className="text-muted-foreground text-sm">
              Client-side conversion means instant results with no server delays or uploads required
            </p>
          </div>

          <div className="text-center p-6 border rounded-lg bg-card">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">100% Secure & Private</h3>
            <p className="text-muted-foreground text-sm">
              Your images never leave your device. All conversion happens locally in your browser
            </p>
          </div>

          <div className="text-center p-6 border rounded-lg bg-card">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Perfect Quality Control</h3>
            <p className="text-muted-foreground text-sm">
              Adjust compression levels and quality settings to get the exact file size you need
            </p>
          </div>
        </section>

        {/* How to Use Section */}
        <section className="mt-20 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">How to Convert Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">1</div>
              <h3 className="font-semibold mb-2">Upload Image</h3>
              <p className="text-sm text-muted-foreground">Select or drag & drop your image file</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">2</div>
              <h3 className="font-semibold mb-2">Choose Format</h3>
              <p className="text-sm text-muted-foreground">Select your desired output format</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">3</div>
              <h3 className="font-semibold mb-2">Adjust Quality</h3>
              <p className="text-sm text-muted-foreground">Fine-tune compression and quality settings</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">4</div>
              <h3 className="font-semibold mb-2">Download</h3>
              <p className="text-sm text-muted-foreground">Get your converted image instantly</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">What image formats are supported?</h3>
                <p className="text-muted-foreground text-sm">
                  We support all major formats including JPEG/JPG, PNG, WebP, GIF, BMP, TIFF, SVG, and ICO. 
                  You can convert between any of these formats.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Is there a file size limit?</h3>
                <p className="text-muted-foreground text-sm">
                  We support files up to 20MB. Since processing happens in your browser, 
                  larger files may take longer but are handled efficiently.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">How does the quality slider work?</h3>
                <p className="text-muted-foreground text-sm">
                  The quality slider controls compression levels. Higher values (closer to 1.0) 
                  maintain better quality but create larger files. Lower values reduce file size.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Are my images uploaded anywhere?</h3>
                <p className="text-muted-foreground text-sm">
                  No! All conversion happens locally in your browser. Your images never leave your device, 
                  ensuring complete privacy and security.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Can I convert multiple images at once?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes! Our batch conversion feature allows you to process multiple images 
                  with the same settings simultaneously.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Which format is best for web use?</h3>
                <p className="text-muted-foreground text-sm">
                  WebP offers the best compression for web use. PNG is ideal for images requiring transparency, 
                  while JPEG works best for photographs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pro Tips Section */}
        <section className="mt-16 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/10 dark:to-teal-900/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Pro Tips for Image Conversion</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <p><strong>Choose WebP for modern browsers:</strong> 25-35% smaller than JPEG with same quality</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <p><strong>Use PNG for logos and graphics:</strong> Perfect for images with transparency</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <p><strong>JPEG for photographs:</strong> Best compression for photos with many colors</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 flex-shrink-0"></div>
                <p><strong>Quality 0.8-0.9 is usually optimal:</strong> Great balance between size and quality</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 flex-shrink-0"></div>
                <p><strong>Convert GIF to WebP:</strong> Significantly reduce animated file sizes</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 flex-shrink-0"></div>
                <p><strong>Use ICO for favicons:</strong> Best browser compatibility for website icons</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
