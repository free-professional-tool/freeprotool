

import { Metadata } from 'next';
import PdfMergeConverter from '@/components/pdf-merge-converter';

export const metadata: Metadata = {
  title: 'PDF Merge - Combine Multiple PDFs - ProductivityHub',
  description: 'Merge multiple PDF files into a single document while preserving formatting and quality. Fast, secure, and easy to use.',
  keywords: 'pdf merge, combine pdf, pdf joiner, merge documents, pdf merger tool',
};

export default function PdfMergePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            PDF Merge Tool
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Combine multiple PDF files into a single document with perfect formatting preservation and customizable merge options
          </p>
        </div>

        {/* Main Tool */}
        <PdfMergeConverter />

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Drag & Reorder</h3>
            <p className="text-muted-foreground">Easily reorder your PDF files by dragging them to set the perfect merge sequence</p>
          </div>

          <div className="text-center p-6 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Quality Preserved</h3>
            <p className="text-muted-foreground">Maintains original PDF quality, formatting, fonts, and embedded content</p>
          </div>

          <div className="text-center p-6 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
            <p className="text-muted-foreground">Quick processing with optimized algorithms for both small and large files</p>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-12 p-6 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
          <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-3">💡 Pro Tips</h3>
          <ul className="text-purple-800 dark:text-purple-200 space-y-2">
            <li>• <strong>File Order:</strong> Drag and drop files to reorder them before merging</li>
            <li>• <strong>Multiple Uploads:</strong> Select multiple PDF files at once or add them one by one</li>
            <li>• <strong>Large Files:</strong> Each PDF can be up to 50MB, with 200MB total limit</li>
            <li>• <strong>Bookmarks:</strong> Enable bookmark preservation to maintain document navigation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
