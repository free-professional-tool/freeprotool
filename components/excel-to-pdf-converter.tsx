
'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import FileUpload from '@/components/file-upload';
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Settings,
  CheckCircle,
  AlertCircle,
  Zap,
  Clock
} from 'lucide-react';
import { validateExcelFile, formatFileSize, downloadFile } from '@/lib/utils';
import { ExcelToPdfOptions, ProcessedPdf } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function ExcelToPdfConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedPdf, setProcessedPdf] = useState<ProcessedPdf | null>(null);
  const [options, setOptions] = useState<ExcelToPdfOptions>({
    orientation: 'portrait',
    pageSize: 'A4',
    margins: 'normal',
    fitToPage: false
  });
  const { toast } = useToast();

  const handleFileSelect = useCallback((file: File) => {
    const validation = validateExcelFile(file);
    
    if (!validation.valid) {
      toast({
        title: "Invalid File",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    setProcessedPdf(null);
    setProgress(0);
  }, [toast]);

  const processExcelToPdf = useCallback(async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, 500);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('options', JSON.stringify(options));

      const response = await fetch('/api/convert-excel-to-pdf', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Conversion failed');
      }

      // Convert base64 to blob
      const pdfData = atob(result.data.pdfData);
      const pdfArray = new Uint8Array(pdfData.length);
      for (let i = 0; i < pdfData.length; i++) {
        pdfArray[i] = pdfData.charCodeAt(i);
      }
      const pdfBlob = new Blob([pdfArray], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      const processedResult: ProcessedPdf = {
        originalUrl: URL.createObjectURL(selectedFile),
        processedUrl: pdfUrl,
        originalFileName: selectedFile.name,
        processedFileName: result.data.filename,
        fileSize: result.data.fileSize,
        pageCount: result.data.pageCount,
        processingTime: result.data.processingTime
      };

      setProcessedPdf(processedResult);
      setProgress(100);

      toast({
        title: "Conversion Complete!",
        description: `Successfully converted to PDF with ${result.data.pageCount} pages`,
      });

    } catch (error) {
      console.error('Conversion error:', error);
      toast({
        title: "Conversion Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setIsProcessing(false);
    }
  }, [selectedFile, options, toast]);

  const handleDownload = useCallback(() => {
    if (processedPdf) {
      downloadFile(processedPdf.processedUrl, processedPdf.processedFileName);
    }
  }, [processedPdf]);

  const handleReset = useCallback(() => {
    setSelectedFile(null);
    setProcessedPdf(null);
    setProgress(0);
    setIsProcessing(false);
  }, []);

  return (
    <div className="space-y-8">
      {/* File Upload */}
      <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 border shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            Upload Excel File
          </CardTitle>
          <CardDescription>
            Select your Excel file (.xlsx, .xls, .csv) to convert to PDF
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUpload
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
            accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
            maxSize={25 * 1024 * 1024} // 25MB
          />
          
          {selectedFile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-lg bg-muted/50 border"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Ready
                </Badge>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Conversion Options */}
      {selectedFile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 border shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                Conversion Settings
              </CardTitle>
              <CardDescription>
                Customize your PDF output settings for optimal results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="orientation">Page Orientation</Label>
                  <Select
                    value={options.orientation}
                    onValueChange={(value: 'portrait' | 'landscape') => 
                      setOptions(prev => ({ ...prev, orientation: value }))
                    }
                  >
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
                  <Label htmlFor="pageSize">Page Size</Label>
                  <Select
                    value={options.pageSize}
                    onValueChange={(value: 'A4' | 'A3' | 'Letter') => 
                      setOptions(prev => ({ ...prev, pageSize: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A4">A4</SelectItem>
                      <SelectItem value="A3">A3</SelectItem>
                      <SelectItem value="Letter">Letter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="margins">Margins</Label>
                  <Select
                    value={options.margins}
                    onValueChange={(value: 'normal' | 'narrow' | 'wide') => 
                      setOptions(prev => ({ ...prev, margins: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="narrow">Narrow</SelectItem>
                      <SelectItem value="wide">Wide</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="fitToPage"
                    checked={options.fitToPage}
                    onCheckedChange={(checked) => 
                      setOptions(prev => ({ ...prev, fitToPage: checked }))
                    }
                  />
                  <Label htmlFor="fitToPage">Fit content to page</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Convert Button */}
      {selectedFile && !processedPdf && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <Button
            onClick={processExcelToPdf}
            disabled={isProcessing}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold shadow-lg"
          >
            {isProcessing ? (
              <>
                <Clock className="w-5 h-5 mr-2 animate-spin" />
                Converting...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Convert to PDF
              </>
            )}
          </Button>
        </motion.div>
      )}

      {/* Progress */}
      {isProcessing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 border shadow-lg">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Converting Excel to PDF...</span>
                  <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground text-center">
                  Processing your spreadsheet and generating PDF...
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Results */}
      {processedPdf && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 border shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                Conversion Complete!
              </CardTitle>
              <CardDescription>
                Your Excel file has been successfully converted to PDF
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border bg-muted/50">
                  <div className="flex items-center gap-3 mb-2">
                    <FileSpreadsheet className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="font-medium">Original File</p>
                      <p className="text-sm text-muted-foreground">{processedPdf.originalFileName}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="font-medium">PDF File</p>
                      <p className="text-sm text-muted-foreground">{processedPdf.processedFileName}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  {processedPdf.pageCount} pages
                </div>
                <div className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  {formatFileSize(processedPdf.fileSize)}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {processedPdf.processingTime.toFixed(1)}s
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleDownload} className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button onClick={handleReset} variant="outline">
                  Convert Another
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
