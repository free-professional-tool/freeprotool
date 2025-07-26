
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Globe, 
  Download, 
  Settings, 
  FileText, 
  Clock,
  AlertCircle,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { validateUrl, downloadFile, formatFileSize, sanitizeFilename } from '@/lib/utils';
import { UrlToPdfOptions, ProcessedUrlPdf } from '@/lib/types';

interface ConversionState {
  isProcessing: boolean;
  progress: number;
  status: string;
  result?: ProcessedUrlPdf;
  error?: string;
}

export default function UrlToPdfConverter() {
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [conversionState, setConversionState] = useState<ConversionState>({
    isProcessing: false,
    progress: 0,
    status: ''
  });

  const [options, setOptions] = useState<UrlToPdfOptions>({
    url: '',
    pageSize: 'A4',
    orientation: 'portrait',
    margins: 'default',
    waitForNetworkIdle: true,
    includeBackground: true,
    scale: 1
  });

  const handleUrlChange = (value: string) => {
    setUrl(value);
    setUrlError('');
    
    if (value.trim()) {
      const validation = validateUrl(value);
      if (!validation.valid) {
        setUrlError(validation.error || 'Invalid URL');
      } else {
        setOptions(prev => ({ ...prev, url: validation.normalizedUrl || value }));
      }
    }
  };

  const handleConvert = async () => {
    const validation = validateUrl(url);
    if (!validation.valid) {
      setUrlError(validation.error || 'Invalid URL');
      return;
    }

    setConversionState({
      isProcessing: true,
      progress: 10,
      status: 'Initializing conversion...'
    });

    try {
      const convertOptions = {
        ...options,
        url: validation.normalizedUrl || url
      };

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setConversionState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90),
          status: prev.progress < 40 ? 'Loading website...' : 
                  prev.progress < 70 ? 'Rendering PDF...' : 
                  'Finalizing document...'
        }));
      }, 500);

      const response = await fetch('/api/url-to-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(convertOptions),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Conversion failed');
      }

      const result: ProcessedUrlPdf = await response.json();
      
      setConversionState({
        isProcessing: false,
        progress: 100,
        status: 'Conversion completed!',
        result
      });

    } catch (error: any) {
      setConversionState({
        isProcessing: false,
        progress: 0,
        status: '',
        error: error.message || 'An unexpected error occurred'
      });
    }
  };

  const handleDownload = () => {
    if (conversionState.result) {
      downloadFile(conversionState.result.processedUrl, conversionState.result.processedFileName);
    }
  };

  const resetConverter = () => {
    setUrl('');
    setUrlError('');
    setConversionState({
      isProcessing: false,
      progress: 0,
      status: ''
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-900">
              <Globe className="w-6 h-6 text-purple-600" />
              URL to PDF Converter
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* URL Input Section */}
            <div className="space-y-2">
              <Label htmlFor="url-input" className="text-sm font-medium text-gray-700">
                Website URL
              </Label>
              <div className="relative">
                <Input
                  id="url-input"
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className={`pl-10 pr-12 h-12 text-base ${urlError ? 'border-red-300 focus:border-red-500' : ''}`}
                  disabled={conversionState.isProcessing}
                />
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                {url && !urlError && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 px-2"
                    onClick={() => window.open(url, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                )}
              </div>
              {urlError && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {urlError}
                </p>
              )}
            </div>

            {/* Options Panel */}
            <Card className="bg-gray-50 border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="w-5 h-5" />
                  Conversion Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Page Size</Label>
                    <Select value={options.pageSize} onValueChange={(value: any) => setOptions(prev => ({ ...prev, pageSize: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A4">A4</SelectItem>
                        <SelectItem value="A3">A3</SelectItem>
                        <SelectItem value="Letter">Letter</SelectItem>
                        <SelectItem value="Legal">Legal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Orientation</Label>
                    <Select value={options.orientation} onValueChange={(value: any) => setOptions(prev => ({ ...prev, orientation: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="portrait">Portrait</SelectItem>
                        <SelectItem value="landscape">Landscape</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Margins</Label>
                    <Select value={options.margins} onValueChange={(value: any) => setOptions(prev => ({ ...prev, margins: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="minimum">Minimum</SelectItem>
                        <SelectItem value="default">Default</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Scale</Label>
                    <Select value={options.scale.toString()} onValueChange={(value) => setOptions(prev => ({ ...prev, scale: parseFloat(value) }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.5">50%</SelectItem>
                        <SelectItem value="0.75">75%</SelectItem>
                        <SelectItem value="1">100%</SelectItem>
                        <SelectItem value="1.25">125%</SelectItem>
                        <SelectItem value="1.5">150%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="wait-network"
                      checked={options.waitForNetworkIdle}
                      onCheckedChange={(checked) => setOptions(prev => ({ ...prev, waitForNetworkIdle: checked }))}
                    />
                    <Label htmlFor="wait-network" className="text-sm">Wait for network idle</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="include-background"
                      checked={options.includeBackground}
                      onCheckedChange={(checked) => setOptions(prev => ({ ...prev, includeBackground: checked }))}
                    />
                    <Label htmlFor="include-background" className="text-sm">Include backgrounds</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Convert Button */}
            <Button
              onClick={handleConvert}
              disabled={!url || !!urlError || conversionState.isProcessing}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {conversionState.isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Converting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Convert to PDF
                </div>
              )}
            </Button>

            {/* Progress Section */}
            {conversionState.isProcessing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{conversionState.status}</span>
                  <span className="text-gray-600">{conversionState.progress}%</span>
                </div>
                <Progress value={conversionState.progress} className="h-2" />
              </motion.div>
            )}

            {/* Error Display */}
            {conversionState.error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Conversion Failed</span>
                </div>
                <p className="text-red-700 mt-1">{conversionState.error}</p>
                <Button
                  onClick={resetConverter}
                  variant="outline"
                  size="sm"
                  className="mt-3 border-red-300 text-red-700 hover:bg-red-50"
                >
                  Try Again
                </Button>
              </motion.div>
            )}

            {/* Success Display */}
            {conversionState.result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-green-800 mb-3">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Conversion Successful!</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">File Size:</span>
                        <Badge variant="secondary" className="ml-2">
                          {formatFileSize(conversionState.result.fileSize)}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-gray-600">Pages:</span>
                        <Badge variant="secondary" className="ml-2">
                          {conversionState.result.pageCount}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-gray-600">Processing Time:</span>
                        <Badge variant="secondary" className="ml-2 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {conversionState.result.processingTime}ms
                        </Badge>
                      </div>
                      {conversionState.result.title && (
                        <div className="col-span-2">
                          <span className="text-gray-600">Page Title:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {conversionState.result.title}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 mt-4">
                      <Button onClick={handleDownload} className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                      <Button onClick={resetConverter} variant="outline">
                        Convert Another
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
