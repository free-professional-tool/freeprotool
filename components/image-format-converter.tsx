
'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Upload, 
  Download, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  Image as ImageIcon,
  FileText,
  X,
  ArrowRight,
  Zap,
  Settings
} from 'lucide-react';
import { IMAGE_CONVERTER_INPUT_FORMATS, IMAGE_CONVERTER_OUTPUT_FORMATS, MAX_IMAGE_SIZE } from '@/lib/constants';
import { ImageConverterOptions, ConvertedImage } from '@/lib/types';
import Image from 'next/image';

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  result?: ConvertedImage;
  error?: string;
}

export default function ImageFormatConverter() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [options, setOptions] = useState<ImageConverterOptions>({
    outputFormat: 'png',
    quality: 0.9,
    enableCompression: true,
    maintainAspectRatio: true
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // File validation
  const validateFile = (file: File): string | null => {
    if (!IMAGE_CONVERTER_INPUT_FORMATS.includes(file.type)) {
      return `Unsupported format: ${file.type}`;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return `File too large: ${(file.size / (1024 * 1024)).toFixed(1)}MB (max 20MB)`;
    }
    return null;
  };

  // File upload handlers
  const handleFileSelect = useCallback((selectedFiles: FileList) => {
    const newFiles: UploadedFile[] = [];
    
    Array.from(selectedFiles).forEach((file) => {
      const validation = validateFile(file);
      if (validation) {
        // Show error for invalid files
        console.error(validation);
        return;
      }

      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const previewUrl = URL.createObjectURL(file);
      
      newFiles.push({
        id,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        previewUrl,
        status: 'pending'
      });
    });

    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelect(e.target.files);
    }
  }, [handleFileSelect]);

  // Remove file
  const removeFile = (id: string) => {
    setFiles(prev => {
      const updated = prev.filter(f => f.id !== id);
      // Clean up preview URL
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
      }
      return updated;
    });
  };

  // Core conversion function
  const convertImage = async (uploadedFile: UploadedFile): Promise<ConvertedImage> => {
    const startTime = Date.now();
    
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          const canvas = canvasRef.current;
          if (!canvas) throw new Error('Canvas not available');
          
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Canvas context not available');

          // Set canvas dimensions
          canvas.width = img.width;
          canvas.height = img.height;

          // Clear canvas and draw image
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);

          // Get output format info
          const outputFormat = IMAGE_CONVERTER_OUTPUT_FORMATS.find(f => f.value === options.outputFormat);
          if (!outputFormat) throw new Error('Invalid output format');

          // Convert to blob
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Failed to convert image'));
              return;
            }

            const convertedUrl = URL.createObjectURL(blob);
            const originalFormat = uploadedFile.file.type.split('/')[1].toUpperCase();
            const compressionRatio = uploadedFile.size > 0 ? blob.size / uploadedFile.size : 1;
            
            // Generate filename
            const baseName = uploadedFile.name.split('.')[0];
            const convertedFileName = `${baseName}.${outputFormat.extension}`;

            const result: ConvertedImage = {
              originalUrl: uploadedFile.previewUrl,
              convertedUrl,
              originalFileName: uploadedFile.name,
              convertedFileName,
              originalFormat,
              outputFormat: outputFormat.label,
              originalSize: uploadedFile.size,
              convertedSize: blob.size,
              compressionRatio,
              processingTime: Date.now() - startTime,
              quality: options.quality
            };

            resolve(result);
          }, outputFormat.mimeType, options.enableCompression ? options.quality : 1.0);

        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = uploadedFile.previewUrl;
    });
  };

  // Convert all files
  const convertAllFiles = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setProgress(0);

    const pendingFiles = files.filter(f => f.status === 'pending');
    
    for (let i = 0; i < pendingFiles.length; i++) {
      const file = pendingFiles[i];
      
      // Update status to processing
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: 'processing' } : f
      ));

      try {
        const result = await convertImage(file);
        
        // Update with result
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, status: 'completed', result } : f
        ));

      } catch (error) {
        // Update with error
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { 
            ...f, 
            status: 'error', 
            error: error instanceof Error ? error.message : 'Conversion failed'
          } : f
        ));
      }

      // Update progress
      setProgress(((i + 1) / pendingFiles.length) * 100);
    }

    setIsProcessing(false);
  };

  // Download file
  const downloadFile = (result: ConvertedImage) => {
    const link = document.createElement('a');
    link.href = result.convertedUrl;
    link.download = result.convertedFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download all converted files
  const downloadAll = () => {
    files.forEach(file => {
      if (file.status === 'completed' && file.result) {
        setTimeout(() => downloadFile(file.result!), 100); // Small delay between downloads
      }
    });
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get format color
  const getFormatColor = (format: string): string => {
    const colors: Record<string, string> = {
      'JPEG': 'bg-red-500',
      'JPG': 'bg-red-500', 
      'PNG': 'bg-blue-500',
      'WEBP': 'bg-green-500',
      'GIF': 'bg-yellow-500',
      'BMP': 'bg-purple-500',
      'ICO': 'bg-indigo-500',
      'TIFF': 'bg-pink-500',
      'SVG': 'bg-orange-500'
    };
    return colors[format.toUpperCase()] || 'bg-gray-500';
  };

  // Clean up URLs on unmount
  useEffect(() => {
    return () => {
      files.forEach(file => {
        URL.revokeObjectURL(file.previewUrl);
        if (file.result) {
          URL.revokeObjectURL(file.result.convertedUrl);
        }
      });
    };
  }, [files]);

  const completedFiles = files.filter(f => f.status === 'completed');
  const hasFiles = files.length > 0;
  const hasPendingFiles = files.some(f => f.status === 'pending');

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Hidden canvas for conversion */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              
              <div>
                <p className="text-lg font-medium mb-2">
                  Drop images here or click to browse
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Supports: JPG, PNG, WebP, GIF, BMP, TIFF, SVG, ICO
                </p>
                <Button onClick={() => fileInputRef.current?.click()}>
                  Choose Files
                </Button>
              </div>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={IMAGE_CONVERTER_INPUT_FORMATS.join(',')}
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Conversion Settings */}
      {hasFiles && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Conversion Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Output Format */}
              <div className="space-y-2">
                <Label>Output Format</Label>
                <Select 
                  value={options.outputFormat} 
                  onValueChange={(value: any) => setOptions(prev => ({ ...prev, outputFormat: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {IMAGE_CONVERTER_OUTPUT_FORMATS.map(format => (
                      <SelectItem key={format.value} value={format.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded ${getFormatColor(format.label)} flex items-center justify-center`}>
                            <span className="text-white text-xs font-bold">{format.extension.charAt(0).toUpperCase()}</span>
                          </div>
                          {format.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quality Settings */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Quality</Label>
                  <span className="text-sm text-muted-foreground">{Math.round(options.quality * 100)}%</span>
                </div>
                <Slider
                  value={[options.quality]}
                  onValueChange={([value]) => setOptions(prev => ({ ...prev, quality: value }))}
                  min={0.1}
                  max={1.0}
                  step={0.05}
                  className="w-full"
                />
              </div>
            </div>

            {/* Advanced Options */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Enable Compression</Label>
                <p className="text-sm text-muted-foreground">Apply quality-based compression</p>
              </div>
              <Switch
                checked={options.enableCompression}
                onCheckedChange={(checked) => setOptions(prev => ({ ...prev, enableCompression: checked }))}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* File List */}
      {hasFiles && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Images ({files.length})
              </CardTitle>
              {hasPendingFiles && (
                <Button onClick={convertAllFiles} disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Convert All
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isProcessing && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Converting images...</span>
                  <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}

            <div className="space-y-4">
              {files.map((file) => (
                <div key={file.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    {/* Preview */}
                    <div className="relative w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={file.previewUrl}
                        alt={file.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium truncate">{file.name}</p>
                        <Badge variant={
                          file.status === 'completed' ? 'default' :
                          file.status === 'processing' ? 'secondary' :
                          file.status === 'error' ? 'destructive' : 'outline'
                        }>
                          {file.status === 'pending' && 'Ready'}
                          {file.status === 'processing' && 'Converting...'}
                          {file.status === 'completed' && 'Done'}
                          {file.status === 'error' && 'Error'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{formatFileSize(file.size)}</span>
                        <div className="flex items-center gap-1">
                          <div className={`w-3 h-3 rounded ${getFormatColor(file.type.split('/')[1])}`}></div>
                          {file.type.split('/')[1].toUpperCase()}
                        </div>
                      </div>

                      {file.status === 'completed' && file.result && (
                        <div className="mt-2 flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2 text-green-600">
                            <ArrowRight className="w-4 h-4" />
                            <div className="flex items-center gap-1">
                              <div className={`w-3 h-3 rounded ${getFormatColor(file.result.outputFormat)}`}></div>
                              {file.result.outputFormat}
                            </div>
                            <span>{formatFileSize(file.result.convertedSize)}</span>
                          </div>
                          <span className="text-muted-foreground">
                            {file.result.compressionRatio < 1 ? 
                              `${Math.round((1 - file.result.compressionRatio) * 100)}% smaller` :
                              `${Math.round((file.result.compressionRatio - 1) * 100)}% larger`
                            }
                          </span>
                        </div>
                      )}

                      {file.status === 'error' && file.error && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                          <AlertCircle className="w-4 h-4" />
                          {file.error}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {file.status === 'completed' && file.result && (
                        <Button size="sm" onClick={() => downloadFile(file.result!)}>
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Batch Download */}
            {completedFiles.length > 1 && (
              <div className="mt-6 pt-4 border-t">
                <Button onClick={downloadAll} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download All ({completedFiles.length} files)
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      {completedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Conversion Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{completedFiles.length}</div>
                <div className="text-sm text-muted-foreground">Files Converted</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {formatFileSize(completedFiles.reduce((sum, f) => sum + (f.result?.originalSize || 0), 0))}
                </div>
                <div className="text-sm text-muted-foreground">Original Size</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {formatFileSize(completedFiles.reduce((sum, f) => sum + (f.result?.convertedSize || 0), 0))}
                </div>
                <div className="text-sm text-muted-foreground">Final Size</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(completedFiles.reduce((sum, f) => sum + (f.result?.processingTime || 0), 0) / completedFiles.length)}ms
                </div>
                <div className="text-sm text-muted-foreground">Avg Time</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
