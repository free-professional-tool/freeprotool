
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  GitCompare, 
  Upload, 
  Download, 
  Copy, 
  Settings, 
  BarChart3,
  FileText,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  TextComparisonOptions,
  TextComparisonResult,
  DiffChunk,
  DiffStatistics,
  LCSResult,
  DiffOperation
} from '@/lib/types';
import { 
  TEXT_COMPARISON_MODES,
  TEXT_COMPARISON_VIEW_MODES,
  DIFF_COLORS,
  MAX_TEXT_COMPARISON_LENGTH,
  DEBOUNCE_DELAY
} from '@/lib/constants';

// Custom hook for debounced comparison
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Longest Common Subsequence algorithm implementation
function computeLCS(text1: string[], text2: string[]): LCSResult {
  const m = text1.length;
  const n = text2.length;
  const matrix = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  // Build LCS matrix
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1] + 1;
      } else {
        matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
      }
    }
  }

  // Reconstruct LCS
  const lcs: string[] = [];
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (text1[i - 1] === text2[j - 1]) {
      lcs.unshift(text1[i - 1]);
      i--;
      j--;
    } else if (matrix[i - 1][j] > matrix[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return {
    length: matrix[m][n],
    sequence: lcs,
    matrix
  };
}

// Generate diff operations from LCS
function generateDiffOperations(text1: string[], text2: string[], lcs: string[]): DiffOperation[] {
  const operations: DiffOperation[] = [];
  let i = 0, j = 0, k = 0;

  while (i < text1.length || j < text2.length) {
    if (k < lcs.length && i < text1.length && text1[i] === lcs[k]) {
      // Equal operation
      operations.push({
        operation: 'equal',
        text: text1[i],
        position: i,
        length: 1
      });
      i++;
      j++;
      k++;
    } else if (i < text1.length && (k >= lcs.length || text1[i] !== lcs[k])) {
      // Delete operation
      operations.push({
        operation: 'delete',
        text: text1[i],
        position: i,
        length: 1
      });
      i++;
    } else if (j < text2.length) {
      // Insert operation
      operations.push({
        operation: 'insert',
        text: text2[j],
        position: j,
        length: 1
      });
      j++;
    }
  }

  return operations;
}

// Convert diff operations to chunks
function operationsToChunks(operations: DiffOperation[], options: TextComparisonOptions): DiffChunk[] {
  const chunks: DiffChunk[] = [];
  let currentChunk: DiffChunk | null = null;

  operations.forEach((op, index) => {
    let chunkType: DiffChunk['type'];
    
    switch (op.operation) {
      case 'equal':
        chunkType = 'unchanged';
        break;
      case 'delete':
        chunkType = 'removed';
        break;
      case 'insert':
        chunkType = 'added';
        break;
      default:
        chunkType = 'modified';
    }

    if (currentChunk && currentChunk.type === chunkType) {
      // Extend current chunk
      currentChunk.content += (options.mode === 'word' ? ' ' : '') + op.text;
    } else {
      // Create new chunk
      if (currentChunk) {
        chunks.push(currentChunk);
      }
      currentChunk = {
        type: chunkType,
        content: op.text,
        originalStart: op.position,
        originalEnd: op.position + op.length,
        lineNumber: index + 1
      };
    }
  });

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

// Calculate diff statistics
function calculateStatistics(chunks: DiffChunk[], originalText: string, modifiedText: string): DiffStatistics {
  let addedLines = 0, removedLines = 0, modifiedLines = 0, unchangedLines = 0;
  let addedWords = 0, removedWords = 0, modifiedWords = 0, unchangedWords = 0;
  let addedChars = 0, removedChars = 0, modifiedChars = 0, unchangedChars = 0;

  chunks.forEach(chunk => {
    const lines = chunk.content.split('\n').length;
    const words = chunk.content.split(/\s+/).filter(w => w.length > 0).length;
    const chars = chunk.content.length;

    switch (chunk.type) {
      case 'added':
        addedLines += lines;
        addedWords += words;
        addedChars += chars;
        break;
      case 'removed':
        removedLines += lines;
        removedWords += words;
        removedChars += chars;
        break;
      case 'modified':
        modifiedLines += lines;
        modifiedWords += words;
        modifiedChars += chars;
        break;
      case 'unchanged':
        unchangedLines += lines;
        unchangedWords += words;
        unchangedChars += chars;
        break;
    }
  });

  const totalLines = Math.max(originalText.split('\n').length, modifiedText.split('\n').length);
  const totalChars = Math.max(originalText.length, modifiedText.length);
  const similarityPercentage = totalChars > 0 ? Math.round((unchangedChars / totalChars) * 100) : 100;

  return {
    totalLines,
    addedLines,
    removedLines,
    modifiedLines,
    unchangedLines,
    addedWords,
    removedWords,
    modifiedWords,
    unchangedWords,
    addedChars,
    removedChars,
    modifiedChars,
    unchangedChars,
    similarityPercentage
  };
}

// Main diff function
function compareTexts(originalText: string, modifiedText: string, options: TextComparisonOptions): TextComparisonResult {
  const startTime = performance.now();

  try {
    // Validate input lengths
    if (originalText.length > MAX_TEXT_COMPARISON_LENGTH || modifiedText.length > MAX_TEXT_COMPARISON_LENGTH) {
      throw new Error(`Text length exceeds maximum limit of ${MAX_TEXT_COMPARISON_LENGTH.toLocaleString()} characters`);
    }

    // Preprocess texts based on options
    let text1 = originalText;
    let text2 = modifiedText;

    if (!options.caseSensitive) {
      text1 = text1.toLowerCase();
      text2 = text2.toLowerCase();
    }

    if (options.ignoreWhitespace) {
      text1 = text1.replace(/\s+/g, ' ').trim();
      text2 = text2.replace(/\s+/g, ' ').trim();
    }

    // Split texts based on comparison mode
    let tokens1: string[];
    let tokens2: string[];

    switch (options.mode) {
      case 'word':
        tokens1 = text1.split(/\s+/).filter(token => token.length > 0);
        tokens2 = text2.split(/\s+/).filter(token => token.length > 0);
        break;
      case 'line':
        tokens1 = text1.split('\n');
        tokens2 = text2.split('\n');
        break;
      case 'char':
      default:
        tokens1 = text1.split('');
        tokens2 = text2.split('');
        break;
    }

    // Compute LCS and generate diff operations
    const lcs = computeLCS(tokens1, tokens2);
    const operations = generateDiffOperations(tokens1, tokens2, lcs.sequence);
    const chunks = operationsToChunks(operations, options);
    const statistics = calculateStatistics(chunks, originalText, modifiedText);

    const processingTime = performance.now() - startTime;

    return {
      originalText,
      modifiedText,
      chunks,
      statistics,
      processingTime,
      options,
      success: true
    };
  } catch (error) {
    const processingTime = performance.now() - startTime;
    return {
      originalText,
      modifiedText,
      chunks: [],
      statistics: {
        totalLines: 0,
        addedLines: 0,
        removedLines: 0,
        modifiedLines: 0,
        unchangedLines: 0,
        addedWords: 0,
        removedWords: 0,
        modifiedWords: 0,
        unchangedWords: 0,
        addedChars: 0,
        removedChars: 0,
        modifiedChars: 0,
        unchangedChars: 0,
        similarityPercentage: 0
      },
      processingTime,
      options,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export default function TextComparisonTool() {
  // State management
  const [originalText, setOriginalText] = useState('');
  const [modifiedText, setModifiedText] = useState('');
  const [comparisonResult, setComparisonResult] = useState<TextComparisonResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Comparison options
  const [options, setOptions] = useState<TextComparisonOptions>({
    mode: 'word',
    viewMode: 'side-by-side',
    caseSensitive: true,
    ignoreWhitespace: false,
    showLineNumbers: true,
    contextLines: 3
  });

  // File refs
  const originalFileRef = useRef<HTMLInputElement>(null);
  const modifiedFileRef = useRef<HTMLInputElement>(null);

  // Debounced values for real-time comparison
  const debouncedOriginalText = useDebounce(originalText, DEBOUNCE_DELAY);
  const debouncedModifiedText = useDebounce(modifiedText, DEBOUNCE_DELAY);
  const debouncedOptions = useDebounce(options, DEBOUNCE_DELAY);

  // Auto-compare when inputs change
  useEffect(() => {
    if (debouncedOriginalText || debouncedModifiedText) {
      handleCompare();
    }
  }, [debouncedOriginalText, debouncedModifiedText, debouncedOptions]);

  // Handle comparison
  const handleCompare = useCallback(() => {
    if (!originalText.trim() && !modifiedText.trim()) {
      setComparisonResult(null);
      return;
    }

    setIsProcessing(true);
    
    // Use setTimeout to allow UI to update
    setTimeout(() => {
      const result = compareTexts(originalText, modifiedText, options);
      setComparisonResult(result);
      setIsProcessing(false);

      if (!result.success && result.error) {
        toast.error(result.error);
      }
    }, 10);
  }, [originalText, modifiedText, options]);

  // Handle file upload
  const handleFileUpload = useCallback((file: File, isOriginal: boolean) => {
    if (file.size > MAX_TEXT_COMPARISON_LENGTH) {
      toast.error(`File size exceeds maximum limit of ${(MAX_TEXT_COMPARISON_LENGTH / 1024 / 1024).toFixed(1)}MB`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (isOriginal) {
        setOriginalText(content);
      } else {
        setModifiedText(content);
      }
      toast.success(`File uploaded successfully`);
    };
    reader.onerror = () => {
      toast.error('Failed to read file');
    };
    reader.readAsText(file);
  }, []);

  // Export functions
  const exportAsHTML = useCallback(() => {
    if (!comparisonResult) return;

    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Text Comparison Result</title>
    <style>
        body { font-family: monospace; line-height: 1.5; margin: 20px; }
        .added { background-color: ${DIFF_COLORS.added}20; color: ${DIFF_COLORS.added}; }
        .removed { background-color: ${DIFF_COLORS.removed}20; color: ${DIFF_COLORS.removed}; text-decoration: line-through; }
        .modified { background-color: ${DIFF_COLORS.modified}20; color: ${DIFF_COLORS.modified}; }
        .unchanged { color: ${DIFF_COLORS.unchanged}; }
        .stats { margin: 20px 0; padding: 10px; background: #f5f5f5; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>Text Comparison Result</h1>
    <div class="stats">
        <h3>Statistics</h3>
        <p>Similarity: ${comparisonResult.statistics.similarityPercentage}%</p>
        <p>Added: ${comparisonResult.statistics.addedWords} words, ${comparisonResult.statistics.addedChars} chars</p>
        <p>Removed: ${comparisonResult.statistics.removedWords} words, ${comparisonResult.statistics.removedChars} chars</p>
        <p>Modified: ${comparisonResult.statistics.modifiedWords} words, ${comparisonResult.statistics.modifiedChars} chars</p>
    </div>
    <div class="diff">
        ${comparisonResult.chunks.map(chunk => 
          `<span class="${chunk.type}">${chunk.content}</span>`
        ).join('')}
    </div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'text-comparison-result.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('HTML report exported successfully');
  }, [comparisonResult]);

  const copyToClipboard = useCallback(async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  }, []);

  // Render highlighted text
  const renderHighlightedText = (chunks: DiffChunk[], viewMode: string) => {
    if (viewMode === 'side-by-side') {
      return (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <h4 className="font-medium text-sm text-gray-600 dark:text-gray-400">Original Text</h4>
            <div className="bg-gray-50 dark:bg-gray-900 rounded p-4 font-mono text-sm min-h-[200px] max-h-[400px] overflow-auto">
              {chunks.filter(chunk => chunk.type !== 'added').map((chunk, index) => (
                <span
                  key={index}
                  className={`${
                    chunk.type === 'removed' ? 'bg-red-100 text-red-800 line-through dark:bg-red-900/30 dark:text-red-400' :
                    chunk.type === 'modified' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                    'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {chunk.content}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <h4 className="font-medium text-sm text-gray-600 dark:text-gray-400">Modified Text</h4>
            <div className="bg-gray-50 dark:bg-gray-900 rounded p-4 font-mono text-sm min-h-[200px] max-h-[400px] overflow-auto">
              {chunks.filter(chunk => chunk.type !== 'removed').map((chunk, index) => (
                <span
                  key={index}
                  className={`${
                    chunk.type === 'added' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    chunk.type === 'modified' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                    'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {chunk.content}
                </span>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Unified view
    return (
      <div className="bg-gray-50 dark:bg-gray-900 rounded p-4 font-mono text-sm max-h-[400px] overflow-auto">
        {chunks.map((chunk, index) => (
          <span
            key={index}
            className={`${
              chunk.type === 'added' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
              chunk.type === 'removed' ? 'bg-red-100 text-red-800 line-through dark:bg-red-900/30 dark:text-red-400' :
              chunk.type === 'modified' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
              'text-gray-600 dark:text-gray-300'
            }`}
          >
            {chunk.content}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GitCompare className="w-6 h-6 text-blue-600" />
              <CardTitle>Text Comparison & Diff Tool</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              {comparisonResult && (
                <>
                  <Button variant="outline" size="sm" onClick={exportAsHTML}>
                    <Download className="w-4 h-4 mr-2" />
                    Export HTML
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(comparisonResult.chunks.map(c => c.content).join(''))}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Result
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Settings Panel */}
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-4"
            >
              <h3 className="font-medium mb-4">Comparison Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Comparison Mode</Label>
                  <Select
                    value={options.mode}
                    onValueChange={(value: 'word' | 'char' | 'line') => 
                      setOptions(prev => ({ ...prev, mode: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TEXT_COMPARISON_MODES.map(mode => (
                        <SelectItem key={mode.id} value={mode.id}>
                          {mode.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>View Mode</Label>
                  <Select
                    value={options.viewMode}
                    onValueChange={(value: 'side-by-side' | 'unified' | 'inline') => 
                      setOptions(prev => ({ ...prev, viewMode: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TEXT_COMPARISON_VIEW_MODES.map(mode => (
                        <SelectItem key={mode.id} value={mode.id}>
                          {mode.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="case-sensitive"
                      checked={options.caseSensitive}
                      onCheckedChange={(checked) => 
                        setOptions(prev => ({ ...prev, caseSensitive: checked }))
                      }
                    />
                    <Label htmlFor="case-sensitive">Case Sensitive</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="ignore-whitespace"
                      checked={options.ignoreWhitespace}
                      onCheckedChange={(checked) => 
                        setOptions(prev => ({ ...prev, ignoreWhitespace: checked }))
                      }
                    />
                    <Label htmlFor="ignore-whitespace">Ignore Whitespace</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-line-numbers"
                      checked={options.showLineNumbers}
                      onCheckedChange={(checked) => 
                        setOptions(prev => ({ ...prev, showLineNumbers: checked }))
                      }
                    />
                    <Label htmlFor="show-line-numbers">Show Line Numbers</Label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Text Input Areas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="original-text">Original Text</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => originalFileRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                  <input
                    ref={originalFileRef}
                    type="file"
                    accept=".txt,.md,.json,.js,.ts,.py,.java,.cpp,.c,.html,.css,.xml,.yaml,.yml"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, true);
                    }}
                    className="hidden"
                  />
                  <Badge variant="secondary">
                    {originalText.length.toLocaleString()} chars
                  </Badge>
                </div>
              </div>
              <textarea
                id="original-text"
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                placeholder="Paste your original text here..."
                className="w-full h-64 p-3 border rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={MAX_TEXT_COMPARISON_LENGTH}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="modified-text">Modified Text</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => modifiedFileRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                  <input
                    ref={modifiedFileRef}
                    type="file"
                    accept=".txt,.md,.json,.js,.ts,.py,.java,.cpp,.c,.html,.css,.xml,.yaml,.yml"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, false);
                    }}
                    className="hidden"
                  />
                  <Badge variant="secondary">
                    {modifiedText.length.toLocaleString()} chars
                  </Badge>
                </div>
              </div>
              <textarea
                id="modified-text"
                value={modifiedText}
                onChange={(e) => setModifiedText(e.target.value)}
                placeholder="Paste your modified text here..."
                className="w-full h-64 p-3 border rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={MAX_TEXT_COMPARISON_LENGTH}
              />
            </div>
          </div>

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="flex items-center justify-center space-x-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Processing comparison...</span>
            </div>
          )}

          {/* Comparison Results */}
          {comparisonResult && !isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {comparisonResult.statistics.similarityPercentage}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Similarity</div>
                </Card>
                
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    +{comparisonResult.statistics.addedWords}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Added Words</div>
                </Card>
                
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    -{comparisonResult.statistics.removedWords}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Removed Words</div>
                </Card>
                
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-amber-600">
                    ~{comparisonResult.statistics.modifiedWords}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Modified Words</div>
                </Card>
              </div>

              {/* Diff Visualization */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Comparison Result</h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Processed in {comparisonResult.processingTime.toFixed(2)}ms
                  </div>
                </div>
                
                {comparisonResult.success ? (
                  renderHighlightedText(comparisonResult.chunks, comparisonResult.options.viewMode)
                ) : (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-800 dark:text-red-400">
                      Error: {comparisonResult.error}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
