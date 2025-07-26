
'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Upload, 
  Download, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle, 
  Lock, 
  Unlock,
  Image as ImageIcon,
  FileText
} from 'lucide-react';
import { SUPPORTED_IMAGE_TYPES } from '@/lib/constants';
import { SteganographyResult } from '@/lib/types';

export default function ImageSteganographyTool() {
  const [activeTab, setActiveTab] = useState<'encode' | 'decode'>('encode');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [extractedMessage, setExtractedMessage] = useState<string>('');
  const [outputFormat, setOutputFormat] = useState<'png' | 'jpg' | 'webp'>('png');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<SteganographyResult | null>(null);
  const [error, setError] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // LSB Steganography Implementation
  const textToBinary = (text: string): string => {
    return text.split('').map(char => 
      char.charCodeAt(0).toString(2).padStart(8, '0')
    ).join('');
  };

  const binaryToText = (binary: string): string => {
    const chars = [];
    for (let i = 0; i < binary.length; i += 8) {
      const byte = binary.slice(i, i + 8);
      if (byte.length === 8) {
        chars.push(String.fromCharCode(parseInt(byte, 2)));
      }
    }
    return chars.join('');
  };

  const embedMessage = useCallback((imageData: ImageData, message: string): ImageData => {
    const data = new Uint8ClampedArray(imageData.data);
    const binaryMessage = textToBinary(message);
    const messageLength = binaryMessage.length;
    const lengthBinary = messageLength.toString(2).padStart(32, '0'); // 32-bit length
    const fullBinary = lengthBinary + binaryMessage + '1111111111111110'; // End marker
    
    let binaryIndex = 0;
    
    // Embed data in LSB of RGB channels (skip alpha)
    for (let i = 0; i < data.length && binaryIndex < fullBinary.length; i += 4) {
      // Red channel
      if (binaryIndex < fullBinary.length) {
        data[i] = (data[i] & 0xFE) | parseInt(fullBinary[binaryIndex], 2);
        binaryIndex++;
      }
      // Green channel
      if (binaryIndex < fullBinary.length) {
        data[i + 1] = (data[i + 1] & 0xFE) | parseInt(fullBinary[binaryIndex], 2);
        binaryIndex++;
      }
      // Blue channel
      if (binaryIndex < fullBinary.length) {
        data[i + 2] = (data[i + 2] & 0xFE) | parseInt(fullBinary[binaryIndex], 2);
        binaryIndex++;
      }
    }
    
    return new ImageData(data, imageData.width, imageData.height);
  }, []);

  const extractMessage = useCallback((imageData: ImageData): string => {
    const data = imageData.data;
    let binaryString = '';
    
    // Extract LSB from RGB channels
    for (let i = 0; i < data.length; i += 4) {
      binaryString += (data[i] & 1).toString(); // Red
      binaryString += (data[i + 1] & 1).toString(); // Green
      binaryString += (data[i + 2] & 1).toString(); // Blue
    }
    
    // Extract message length (first 32 bits)
    const lengthBinary = binaryString.slice(0, 32);
    const messageLength = parseInt(lengthBinary, 2);
    
    if (messageLength <= 0 || messageLength > binaryString.length - 32) {
      throw new Error('No valid message found in image');
    }
    
    // Extract message
    const messageBinary = binaryString.slice(32, 32 + messageLength);
    return binaryToText(messageBinary);
  }, []);

  const processImage = useCallback(async () => {
    if (!selectedFile) {
      setError('Please select an image file');
      return;
    }

    if (activeTab === 'encode' && !message.trim()) {
      setError('Please enter a message to hide');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError('');
    setResult(null);
    
    try {
      const startTime = Date.now();
      
      // Load image
      setProgress(20);
      const img = new Image();
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(selectedFile);
      });
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      setProgress(40);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      if (activeTab === 'encode') {
        // Check if image is large enough
        const requiredPixels = Math.ceil((textToBinary(message).length + 48) / 3); // +48 for length and end marker
        const availablePixels = imageData.width * imageData.height;
        
        if (requiredPixels > availablePixels) {
          throw new Error(`Image too small. Need at least ${requiredPixels} pixels, but image has ${availablePixels} pixels.`);
        }
        
        setProgress(60);
        const modifiedImageData = embedMessage(imageData, message);
        ctx.putImageData(modifiedImageData, 0, 0);
        
        setProgress(80);
        
        // Generate download URL
        const mimeType = outputFormat === 'jpg' ? 'image/jpeg' : 
                         outputFormat === 'webp' ? 'image/webp' : 'image/png';
        const quality = outputFormat === 'jpg' ? 0.95 : undefined;
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const processingTime = Date.now() - startTime;
            
            setResult({
              success: true,
              mode: 'encode',
              originalFileName: selectedFile.name,
              processedUrl: url,
              processedFileName: `steganography_${selectedFile.name.split('.')[0]}.${outputFormat}`,
              fileSize: blob.size,
              processingTime
            });
            setProgress(100);
          }
        }, mimeType, quality);
        
      } else {
        // Decode mode
        setProgress(60);
        try {
          const extracted = extractMessage(imageData);
          const processingTime = Date.now() - startTime;
          
          setExtractedMessage(extracted);
          setResult({
            success: true,
            mode: 'decode',
            originalFileName: selectedFile.name,
            extractedMessage: extracted,
            processingTime
          });
          
          setProgress(100);
        } catch (err) {
          throw new Error('No hidden message found in this image');
        }
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Processing failed');
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, message, activeTab, outputFormat, embedMessage, extractMessage]);

  const handleFileSelect = (file: File) => {
    if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
      setError('Please select a valid image file (PNG, JPG, or WebP)');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError('');
    setResult(null);
    setExtractedMessage('');
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const downloadProcessedImage = () => {
    if (result?.processedUrl && result?.processedFileName) {
      const link = document.createElement('a');
      link.href = result.processedUrl;
      link.download = result.processedFileName;
      link.click();
    }
  };

  const resetTool = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setMessage('');
    setExtractedMessage('');
    setResult(null);
    setError('');
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <canvas ref={canvasRef} className="hidden" />
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'encode' | 'decode')} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="encode" className="flex items-center space-x-2">
            <Lock className="w-4 h-4" />
            <span>Hide Message</span>
          </TabsTrigger>
          <TabsTrigger value="decode" className="flex items-center space-x-2">
            <Unlock className="w-4 h-4" />
            <span>Extract Message</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="encode">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* File Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ImageIcon className="w-5 h-5" />
                  <span>Select Image</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {previewUrl ? (
                    <div className="space-y-4">
                      <div className="relative w-full max-w-xs mx-auto">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-auto rounded-lg shadow-md"
                        />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p className="font-medium">{selectedFile?.name}</p>
                        <p>{selectedFile && (selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={resetTool}>
                        Choose Different Image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                      <div>
                        <p className="text-lg font-medium">Drop your image here</p>
                        <p className="text-muted-foreground">or click to browse</p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Select Image
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Message Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Secret Message</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter the message you want to hide in the image..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[120px]"
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{message.length} characters</span>
                  <span>~{Math.ceil(message.length * 8 / 3)} pixels required</span>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Output Format</label>
                  <Select value={outputFormat} onValueChange={(value: 'png' | 'jpg' | 'webp') => setOutputFormat(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="png">PNG (Recommended)</SelectItem>
                      <SelectItem value="jpg">JPEG</SelectItem>
                      <SelectItem value="webp">WebP</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    PNG is recommended for preserving hidden messages
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="decode">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* File Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ImageIcon className="w-5 h-5" />
                  <span>Select Image with Hidden Message</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {previewUrl ? (
                    <div className="space-y-4">
                      <div className="relative w-full max-w-xs mx-auto">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-auto rounded-lg shadow-md"
                        />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p className="font-medium">{selectedFile?.name}</p>
                        <p>{selectedFile && (selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={resetTool}>
                        Choose Different Image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                      <div>
                        <p className="text-lg font-medium">Drop your image here</p>
                        <p className="text-muted-foreground">or click to browse</p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Select Image
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Extracted Message */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span>Extracted Message</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {extractedMessage ? (
                  <div className="space-y-4">
                    <Textarea
                      value={extractedMessage}
                      readOnly
                      className="min-h-[120px]"
                    />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{extractedMessage.length} characters extracted</span>
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Message Found</span>
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <EyeOff className="w-12 h-12 mx-auto mb-4" />
                    <p>No message extracted yet</p>
                    <p className="text-sm">Upload an image to reveal hidden messages</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Process Button */}
      <div className="mt-8 text-center">
        <Button
          onClick={processImage}
          disabled={!selectedFile || isProcessing || (activeTab === 'encode' && !message.trim())}
          size="lg"
          className="px-8 py-3"
        >
          {isProcessing ? (
            <>Processing...</>
          ) : activeTab === 'encode' ? (
            <>
              <Lock className="w-4 h-4 mr-2" />
              Hide Message in Image
            </>
          ) : (
            <>
              <Unlock className="w-4 h-4 mr-2" />
              Extract Hidden Message
            </>
          )}
        </Button>
      </div>

      {/* Progress */}
      {isProcessing && (
        <div className="mt-6">
          <Progress value={progress} className="w-full" />
          <p className="text-center text-sm text-muted-foreground mt-2">
            Processing... {progress}%
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-center space-x-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Error</span>
          </div>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>
                {result.mode === 'encode' ? 'Message Hidden Successfully!' : 'Message Extracted Successfully!'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Original File</p>
                <p className="font-medium">{result.originalFileName}</p>
              </div>
              {result.mode === 'encode' && result.fileSize && (
                <div>
                  <p className="text-muted-foreground">File Size</p>
                  <p className="font-medium">{(result.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              )}
              {result.mode === 'decode' && result.extractedMessage && (
                <div>
                  <p className="text-muted-foreground">Message Length</p>
                  <p className="font-medium">{result.extractedMessage.length} characters</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground">Processing Time</p>
                <p className="font-medium">{result.processingTime}ms</p>
              </div>
            </div>
            
            {result.mode === 'encode' && result.processedUrl && (
              <div className="mt-4 pt-4 border-t">
                <Button onClick={downloadProcessedImage} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Image with Hidden Message
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
