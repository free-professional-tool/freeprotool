
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TOOL_CATEGORIES } from '@/lib/constants';
import { Image, FileText, FileType, RefreshCw, Scissors, Maximize2, Archive, Hash, Type } from 'lucide-react';
import Link from 'next/link';

const iconMap = {
  Image,
  FileText,
  FileType,
  RefreshCw,
  Scissors,
  Maximize2,
  Archive,
  Hash,
  Type,
  Combine: RefreshCw,
  Split: RefreshCw
};

export default function ToolsGrid() {
  return (
    <section id="tools" className="py-20 bg-background">
      <div className="container max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Professional Tools for Every Need
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive suite of productivity tools designed to streamline your workflow 
            and enhance your creative process.
          </p>
        </motion.div>

        <div className="space-y-16">
          {TOOL_CATEGORIES.map((category, categoryIndex) => {
            const CategoryIcon = iconMap[category.icon as keyof typeof iconMap] || FileText;
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.2 }}
                className="space-y-8"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                      <CategoryIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold flex items-center space-x-3">
                        <span>{category.name}</span>
                        {category.comingSoon && (
                          <Badge variant="secondary" className="text-xs">
                            Coming Soon
                          </Badge>
                        )}
                      </h3>
                      <p className="text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.tools.map((tool: any, toolIndex: number) => {
                    const ToolIcon = iconMap[tool.icon as keyof typeof iconMap] || FileText;
                    
                    return (
                      <motion.div
                        key={tool.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (categoryIndex * 0.2) + (toolIndex * 0.1) }}
                      >
                        <Card className={`h-full card-hover group ${category.comingSoon || tool.comingSoon ? 'opacity-60' : ''}`}>
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                  <ToolIcon className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                  <CardTitle className="text-lg">{tool.name}</CardTitle>
                                  {tool.featured && (
                                    <Badge variant="secondary" className="text-xs mt-1">
                                      Popular
                                    </Badge>
                                  )}
                                  {tool.comingSoon && (
                                    <Badge variant="outline" className="text-xs mt-1">
                                      Coming Soon
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <CardDescription className="mt-2">
                              {tool.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            {category.comingSoon || tool.comingSoon ? (
                              <Button 
                                variant="outline" 
                                className="w-full" 
                                disabled
                              >
                                Coming Soon
                              </Button>
                            ) : (
                              <Button 
                                asChild 
                                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                              >
                                <Link href={tool.href}>
                                  Try {tool.name}
                                </Link>
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
