

'use client';

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Type, 
  Upload, 
  Download, 
  Copy, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Zap, 
  Settings,
  RefreshCw,
  Hash,
  RotateCcw,
  Trash2,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TextCaseResult,
  TextStatistics,
  TransformationResult,
  TextCaseConverterOptions
} from '@/lib/types';
import { 
  TEXT_CASE_TYPES, 
  TEXT_TRANSFORMATIONS, 
  MAX_CASE_CONVERTER_LENGTH, 
  CASE_CONVERTER_DEBOUNCE 
} from '@/lib/constants';

export default function TextCaseConverterTool() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeCase, setActiveCase] = useState<string>('');
  const [statistics, setStatistics] = useState<TextStatistics | null>(null);
  const [caseResult, setCaseResult] = useState<TextCaseResult | null>(null);
  const [transformationResult, setTransformationResult] = useState<TransformationResult | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [error, setError] = useState<string>('');
  const [history, setHistory] = useState<Array<{text: string, operation: string}>>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const outputTextareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Advanced text statistics calculation
  const calculateStatistics = useCallback((text: string): TextStatistics => {
    const lines = text.split('\n').length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    const charactersWithoutSpaces = text.replace(/\s/g, '').length;
    const numbers = (text.match(/\d/g) || []).length;
    const specialCharacters = (text.match(/[^a-zA-Z0-9\s]/g) || []).length;
    const uppercaseLetters = (text.match(/[A-Z]/g) || []).length;
    const lowercaseLetters = (text.match(/[a-z]/g) || []).length;

    return {
      characters,
      charactersWithoutSpaces,
      words,
      lines,
      paragraphs,
      sentences,
      numbers,
      specialCharacters,
      uppercaseLetters,
      lowercaseLetters
    };
  }, []);

  // Case conversion algorithms
  const convertCase = useCallback((text: string, caseType: string): string => {
    const startTime = performance.now();
    
    try {
      let result = '';
      
      switch (caseType) {
        case 'uppercase':
          result = text.toUpperCase();
          break;
          
        case 'lowercase':
          result = text.toLowerCase();
          break;
          
        case 'titlecase':
          result = text.replace(/\w\S*/g, (txt) => 
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
          );
          break;
          
        case 'sentencecase':
          result = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (match) => 
            match.toUpperCase()
          );
          break;
          
        case 'capitalizewords':
          result = text.replace(/\b\w+/g, (word) => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          );
          break;
          
        case 'inversecase':
          result = text.split('').map(char => 
            char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
          ).join('');
          break;
          
        case 'alternatingcase':
          let shouldUpper = true;
          result = text.split('').map(char => {
            if (/[a-zA-Z]/.test(char)) {
              const converted = shouldUpper ? char.toUpperCase() : char.toLowerCase();
              shouldUpper = !shouldUpper;
              return converted;
            }
            return char;
          }).join('');
          break;
          
        case 'camelcase':
          result = text
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
              index === 0 ? word.toLowerCase() : word.toUpperCase()
            )
            .replace(/\s+/g, '');
          break;
          
        case 'pascalcase':
          result = text
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
            .replace(/\s+/g, '');
          break;
          
        case 'snakecase':
          result = text
            .replace(/\W+/g, ' ')
            .split(/ |\B(?=[A-Z])/)
            .map(word => word.toLowerCase())
            .join('_');
          break;
          
        case 'kebabcase':
          result = text
            .replace(/\W+/g, ' ')
            .split(/ |\B(?=[A-Z])/)
            .map(word => word.toLowerCase())
            .join('-');
          break;
          
        case 'dotcase':
          result = text
            .replace(/\W+/g, ' ')
            .split(/ |\B(?=[A-Z])/)
            .map(word => word.toLowerCase())
            .join('.');
          break;
          
        default:
          result = text;
      }
      
      const processingTime = performance.now() - startTime;
      const stats = calculateStatistics(result);
      
      const caseResult: TextCaseResult = {
        originalText: text,
        convertedText: result,
        caseType,
        processingTime,
        statistics: stats,
        success: true
      };
      
      setCaseResult(caseResult);
      setOutputText(result);
      setStatistics(stats);
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Case conversion failed';
      setError(errorMessage);
      return text;
    }
  }, [calculateStatistics]);

  // Text transformation algorithms
  const transformText = useCallback((text: string, transformationType: string): string => {
    const startTime = performance.now();
    
    try {
      let result = '';
      
      switch (transformationType) {
        case 'removeextraspaces':
          result = text.replace(/\s+/g, ' ').trim();
          break;
          
        case 'removeallspaces':
          result = text.replace(/\s/g, '');
          break;
          
        case 'addlinebreaks':
          const words = text.split(' ');
          const wordsPerLine = 10; // Default 10 words per line
          result = words.reduce((acc, word, index) => {
            if (index > 0 && index % wordsPerLine === 0) {
              return acc + '\n' + word;
            }
            return acc + (index > 0 ? ' ' : '') + word;
          }, '');
          break;
          
        case 'removelinebreaks':
          result = text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
          break;
          
        case 'slugify':
          result = text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
          break;
          
        case 'reversetext':
          result = text.split('').reverse().join('');
          break;
          
        case 'removenumbers':
          result = text.replace(/\d/g, '');
          break;
          
        case 'removespecialchars':
          result = text.replace(/[^a-zA-Z0-9\s]/g, '');
          break;
          
        case 'extractnumbers':
          result = (text.match(/\d/g) || []).join('');
          break;
          
        case 'extractletters':
          result = (text.match(/[a-zA-Z]/g) || []).join('');
          break;
          
        default:
          result = text;
      }
      
      const processingTime = performance.now() - startTime;
      const stats = calculateStatistics(result);
      
      const transformResult: TransformationResult = {
        originalText: text,
        transformedText: result,
        transformationType,
        processingTime,
        statistics: stats,
        success: true
      };
      
      setTransformationResult(transformResult);
      setOutputText(result);
      setStatistics(stats);
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Text transformation failed';
      setError(errorMessage);
      return text;
    }
  }, [calculateStatistics]);

  // Debounced input handling
  const handleInputChange = useCallback((value: string) => {
    if (value.length > MAX_CASE_CONVERTER_LENGTH) {
      setError(`Text length exceeds maximum limit of ${MAX_CASE_CONVERTER_LENGTH.toLocaleString()} characters`);
      return;
    }
    
    setError('');
    setInputText(value);
    setStatistics(calculateStatistics(value));
    
    // Clear existing debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // If there's an active case, apply it after debounce
    if (activeCase && value.trim()) {
      debounceRef.current = setTimeout(() => {
        setIsProcessing(true);
        convertCase(value, activeCase);
        setIsProcessing(false);
      }, CASE_CONVERTER_DEBOUNCE);
    }
  }, [activeCase, convertCase, calculateStatistics]);

  // Handle case conversion
  const handleCaseConversion = useCallback((caseType: string) => {
    if (!inputText.trim()) {
      setError('Please enter some text to convert');
      return;
    }
    
    setIsProcessing(true);
    setActiveCase(caseType);
    setError('');
    
    // Add to history
    const newHistory = [...history.slice(0, historyIndex + 1), {
      text: inputText,
      operation: caseType
    }];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    setTimeout(() => {
      convertCase(inputText, caseType);
      setIsProcessing(false);
    }, 50);
  }, [inputText, convertCase, history, historyIndex]);

  // Handle text transformation
  const handleTransformation = useCallback((transformationType: string) => {
    if (!inputText.trim()) {
      setError('Please enter some text to transform');
      return;
    }
    
    setIsProcessing(true);
    setError('');
    
    // Add to history
    const newHistory = [...history.slice(0, historyIndex + 1), {
      text: inputText,
      operation: transformationType
    }];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    setTimeout(() => {
      transformText(inputText, transformationType);
      setIsProcessing(false);
    }, 50);
  }, [inputText, transformText, history, historyIndex]);

  // File upload handling
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      handleInputChange(content);
    };
    reader.readAsText(file);
  }, [handleInputChange]);

  // Copy to clipboard
  const handleCopy = useCallback(async () => {
    if (!outputText) return;
    
    try {
      await navigator.clipboard.writeText(outputText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  }, [outputText]);

  // Download as file
  const handleDownload = useCallback(() => {
    if (!outputText) return;
    
    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted-text-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [outputText]);

  // Clear all
  const handleClear = useCallback(() => {
    setInputText('');
    setOutputText('');
    setActiveCase('');
    setStatistics(null);
    setCaseResult(null);
    setTransformationResult(null);
    setError('');
    setHistory([]);
    setHistoryIndex(-1);
  }, []);

  // Undo functionality
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevHistoryIndex = historyIndex - 1;
      const prevItem = history[prevHistoryIndex];
      setHistoryIndex(prevHistoryIndex);
      setInputText(prevItem.text);
      handleInputChange(prevItem.text);
    }
  }, [history, historyIndex, handleInputChange]);

  // Calculate input statistics on mount
  useEffect(() => {
    if (inputText) {
      setStatistics(calculateStatistics(inputText));
    }
  }, [inputText, calculateStatistics]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4"
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Section */}
      <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Type className="w-5 h-5 text-blue-600" />
            <span>Text Input</span>
            <Badge variant="secondary" className="ml-auto">
              {inputText.length.toLocaleString()} / {MAX_CASE_CONVERTER_LENGTH.toLocaleString()} characters
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="flex-shrink-0"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="flex-shrink-0"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
            {historyIndex > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleUndo}
                className="flex-shrink-0"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Undo
              </Button>
            )}
          </div>
          
          <Textarea
            placeholder="Enter your text here to convert case or apply transformations..."
            value={inputText}
            onChange={(e) => handleInputChange(e.target.value)}
            className="min-h-32 text-base resize-y"
            maxLength={MAX_CASE_CONVERTER_LENGTH}
          />
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.csv,.json,.xml"
            onChange={handleFileUpload}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Case Conversion Buttons */}
      <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-green-600" />
            <span>Case Conversions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {TEXT_CASE_TYPES.map((caseType) => (
              <Button
                key={caseType.id}
                variant={activeCase === caseType.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleCaseConversion(caseType.id)}
                disabled={isProcessing || !inputText.trim()}
                className="justify-start text-left h-auto py-3 px-4 relative group"
                title={caseType.description}
              >
                <div className="flex flex-col items-start w-full">
                  <span className="font-medium text-sm">{caseType.name}</span>
                  <span className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {caseType.description}
                  </span>
                </div>
                {isProcessing && activeCase === caseType.id && (
                  <RefreshCw className="w-3 h-3 animate-spin absolute top-2 right-2" />
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Text Transformations */}
      <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-purple-600" />
            <span>Text Transformations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {TEXT_TRANSFORMATIONS.map((transformation) => (
              <Button
                key={transformation.id}
                variant="outline"
                size="sm"
                onClick={() => handleTransformation(transformation.id)}
                disabled={isProcessing || !inputText.trim()}
                className="justify-start text-left h-auto py-3 px-3 relative group"
                title={transformation.description}
              >
                <div className="flex flex-col items-start w-full">
                  <span className="font-medium text-xs">{transformation.name}</span>
                  <span className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {transformation.description}
                  </span>
                </div>
                {isProcessing && (
                  <RefreshCw className="w-3 h-3 animate-spin absolute top-2 right-2" />
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Output */}
        <div className="lg:col-span-2">
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  <span>Output</span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    disabled={!outputText}
                    className="flex-shrink-0"
                  >
                    {copySuccess ? (
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    {copySuccess ? 'Copied!' : 'Copy'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    disabled={!outputText}
                    className="flex-shrink-0"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                ref={outputTextareaRef}
                value={outputText}
                readOnly
                placeholder="Converted text will appear here..."
                className="min-h-32 text-base resize-y font-mono"
              />
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div>
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <Hash className="w-5 h-5 text-blue-600" />
                <span>Statistics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {statistics ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {statistics.characters.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Characters</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {statistics.words.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Words</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Characters (no spaces):</span>
                      <span className="font-mono">{statistics.charactersWithoutSpaces.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lines:</span>
                      <span className="font-mono">{statistics.lines.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Paragraphs:</span>
                      <span className="font-mono">{statistics.paragraphs.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sentences:</span>
                      <span className="font-mono">{statistics.sentences.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Numbers:</span>
                      <span className="font-mono">{statistics.numbers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Special chars:</span>
                      <span className="font-mono">{statistics.specialCharacters.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Uppercase:</span>
                      <span className="font-mono">{statistics.uppercaseLetters.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lowercase:</span>
                      <span className="font-mono">{statistics.lowercaseLetters.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {(caseResult?.processingTime || transformationResult?.processingTime) && (
                    <>
                      <Separator />
                      <div className="text-center">
                        <div className="text-lg font-semibold text-purple-600">
                          {(caseResult?.processingTime || transformationResult?.processingTime)?.toFixed(2)}ms
                        </div>
                        <div className="text-xs text-muted-foreground">Processing Time</div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <Hash className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Enter text to see statistics</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
