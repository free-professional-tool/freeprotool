
'use client';

import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  FileImage,
  FileSpreadsheet,
  FileText,
  AlertCircle 
} from 'lucide-react';
import { cn, formatFileSize } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  disabled?: boolean;
  accept?: string;
  maxSize?: number;
}

export default function FileUpload({
  onFileSelect,
  selectedFile,
  disabled = false,
  accept = "image/*",
  maxSize = 10 * 1024 * 1024 // 10MB
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    const file = files[0];

    if (file) {
      handleFileSelection(file);
    }
  }, [disabled]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  }, []);

  const handleFileSelection = useCallback((file: File) => {
    // Validate file size
    if (file.size > maxSize) {
      return;
    }

    // Create preview URL for images only
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
    
    onFileSelect(file);
  }, [onFileSelect, maxSize]);

  const handleRemoveFile = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    // Reset file input
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }, [previewUrl]);

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {!selectedFile && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Card
            className={cn(
              "border-2 border-dashed transition-all duration-300 cursor-pointer",
              isDragOver && !disabled
                ? "border-primary bg-primary/5 scale-105"
                : "border-muted-foreground/25 hover:border-primary/50",
              disabled && "opacity-50 pointer-events-none"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <motion.div
                animate={isDragOver ? { scale: 1.1 } : { scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors",
                  isDragOver 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Upload className="w-8 h-8" />
              </motion.div>

              <h3 className="text-lg font-semibold mb-2">
                {isDragOver ? "Drop your file here" : "Upload a file"}
              </h3>
              
              <p className="text-muted-foreground mb-4 max-w-sm">
                Drag and drop your file here, or click to browse your files
              </p>

              <Button 
                variant="outline" 
                className="mb-4"
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <FileImage className="w-4 h-4 mr-2" />
                Choose File
              </Button>

              <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                {accept.includes('image') ? (
                  <>
                    <span className="px-2 py-1 bg-muted rounded">PNG</span>
                    <span className="px-2 py-1 bg-muted rounded">JPG</span>
                    <span className="px-2 py-1 bg-muted rounded">WebP</span>
                  </>
                ) : accept.includes('xlsx') || accept.includes('xls') || accept.includes('csv') ? (
                  <>
                    <span className="px-2 py-1 bg-muted rounded">XLSX</span>
                    <span className="px-2 py-1 bg-muted rounded">XLS</span>
                    <span className="px-2 py-1 bg-muted rounded">CSV</span>
                  </>
                ) : (
                  <span className="px-2 py-1 bg-muted rounded">File</span>
                )}
                <span className="px-2 py-1 bg-muted rounded">Max {Math.floor(maxSize / (1024 * 1024))}MB</span>
              </div>

              <input
                id="file-input"
                type="file"
                accept={accept}
                onChange={handleFileInput}
                className="hidden"
                disabled={disabled}
              />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Selected File Preview */}
      {selectedFile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                {/* File Preview */}
                <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      {selectedFile.name.toLowerCase().includes('xlsx') || selectedFile.name.toLowerCase().includes('xls') ? (
                        <FileSpreadsheet className="w-16 h-16 mb-2 text-green-600" />
                      ) : selectedFile.name.toLowerCase().includes('csv') ? (
                        <FileText className="w-16 h-16 mb-2 text-blue-600" />
                      ) : (
                        <FileImage className="w-16 h-16 mb-2" />
                      )}
                      <p className="text-sm font-medium">{selectedFile.name}</p>
                      <p className="text-xs">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  )}
                </div>

                {/* Remove Button */}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 w-8 h-8"
                  onClick={handleRemoveFile}
                  disabled={disabled}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* File Info */}
              <div className="p-4 border-t bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm truncate max-w-[200px]">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(selectedFile.size)} • {selectedFile.type}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('file-input')?.click()}
                    disabled={disabled}
                  >
                    Change
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Error States */}
      {selectedFile && selectedFile.size > maxSize && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-destructive bg-destructive/5">
            <CardContent className="pt-4">
              <div className="flex items-center space-x-2 text-destructive">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  File too large. Maximum size is {Math.floor(maxSize / (1024 * 1024))}MB.
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
