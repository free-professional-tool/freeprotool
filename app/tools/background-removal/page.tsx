

import BackgroundRemovalTool from '@/components/background-removal-tool';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Background Removal Tool - Remove Image Backgrounds Instantly',
  description: 'Remove backgrounds from images instantly using AI. Free online tool with high-quality results. Support for PNG, JPG, and WebP formats.',
  keywords: 'background removal, remove background, image editing, AI background removal, transparent background',
};

export default function BackgroundRemovalPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AI Background Removal
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Remove backgrounds from your images instantly using advanced AI technology. 
            Perfect for e-commerce, portraits, and creative projects.
          </p>
        </div>

        {/* Tool Component */}
        <BackgroundRemovalTool />

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
              Process images in seconds with our optimized AI algorithms
            </p>
          </div>

          <div className="text-center p-6 border rounded-lg bg-card">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">High Quality</h3>
            <p className="text-muted-foreground text-sm">
              Precision edge detection for professional-grade results
            </p>
          </div>

          <div className="text-center p-6 border rounded-lg bg-card">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Secure & Private</h3>
            <p className="text-muted-foreground text-sm">
              Your images are processed securely and never stored
            </p>
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
              <span>PNG</span>
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
