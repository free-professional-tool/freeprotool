

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Users, Target, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            About ProductivityHub
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're building the future of online productivity tools, making professional-grade 
            features accessible to everyone, everywhere.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-purple-600" />
                <span>Our Mission</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To democratize access to professional productivity tools by providing free, 
                fast, and secure online solutions that work seamlessly across all devices.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-600" />
                <span>Our Values</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Privacy-first design, user-centric development, and a commitment to keeping 
                essential tools free forever. Your success is our success.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h2>Why ProductivityHub?</h2>
          <p>
            In today's digital world, productivity shouldn't be limited by expensive software 
            or complicated installations. We believe everyone deserves access to professional-grade 
            tools that help them create, edit, and optimize their work efficiently.
          </p>

          <h3>What Makes Us Different</h3>
          <ul>
            <li><strong>Privacy First:</strong> Your files are processed securely and never stored on our servers</li>
            <li><strong>No Installation Required:</strong> Everything runs in your browser with cutting-edge technology</li>
            <li><strong>Mobile Optimized:</strong> Full functionality on any device, anywhere</li>
            <li><strong>Always Free:</strong> Core features remain free forever, no hidden costs</li>
          </ul>

          <h3>Our Technology</h3>
          <p>
            Built with modern web technologies including Next.js, React, and advanced AI APIs, 
            ProductivityHub delivers desktop-quality performance right in your browser. 
            We continuously update our tools to leverage the latest advances in artificial intelligence 
            and web performance.
          </p>

          <h3>Looking Forward</h3>
          <p>
            We're constantly expanding our toolkit based on user feedback and emerging needs. 
            From image editing to document processing and beyond, our goal is to become your 
            go-to destination for all productivity needs.
          </p>
        </div>
      </main>
    </div>
  );
}
