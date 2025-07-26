'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

import HeroSection from '@/components/hero-section';
import ToolsGrid from '@/components/tools-grid';
import FeaturesSection from '@/components/features-section';
import StructuredData from '@/components/seo/structured-data';
import { TOOL_CATEGORIES } from '@/lib/constants';
import { SchemaGenerators } from '@/lib/seo';
import { 
  Zap, 
  Users, 
  Clock, 
  Shield,
  Image,
  FileText,
  RefreshCw,
  TrendingUp,
  CheckCircle
} from 'lucide-react';

export default function HomePage() {
  const featuredTools = TOOL_CATEGORIES
    .flatMap(category => category.tools)
    .filter(tool => tool.featured);

  const totalTools = TOOL_CATEGORIES
    .flatMap(category => category.tools)
    .filter(tool => !tool.comingSoon).length;

  const stats = [
    { icon: Users, value: '50K+', label: 'Active Users', color: 'text-blue-600' },
    { icon: Clock, value: '2M+', label: 'Files Processed', color: 'text-green-600' },
    { icon: Shield, value: '99.9%', label: 'Uptime', color: 'text-purple-600' },
    { icon: Zap, value: totalTools.toString(), label: 'Tools Available', color: 'text-orange-600' }
  ];

  const highlights = [
    {
      icon: Image,
      title: 'AI-Powered Image Tools',
      description: 'Advanced background removal and format conversion with professional results',
      toolsCount: TOOL_CATEGORIES.find(cat => cat.id === 'image-editing')?.tools.filter(t => !t.comingSoon).length || 0
    },
    {
      icon: FileText,
      title: 'Complete PDF Suite',
      description: 'Edit, protect, merge, convert, and manipulate PDFs with enterprise-grade features',
      toolsCount: TOOL_CATEGORIES.find(cat => cat.id === 'pdf-tools')?.tools.filter(t => !t.comingSoon).length || 0
    },
    {
      icon: RefreshCw,
      title: 'Text & Data Processing',
      description: 'Format, convert, and analyze text data with advanced utilities and validators',
      toolsCount: TOOL_CATEGORIES.find(cat => cat.id === 'text-tools')?.tools.filter(t => !t.comingSoon).length || 0
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <main>
        <HeroSection />
        
        {/* Stats Section */}
        <section className="py-16 bg-muted/20">
          <div className="container max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 flex items-center justify-center`}>
                      <IconComponent className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Tool Categories Highlights */}
        <section className="py-20">
          <div className="container max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Professional Tools by Category
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Discover our comprehensive suite of productivity tools, organized by category to help you find exactly what you need.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              {highlights.map((highlight, index) => {
                const IconComponent = highlight.icon;
                return (
                  <motion.div
                    key={highlight.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <Card className="h-full text-center card-hover">
                      <CardHeader>
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-xl">{highlight.title}</CardTitle>
                        <Badge variant="outline" className="mx-auto">
                          {highlight.toolsCount} Tools Available
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-center mb-4">
                          {highlight.description}
                        </CardDescription>
                        <Button variant="outline" size="sm" asChild>
                          <Link href="#tools">
                            Explore Tools
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <ToolsGrid />
        <FeaturesSection />
        
        {/* Featured Tools Section */}
        {featuredTools.length > 0 && (
          <section className="py-20 bg-muted/30">
            <div className="container max-w-7xl mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl font-bold mb-4">Most Popular Tools</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Try our most popular productivity tools, trusted by thousands of users worldwide.
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredTools.slice(0, 6).map((tool, index) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full card-hover group">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span>{tool.name}</span>
                          </CardTitle>
                          <Badge variant="secondary">Popular</Badge>
                        </div>
                        <CardDescription>{tool.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button asChild className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                          <Link href={tool.href}>
                            Try {tool.name}
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Enhanced CTA Section */}
        <section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-indigo-950/20">
          <div className="container max-w-7xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto"
            >
              <div className="flex items-center justify-center mb-6">
                <TrendingUp className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to boost your productivity?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Join thousands of professionals who use our tools daily to streamline their workflow 
                and get more done in less time. Start with any tool - they're all free forever.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" asChild>
                  <Link href="/tools/background-removal">
                    Start with AI Background Removal
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#tools">
                    Browse All {totalTools} Tools
                  </Link>
                </Button>
              </div>
              
              <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Always Free</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>No Registration</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Privacy First</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* SEO Structured Data */}
      <StructuredData 
        data={[
          // Main page breadcrumb
          SchemaGenerators.breadcrumbList([
            { name: 'Home', url: '/' }
          ]),
          // Service schemas for each category
          ...TOOL_CATEGORIES.map(category => SchemaGenerators.service(category)),
          // Software application schemas for featured tools
          ...featuredTools.slice(0, 6).map(tool => {
            const category = TOOL_CATEGORIES.find(cat => 
              cat.tools.some(t => t.id === tool.id)
            );
            return SchemaGenerators.softwareApplication(tool, category?.id || '');
          })
        ]} 
      />
    </div>
  );
}
