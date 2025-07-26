
import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                ProductivityHub
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md">
              Professional productivity tools for creators, businesses, and individuals. 
              Free, fast, and secure online tools accessible from any device.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h3 className="font-semibold mb-4">Popular Tools</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tools/background-removal" className="text-muted-foreground hover:text-primary transition-colors">
                  Background Removal
                </Link>
              </li>
              <li>
                <span className="text-muted-foreground">
                  Image Resize <span className="text-xs">(Soon)</span>
                </span>
              </li>
              <li>
                <span className="text-muted-foreground">
                  PDF Tools <span className="text-xs">(Soon)</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 ProductivityHub. Built with Next.js and modern web technologies.</p>
        </div>
      </div>
    </footer>
  );
}
