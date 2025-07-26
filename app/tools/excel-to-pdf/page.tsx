
import { Metadata } from 'next';
import ExcelToPdfConverter from '@/components/excel-to-pdf-converter';

export const metadata: Metadata = {
  title: 'Excel to PDF Converter - ProductivityHub',
  description: 'Convert Excel files (.xlsx, .xls, .csv) to high-quality PDF format with advanced formatting options.',
  keywords: 'excel to pdf, xlsx to pdf, spreadsheet converter, file conversion, pdf generator',
};

export default function ExcelToPdfPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Excel to PDF Converter
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Convert your Excel spreadsheets to professional PDF documents with perfect formatting and layout preservation
          </p>
        </div>

        {/* Main Tool */}
        <ExcelToPdfConverter />

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Perfect Formatting</h3>
            <p className="text-muted-foreground">Preserves all Excel formatting including fonts, colors, borders, and cell alignment</p>
          </div>

          <div className="text-center p-6 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Fast Processing</h3>
            <p className="text-muted-foreground">Quick conversion with optimized algorithms for both small and large spreadsheets</p>
          </div>

          <div className="text-center p-6 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
            <p className="text-muted-foreground">Files are processed securely and automatically deleted after conversion</p>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-12 p-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">💡 Pro Tips</h3>
          <ul className="text-blue-800 dark:text-blue-200 space-y-2">
            <li>• <strong>Multiple Sheets:</strong> All sheets in your Excel file will be converted to separate pages</li>
            <li>• <strong>Best Results:</strong> Use standard fonts and avoid extremely wide tables for optimal PDF layout</li>
            <li>• <strong>File Size:</strong> Large files may take longer to process but will maintain full quality</li>
            <li>• <strong>Formatting:</strong> Charts, images, and conditional formatting are preserved in the PDF</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
