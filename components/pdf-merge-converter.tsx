

'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Download, 
  FileText, 
  Combine,
  Settings,
  CheckCircle,
  AlertCircle,
  Zap,
  Clock,
  X,
  GripVertical,
  Upload,
  Plus
} from 'lucide-react';
import { validatePdfFile, formatFileSize, downloadFile, generateRandomId } from '@/lib/utils';
import { PdfFile, PdfMergeOptions, MergedPdf } from '@/lib/types';

export default function PdfMergeConverter() {
  const [pdfFiles, setPdfFiles] = useState<PdfFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mergedPdf, setMergedPdf] = useState<MergedPdf | null>(null);
  const [options, setOptions] = useState<PdfMergeOptions>({
    outputFilename: 'merged_document.pdf',
    includeBookmarks: true,
    maintainQuality: true
  });
  const { toast } = useToast();

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    const validFiles: PdfFile[] = [];
    const currentTotalSize = pdfFiles.reduce((sum, file) => sum + file.size, 0);
    
    Array.from(files).forEach((file) => {
      const validation = validatePdfFile(file);
      
      if (!validation.valid) {
        toast({
          title: 'Invalid File',
          description: validation.error,
          variant: 'destructive',
        });
        return;
      }

      // Check if adding this file would exceed total size limit (200MB)
      if (currentTotalSize + file.size + validFiles.reduce((sum, f) => sum + f.size, 0) > 200 * 1024 * 1024) {
        toast({
          title: 'Size Limit Exceeded',
          description: 'Total file size cannot exceed 200MB',
          variant: 'destructive',
        });
        return;
      }

      validFiles.push({
        id: generateRandomId(),
        file,
        name: file.name,
        size: file.size,
        order: pdfFiles.length + validFiles.length
      });
    });

    if (validFiles.length > 0) {
      setPdfFiles(prev => [...prev, ...validFiles]);
      toast({
        title: 'Files Added',
        description: `${validFiles.length} PDF file(s) added successfully`,
      });
    }
  }, [pdfFiles, toast]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const removeFile = useCallback((id: string) => {
    setPdfFiles(prev => prev.filter(file => file.id !== id));
    setMergedPdf(null);
  }, []);

  const reorderFiles = useCallback((fromIndex: number, toIndex: number) => {
    setPdfFiles(prev => {
      const newFiles = [...prev];
      const [movedFile] = newFiles.splice(fromIndex, 1);
      newFiles.splice(toIndex, 0, movedFile);
      return newFiles.map((file, index) => ({ ...file, order: index }));
    });
  }, []);

  const handleMerge = useCallback(async () => {
    if (pdfFiles.length < 2) {
      toast({
        title: 'Not Enough Files',
        description: 'Please select at least 2 PDF files to merge',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const formData = new FormData();
      
      // Add files in order
      pdfFiles.forEach((pdfFile, index) => {
        formData.append(`file_${index}`, pdfFile.file);
      });
      
      // Add options
      formData.append('options', JSON.stringify(options));

      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('/api/merge-pdfs', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to merge PDFs');
      }

      const result = await response.json();
      setProgress(100);
      setMergedPdf(result.data);

      toast({
        title: 'PDFs Merged Successfully!',
        description: `Combined ${pdfFiles.length} files into one PDF`,
      });

    } catch (error) {
      console.error('Merge error:', error);
      toast({
        title: 'Merge Failed',
        description: error instanceof Error ? error.message : 'An error occurred while merging PDFs',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProgress(0), 2000);
    }
  }, [pdfFiles, options, toast]);

  const handleDownload = useCallback(() => {
    if (mergedPdf?.processedUrl) {
      downloadFile(mergedPdf.processedUrl, mergedPdf.processedFileName);
    }
  }, [mergedPdf]);

  const handleReset = useCallback(() => {
    setPdfFiles([]);
    setMergedPdf(null);
    setProgress(0);
    setOptions({
      outputFilename: 'merged_document.pdf',
      includeBookmarks: true,
      maintainQuality: true
    });
  }, []);

  return (
    <div className="space-y-8">
      {/* File Upload Area */}
      <Card className="border-2 border-dashed border-muted-foreground/25 bg-background/50 backdrop-blur-sm">
        <CardContent className="p-8">
          <div
            className="text-center space-y-4"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto">
              <Upload className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Upload PDF Files</h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop your PDF files here, or click to browse
              </p>
              <input
                type="file"
                multiple
                accept=".pdf,application/pdf"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
                id="pdf-upload"
              />
              <label htmlFor="pdf-upload">
                <Button variant="outline" className="cursor-pointer" asChild>
                  <span>
                    <Plus className="w-4 h-4 mr-2" />
                    Select PDF Files
                  </span>
                </Button>
              </label>
            </div>
            {pdfFiles.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {pdfFiles.length} file(s) selected • {formatFileSize(pdfFiles.reduce((sum, file) => sum + file.size, 0))} total
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {pdfFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              PDF Files ({pdfFiles.length})
            </CardTitle>
            <CardDescription>
              Drag files to reorder them. The final PDF will follow this sequence.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <AnimatePresence>
                {pdfFiles.map((pdfFile, index) => (
                  <motion.div
                    key={pdfFile.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg border"
                  >
                    <div className="cursor-move">
                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{pdfFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(pdfFile.size)}
                        {pdfFile.pageCount && ` • ${pdfFile.pageCount} pages`}
                      </p>
                    </div>
                    <Badge variant="secondary">#{index + 1}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(pdfFile.id)}
                      className="flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Options */}
      {pdfFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Merge Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="filename">Output Filename</Label>
              <Input
                id="filename"
                value={options.outputFilename}
                onChange={(e) => setOptions(prev => ({ ...prev, outputFilename: e.target.value }))}
                placeholder="merged_document.pdf"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="bookmarks">Include Bookmarks</Label>
                <p className="text-sm text-muted-foreground">Preserve document bookmarks and navigation</p>
              </div>
              <Switch
                id="bookmarks"
                checked={options.includeBookmarks}
                onCheckedChange={(checked) => setOptions(prev => ({ ...prev, includeBookmarks: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="quality">Maintain Quality</Label>
                <p className="text-sm text-muted-foreground">Keep original PDF quality and compression</p>
              </div>
              <Switch
                id="quality"
                checked={options.maintainQuality}
                onCheckedChange={(checked) => setOptions(prev => ({ ...prev, maintainQuality: checked }))}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {pdfFiles.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleMerge}
                disabled={isProcessing || pdfFiles.length < 2}
                className="flex-1"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Clock className="w-4 h-4 mr-2" />
                    Merging PDFs...
                  </>
                ) : (
                  <>
                    <Combine className="w-4 h-4 mr-2" />
                    Merge {pdfFiles.length} PDFs
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={isProcessing}
                size="lg"
              >
                Clear All
              </Button>
            </div>

            {isProcessing && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Processing...</span>
                  <span className="text-sm text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {mergedPdf && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <CheckCircle className="w-5 h-5" />
                PDF Merge Complete
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{mergedPdf.originalFileCount}</div>
                  <div className="text-sm text-muted-foreground">Files Merged</div>
                </div>
                <div className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{mergedPdf.totalPages}</div>
                  <div className="text-sm text-muted-foreground">Total Pages</div>
                </div>
                <div className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{formatFileSize(mergedPdf.fileSize)}</div>
                  <div className="text-sm text-muted-foreground">File Size</div>
                </div>
                <div className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{mergedPdf.processingTime}s</div>
                  <div className="text-sm text-muted-foreground">Process Time</div>
                </div>
              </div>

              <Button 
                onClick={handleDownload} 
                className="w-full" 
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Merged PDF
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
