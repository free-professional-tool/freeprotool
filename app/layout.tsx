
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ProductivityHub - Professional Productivity Tools',
  description: 'Free online productivity tools for image editing, text processing, PDF manipulation, and more. Professional-grade tools accessible from any device.',
  keywords: 'productivity tools, image editing, background removal, PDF tools, text tools, online tools',
  authors: [{ name: 'ProductivityHub' }],
  openGraph: {
    title: 'ProductivityHub - Professional Productivity Tools',
    description: 'Free online productivity tools for professionals and creators',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
