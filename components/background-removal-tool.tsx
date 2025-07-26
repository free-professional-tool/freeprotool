
'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import FileUpload from '@/components/file-upload';
import ImageComparison from '@/components/image-comparison';
import { 
  Download, 
  Sparkles, 
  Crown, 
  RefreshCw, 
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react';
import { validateImageFile, formatFileSize, downloadFile } from '@/lib/utils';
import { backgroundRemovalProcessor } from '@/lib/background-removal';

interface ProcessedImage {
  originalUrl: string;
  processedUrl: string;
  originalFileName: string;
  processedFileName: string;
  quality: 'standard' | 'high';
  fileSize: number;
  apiUsed?: string;
}

export default function BackgroundRemovalTool() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<'standard' | 'high'>('standard');
  const { toast } = useToast();

  const handleFileSelect = useCallback((file: File) => {
    const validation = validateImageFile(file);
    
    if (!validation.valid) {
      toast({
        title: "Invalid File",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    setProcessedImage(null);
    setProgress(0);
  }, [toast]);

  const processImage = useCallback(async (quality: 'standard' | 'high' = selectedQuality) => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProgress(0);
    setSelectedQuality(quality);

    // Progress simulation for server-side processing
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        // Slower progress for more realistic server processing
        return prev + Math.random() * 8;
      });
    }, 500);

    try {
      // Start processing - no initialization needed for server-side
      setProgress(15);

      // Process image with advanced AI models
      const result = await backgroundRemovalProcessor.processImage(selectedFile, quality);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to process image');
      }

      clearInterval(progressInterval);
      setProgress(100);

      // Create object URL for original image
      const originalUrl = URL.createObjectURL(selectedFile);
      
      const processed: ProcessedImage = {
        originalUrl,
        processedUrl: result.processedImageUrl,
        originalFileName: selectedFile.name,
        processedFileName: `processed_${selectedFile.name.replace(/\.[^/.]+$/, '')}.png`,
        quality,
        fileSize: result.fileSize || result.processedBlob.size,
        apiUsed: `${result.modelInfo?.name || result.modelUsed || 'Advanced AI'}`
      };

      setProcessedImage(processed);

      const processingTime = result.processingTime ? `${result.processingTime}s` : '';
      const modelName = result.modelInfo?.name || result.modelUsed || 'Advanced AI';

      toast({
        title: "Background Removed Successfully!",
        description: `Processed using ${modelName} ${processingTime ? `in ${processingTime}` : ''}`,
      });

    } catch (error) {
      clearInterval(progressInterval);
      console.error('Processing error:', error);
      
      toast({
        title: "Processing Failed",
        description: error instanceof Error ? error.message : 'An error occurred while processing your image',
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, [selectedFile, selectedQuality, toast]);

  const handleDownload = useCallback(() => {
    if (!processedImage) return;

    // For demo/base64 images, create download
    if (processedImage.processedUrl.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = processedImage.processedUrl;
      link.download = processedImage.processedFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      downloadFile(processedImage.processedUrl, processedImage.processedFileName);
    }

    toast({
      title: "Downloaded!",
      description: "Your processed image has been downloaded successfully.",
    });
  }, [processedImage, toast]);

  const handleReset = useCallback(() => {
    setSelectedFile(null);
    setProcessedImage(null);
    setProgress(0);
    setIsProcessing(false);
    setSelectedQuality('standard');
  }, []);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      backgroundRemovalProcessor.cleanup();
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Quality Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span>Choose Processing Quality</span>
          </CardTitle>
          <CardDescription>
            Choose your processing quality. Our advanced AI automatically selects the best model for your image type and provides professional-grade results.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`cursor-pointer transition-all ${
                  selectedQuality === 'standard' 
                    ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-950/20' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedQuality('standard')}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-blue-600" />
                      <span>Standard Quality</span>
                    </CardTitle>
                    <Badge variant="secondary">Free</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Fast processing with excellent quality using U²-Net AI models. Perfect for most use cases.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• U²-Net AI processing</li>
                    <li>• Smart model selection</li>
                    <li>• Up to 1200px resolution</li>
                    <li>• 5-15 second processing</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`cursor-pointer transition-all ${
                  selectedQuality === 'high' 
                    ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-950/20' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedQuality('high')}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Crown className="w-4 h-4 text-amber-600" />
                      <span>High Quality</span>
                    </CardTitle>
                    <Badge className="bg-gradient-to-r from-purple-600 to-blue-600">Premium</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Maximum quality using BiRefNet and advanced AI models. Perfect for professional use.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• BiRefNet AI processing</li>
                    <li>• Advanced edge refinement</li>
                    <li>• Up to 2400px resolution</li>
                    <li>• 10-30 second processing</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Your Image</CardTitle>
          <CardDescription>
            Drag and drop an image file or click to browse. Supports PNG, JPG, and WebP formats up to 10MB.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUpload 
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
            disabled={isProcessing}
          />
        </CardContent>
      </Card>

      {/* Processing Progress */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <RefreshCw className="w-5 h-5 animate-spin text-purple-600" />
                    <span className="font-medium">Processing your image...</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-muted-foreground">
                    Using {selectedQuality === 'high' ? 'high' : 'standard'} quality processing
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      {selectedFile && !isProcessing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button 
            onClick={() => processImage('standard')} 
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Zap className="w-4 h-4 mr-2" />
            Remove Background (Standard)
          </Button>
          <Button 
            onClick={() => processImage('high')} 
            variant="outline"
            className="flex-1 border-purple-200 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-950/20"
          >
            <Crown className="w-4 h-4 mr-2" />
            High Quality Processing
          </Button>
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence>
        {processedImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Success Message */}
            <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 text-green-700 dark:text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Background removed successfully!</span>
                  {processedImage.apiUsed && (
                    <Badge variant="secondary" className="ml-2">
                      Powered by {processedImage.apiUsed}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Image Comparison */}
            <ImageComparison 
              originalImage={processedImage.originalUrl}
              processedImage={processedImage.processedUrl}
              originalFileName={processedImage.originalFileName}
            />

            {/* Download and Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <p className="font-medium">Your image is ready!</p>
                    <p className="text-sm text-muted-foreground">
                      Quality: {processedImage.quality === 'high' ? 'High' : 'Standard'} • 
                      Size: {formatFileSize(processedImage.fileSize)}
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button onClick={handleReset} variant="outline">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Process Another
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Section */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <span>Tips for Best Results</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• <strong>All image types supported:</strong> People, products, animals, objects, and complex scenes</li>
            <li>• <strong>Advanced AI:</strong> Automatically selects the best model (U²-Net, BiRefNet, or Human-specific)</li>
            <li>• <strong>Fine details preserved:</strong> Hair, fur, transparent objects, and complex edges</li>
            <li>• <strong>High Quality mode:</strong> Use for professional work, print materials, or detailed images</li>
            <li>• <strong>Standard mode:</strong> Perfect for web use, social media, and quick processing</li>
            <li>• <strong>File requirements:</strong> PNG, JPG, JPEG, WebP formats up to 10MB</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
