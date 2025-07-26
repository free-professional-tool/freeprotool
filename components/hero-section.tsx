
'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Zap, ArrowRight, Image, FileText, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-indigo-950/20">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 right-0 w-60 h-60 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-20 left-0 w-60 h-60 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-20 left-1/3 w-60 h-60 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium"
              >
                <Zap className="w-4 h-4" />
                <span>Professional Tools, Zero Cost</span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
              >
                Supercharge Your
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {" "}Productivity
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-muted-foreground max-w-lg"
              >
                Professional-grade tools for image editing, document processing, and workflow optimization. 
                Free, fast, and accessible from any device.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" asChild>
                <Link href="/tools/background-removal">
                  Try Background Removal
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#tools">
                  Explore All Tools
                </Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-8 pt-8 border-t border-border/50"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Images Processed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">Free</div>
                <div className="text-sm text-muted-foreground">Forever</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Tool Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 border">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                  <Image className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">Background Removal</span>
                  <span className="ml-auto text-green-600 text-sm">Active</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg opacity-60">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Text Tools</span>
                  <span className="ml-auto text-orange-600 text-sm">Coming Soon</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg opacity-60">
                  <RefreshCw className="w-5 h-5 text-indigo-600" />
                  <span className="font-medium">File Converters</span>
                  <span className="ml-auto text-orange-600 text-sm">Coming Soon</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Processing Speed</span>
                  <span className="text-sm text-muted-foreground">~2-5 seconds</span>
                </div>
                <div className="mt-2 w-full bg-white dark:bg-gray-800 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                    transition={{ delay: 1, duration: 2 }}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                  ></motion.div>
                </div>
              </div>
            </div>
            
            {/* Floating Icons */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-2 right-2 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <Image className="w-6 h-6 text-white" />
            </motion.div>
            
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              className="absolute bottom-2 left-2 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <Zap className="w-6 h-6 text-white" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
