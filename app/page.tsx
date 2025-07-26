
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import HeroSection from '@/components/hero-section';
import ToolsGrid from '@/components/tools-grid';
import FeaturesSection from '@/components/features-section';
import { TOOL_CATEGORIES } from '@/lib/constants';

export default function HomePage() {
  const featuredTools = TOOL_CATEGORIES
    .flatMap(category => category.tools)
    .filter(tool => tool.featured);

  return (
    <div className="min-h-screen bg-background">
      <main>
        <HeroSection />
        <ToolsGrid />
        <FeaturesSection />
        
        {/* Featured Tools Section */}
        {featuredTools.length > 0 && (
          <section className="py-20 bg-muted/30">
            <div className="container max-w-7xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Featured Tools</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Try our most popular productivity tools, trusted by thousands of users worldwide.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredTools.map((tool, index) => (
                  <div key={tool.id}>
                    <Card className="h-full card-hover group">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center space-x-2">
                            <span>{tool.name}</span>
                          </CardTitle>
                          <Badge variant="secondary">Featured</Badge>
                        </div>
                        <CardDescription>{tool.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button asChild className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                          <Link href={tool.href}>
                            Try Now
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-20">
          <div className="container max-w-7xl mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">
                Ready to boost your productivity?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Join thousands of professionals who use our tools daily to streamline their workflow 
                and get more done in less time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/tools/background-removal">
                    Start with Background Removal
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#tools">
                    Explore All Tools
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
