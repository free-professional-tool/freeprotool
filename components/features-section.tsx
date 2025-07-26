
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Shield, 
  Zap, 
  Globe, 
  Download, 
  Smartphone, 
  Lock,
  Clock,
  Heart
} from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your files are processed securely and never stored on our servers. Complete privacy guaranteed.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Advanced AI processing delivers results in seconds, not minutes. Optimized for speed and quality.',
  },
  {
    icon: Globe,
    title: 'Always Online',
    description: 'Access your tools from anywhere, anytime. Cloud-based solution with 99.9% uptime guarantee.',
  },
  {
    icon: Download,
    title: 'Instant Downloads',
    description: 'Get your processed files immediately with high-quality output in multiple formats.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly',
    description: 'Fully responsive design works seamlessly on desktop, tablet, and mobile devices.',
  },
  {
    icon: Lock,
    title: 'Secure Processing',
    description: 'Enterprise-grade security with encrypted file transfers and automatic data deletion.',
  },
  {
    icon: Clock,
    title: 'No Wait Times',
    description: 'Process multiple files simultaneously without queues or lengthy wait times.',
  },
  {
    icon: Heart,
    title: 'Free Forever',
    description: 'Core features remain free forever. No hidden fees, no subscription traps.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose Free ProfessionalTool?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Built with modern technology and user experience in mind. 
            Complete suite of professional tools, all free forever with no hidden costs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full card-hover text-center">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
