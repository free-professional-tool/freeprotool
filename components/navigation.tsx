
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Image, 
  FileText, 
  FileType, 
  RefreshCw, 
  Menu, 
  X,
  Zap,
  FileSpreadsheet,
  Combine,
  Split,
  Globe,
  Shield,
  Code2,
  Hash,
  Type,
  GitCompare,
  Edit3,
  ChevronDown
} from 'lucide-react';
import { TOOL_CATEGORIES } from '@/lib/constants';
import NextImage from 'next/image';

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const iconMap = {
    Home,
    Image,
    FileText,
    FileType,
    RefreshCw,
    Zap,
    FileSpreadsheet,
    Combine,
    Split,
    Globe,
    Shield,
    Code2,
    Hash,
    Type,
    GitCompare,
    Edit3
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-10 h-10">
              <NextImage
                src="/logo-with-text.png"
                alt="Free ProfessionalTool Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent hidden sm:block">
              Free ProfessionalTool
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Home
            </Link>
            
            {TOOL_CATEGORIES.map((category) => {
              const IconComponent = iconMap[category.icon as keyof typeof iconMap] || FileText;
              
              return (
                <div key={category.id} className="relative group">
                  <Button 
                    variant="ghost" 
                    className="text-sm font-medium h-auto p-2 hover:text-primary"
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {category.name}
                    {category.comingSoon && (
                      <span className="ml-2 px-2 py-1 text-xs bg-muted rounded-full">
                        Soon
                      </span>
                    )}
                  </Button>
                  
                  {!category.comingSoon && (
                    <div className="absolute top-full left-0 mt-1 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                      <div className="bg-popover border rounded-lg shadow-lg p-4">
                        <div className="space-y-2">
                          {category.tools.filter((tool: any) => !tool.comingSoon).map((tool: any) => {
                            const ToolIcon = iconMap[tool.icon as keyof typeof iconMap] || FileText;
                            return (
                              <Link
                                key={tool.id}
                                href={tool.href}
                                className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent transition-colors"
                              >
                                <ToolIcon className="w-4 h-4 text-muted-foreground" />
                                <div>
                                  <div className="text-sm font-medium">{tool.name}</div>
                                  <div className="text-xs text-muted-foreground">{tool.description}</div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t bg-background"
            >
              <div className="py-4 space-y-2">
                <Link 
                  href="/" 
                  className="block px-4 py-3 text-sm font-medium hover:text-primary hover:bg-accent transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Home className="w-4 h-4 inline mr-2" />
                  Home
                </Link>
                
                {TOOL_CATEGORIES.map((category) => {
                  const IconComponent = iconMap[category.icon as keyof typeof iconMap] || FileText;
                  const isExpanded = expandedCategory === category.id;
                  
                  return (
                    <div key={category.id} className="px-4">
                      <button
                        onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                        className="flex items-center justify-between w-full py-3 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                        disabled={category.comingSoon}
                      >
                        <div className="flex items-center">
                          <IconComponent className="w-4 h-4 mr-2" />
                          {category.name}
                          {category.comingSoon && (
                            <span className="ml-2 px-2 py-1 text-xs bg-muted rounded-full">
                              Soon
                            </span>
                          )}
                        </div>
                        {!category.comingSoon && (
                          <ChevronDown 
                            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                          />
                        )}
                      </button>
                      
                      <AnimatePresence>
                        {!category.comingSoon && isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="ml-6 space-y-1 overflow-hidden"
                          >
                            {category.tools.filter((tool: any) => !tool.comingSoon).map((tool: any) => {
                              const ToolIcon = iconMap[tool.icon as keyof typeof iconMap] || FileText;
                              return (
                                <Link
                                  key={tool.id}
                                  href={tool.href}
                                  className="flex items-center space-x-2 py-2 text-sm hover:text-primary hover:bg-accent rounded-md transition-colors"
                                  onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setExpandedCategory(null);
                                  }}
                                >
                                  <ToolIcon className="w-4 h-4" />
                                  <span>{tool.name}</span>
                                </Link>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
