

import ImageSteganographyTool from '@/components/image-steganography-tool';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image Steganography Tool - Hide & Extract Secret Messages',
  description: 'Hide secret messages in images and extract hidden text using advanced steganography. Secure, private, and completely client-side processing.',
  keywords: 'steganography, hide message, secret message, image encryption, LSB steganography, data hiding',
};

export default function ImageSteganographyPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mr-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Image Steganography
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Hide secret messages within images or extract hidden text using advanced LSB steganography. 
            All processing happens securely in your browser - no data ever leaves your device.
          </p>
        </div>

        {/* Tool Component */}
        <ImageSteganographyTool />

        {/* Features Section */}
        <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 border rounded-lg bg-card">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Invisible & Secure</h3>
            <p className="text-muted-foreground text-sm">
              Messages are hidden using LSB steganography, making them completely invisible to the naked eye
            </p>
          </div>

          <div className="text-center p-6 border rounded-lg bg-card">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Lightning Fast</h3>
            <p className="text-muted-foreground text-sm">
              Client-side processing ensures instant results with no server delays
            </p>
          </div>

          <div className="text-center p-6 border rounded-lg bg-card">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">100% Private</h3>
            <p className="text-muted-foreground text-sm">
              No uploads, no tracking - your images and messages stay completely private
            </p>
          </div>
        </section>

        {/* Pro Tips Section */}
        <section className="mt-16 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Pro Tips for Steganography</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <p><strong>Choose high-resolution images:</strong> Larger images can hide more text and maintain better quality</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <p><strong>Use PNG format:</strong> PNG preserves exact pixel values, ensuring message integrity</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <p><strong>Keep messages concise:</strong> Shorter messages have less impact on image quality</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p><strong>Avoid JPEG compression:</strong> JPEG compression can corrupt hidden messages</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p><strong>Test your images:</strong> Always verify extraction works before sharing</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p><strong>Complex images work best:</strong> Images with varied colors hide changes better</p>
              </div>
            </div>
          </div>
        </section>

        {/* Supported formats */}
        <section className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Supported Formats</h2>
          <div className="flex justify-center space-x-8 text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded flex items-center justify-center">
                <span className="text-orange-600 font-semibold text-xs">PNG</span>
              </div>
              <span>PNG (Recommended)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-xs">JPG</span>
              </div>
              <span>JPEG</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded flex items-center justify-center">
                <span className="text-green-600 font-semibold text-xs">WebP</span>
              </div>
              <span>WebP</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
