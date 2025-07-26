
'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, 
  Upload, 
  Download, 
  Copy, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Zap, 
  Settings,
  RefreshCw,
  Search,
  Hash,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TextValidationResult, 
  ConversionResult, 
  RegexTestResult, 
  ValidationError,
  RegexMatch
} from '@/lib/types';
import { MAX_TEXT_LENGTH, MAX_TEXT_FILE_SIZE } from '@/lib/constants';

export default function TextUtilitiesTool() {
  const [activeTab, setActiveTab] = useState('json-formatter');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationResult, setValidationResult] = useState<TextValidationResult | null>(null);
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [regexResult, setRegexResult] = useState<RegexTestResult | null>(null);
  
  // JSON formatter settings
  const [jsonIndentation, setJsonIndentation] = useState(2);
  const [jsonSortKeys, setJsonSortKeys] = useState(false);
  
  // CSV settings
  const [csvDelimiter, setCsvDelimiter] = useState(',');
  const [csvHasHeaders, setCsvHasHeaders] = useState(true);
  
  // YAML settings
  const [yamlIndentation, setYamlIndentation] = useState(2);
  
  // Regex settings
  const [regexPattern, setRegexPattern] = useState('');
  const [regexFlags, setRegexFlags] = useState('g');
  const [regexTestString, setRegexTestString] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // JSON Utilities
  const formatJson = useCallback((input: string): TextValidationResult => {
    const startTime = Date.now();
    try {
      const parsed = JSON.parse(input);
      let formatted = JSON.stringify(parsed, null, jsonIndentation);
      
      if (jsonSortKeys) {
        const sortedParsed = sortObjectKeys(parsed);
        formatted = JSON.stringify(sortedParsed, null, jsonIndentation);
      }
      
      return {
        isValid: true,
        errors: [],
        formatted,
        stats: {
          lines: formatted.split('\n').length,
          characters: formatted.length,
          size: new Blob([formatted]).size
        }
      };
    } catch (error: any) {
      const errorMatch = error.message.match(/at position (\d+)/);
      const position = errorMatch ? parseInt(errorMatch[1]) : 0;
      const lines = input.substring(0, position).split('\n');
      const line = lines.length;
      const column = lines[lines.length - 1].length + 1;
      
      return {
        isValid: false,
        errors: [{
          line,
          column,
          message: error.message,
          type: 'syntax'
        }],
        stats: {
          lines: input.split('\n').length,
          characters: input.length,
          size: new Blob([input]).size
        }
      };
    }
  }, [jsonIndentation, jsonSortKeys]);

  const sortObjectKeys = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(sortObjectKeys);
    } else if (obj !== null && typeof obj === 'object') {
      const sorted: any = {};
      Object.keys(obj).sort().forEach(key => {
        sorted[key] = sortObjectKeys(obj[key]);
      });
      return sorted;
    }
    return obj;
  };

  // Basic YAML parser (limited implementation)
  const formatYaml = useCallback((input: string): TextValidationResult => {
    try {
      // Simple YAML validation and formatting
      const lines = input.split('\n');
      const formatted: string[] = [];
      let indentLevel = 0;
      const errors: ValidationError[] = [];
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.startsWith('#')) {
          formatted.push(line);
          continue;
        }
        
        // Basic key-value detection
        if (line.includes(':')) {
          const [key, ...valueParts] = line.split(':');
          const value = valueParts.join(':').trim();
          
          // Check for arrays
          if (line.trim().startsWith('- ')) {
            formatted.push('  '.repeat(indentLevel) + line);
          } else {
            formatted.push('  '.repeat(indentLevel) + `${key.trim()}: ${value}`);
          }
        } else if (line.startsWith('- ')) {
          formatted.push('  '.repeat(indentLevel) + line);
        } else {
          formatted.push('  '.repeat(indentLevel) + line);
        }
      }
      
      const result = formatted.join('\n');
      return {
        isValid: errors.length === 0,
        errors,
        formatted: result,
        stats: {
          lines: result.split('\n').length,
          characters: result.length,
          size: new Blob([result]).size
        }
      };
    } catch (error: any) {
      return {
        isValid: false,
        errors: [{
          line: 1,
          column: 1,
          message: 'YAML parsing error: ' + error.message,
          type: 'syntax'
        }],
        stats: {
          lines: input.split('\n').length,
          characters: input.length,
          size: new Blob([input]).size
        }
      };
    }
  }, [yamlIndentation]);

  // CSV Utilities
  const parseCSV = useCallback((csv: string): string[][] => {
    const result: string[][] = [];
    let current = '';
    let inQuotes = false;
    let row: string[] = [];
    
    for (let i = 0; i < csv.length; i++) {
      const char = csv[i];
      const nextChar = csv[i + 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === csvDelimiter && !inQuotes) {
        row.push(current.trim());
        current = '';
      } else if ((char === '\n' || char === '\r') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') {
          i++; // Skip \n after \r
        }
        row.push(current.trim());
        result.push(row);
        row = [];
        current = '';
      } else {
        current += char;
      }
    }
    
    if (current || row.length > 0) {
      row.push(current.trim());
      result.push(row);
    }
    
    return result.filter(r => r.some(cell => cell.length > 0));
  }, [csvDelimiter]);

  const formatCsv = useCallback((input: string): TextValidationResult => {
    try {
      const parsed = parseCSV(input);
      if (parsed.length === 0) {
        return {
          isValid: false,
          errors: [{
            line: 1,
            column: 1,
            message: 'No valid CSV data found',
            type: 'structure'
          }],
          stats: {
            lines: 0,
            characters: 0,
            size: 0
          }
        };
      }
      
      const formatted = parsed.map(row => 
        row.map(cell => 
          cell.includes(csvDelimiter) || cell.includes('"') || cell.includes('\n') 
            ? `"${cell.replace(/"/g, '""')}"` 
            : cell
        ).join(csvDelimiter)
      ).join('\n');
      
      return {
        isValid: true,
        errors: [],
        formatted,
        stats: {
          lines: parsed.length,
          characters: formatted.length,
          size: new Blob([formatted]).size
        }
      };
    } catch (error: any) {
      return {
        isValid: false,
        errors: [{
          line: 1,
          column: 1,
          message: 'CSV parsing error: ' + error.message,
          type: 'syntax'
        }],
        stats: {
          lines: input.split('\n').length,
          characters: input.length,
          size: new Blob([input]).size
        }
      };
    }
  }, [csvDelimiter, parseCSV]);

  // Format Converters
  const csvToJson = useCallback((csvInput: string): ConversionResult => {
    const startTime = Date.now();
    try {
      const parsed = parseCSV(csvInput);
      if (parsed.length === 0) {
        throw new Error('No valid CSV data found');
      }
      
      let jsonResult;
      if (csvHasHeaders && parsed.length > 1) {
        const headers = parsed[0];
        const data = parsed.slice(1).map(row => {
          const obj: Record<string, string> = {};
          headers.forEach((header, index) => {
            obj[header] = row[index] || '';
          });
          return obj;
        });
        jsonResult = JSON.stringify(data, null, 2);
      } else {
        jsonResult = JSON.stringify(parsed, null, 2);
      }
      
      return {
        success: true,
        originalFormat: 'csv',
        targetFormat: 'json',
        originalContent: csvInput,
        convertedContent: jsonResult,
        processingTime: Date.now() - startTime,
        stats: {
          originalSize: new Blob([csvInput]).size,
          convertedSize: new Blob([jsonResult]).size,
          compressionRatio: new Blob([jsonResult]).size / new Blob([csvInput]).size
        }
      };
    } catch (error: any) {
      return {
        success: false,
        originalFormat: 'csv',
        targetFormat: 'json',
        originalContent: csvInput,
        convertedContent: '',
        processingTime: Date.now() - startTime,
        stats: {
          originalSize: new Blob([csvInput]).size,
          convertedSize: 0,
          compressionRatio: 0
        },
        error: error.message
      };
    }
  }, [parseCSV, csvHasHeaders]);

  const jsonToCsv = useCallback((jsonInput: string): ConversionResult => {
    const startTime = Date.now();
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) {
        throw new Error('JSON must be an array for CSV conversion');
      }
      
      if (parsed.length === 0) {
        throw new Error('JSON array is empty');
      }
      
      // Get all unique keys from all objects
      const keys = new Set<string>();
      parsed.forEach(item => {
        if (typeof item === 'object' && item !== null) {
          Object.keys(item).forEach(key => keys.add(key));
        }
      });
      
      const keyArray = Array.from(keys);
      const csvLines: string[] = [];
      
      // Add headers if enabled
      if (csvHasHeaders) {
        csvLines.push(keyArray.join(csvDelimiter));
      }
      
      // Add data rows
      parsed.forEach(item => {
        if (typeof item === 'object' && item !== null) {
          const row = keyArray.map(key => {
            const value = item[key];
            const stringValue = value === null || value === undefined ? '' : String(value);
            return stringValue.includes(csvDelimiter) || stringValue.includes('"') || stringValue.includes('\n')
              ? `"${stringValue.replace(/"/g, '""')}"`
              : stringValue;
          });
          csvLines.push(row.join(csvDelimiter));
        }
      });
      
      const csvResult = csvLines.join('\n');
      
      return {
        success: true,
        originalFormat: 'json',
        targetFormat: 'csv',
        originalContent: jsonInput,
        convertedContent: csvResult,
        processingTime: Date.now() - startTime,
        stats: {
          originalSize: new Blob([jsonInput]).size,
          convertedSize: new Blob([csvResult]).size,
          compressionRatio: new Blob([csvResult]).size / new Blob([jsonInput]).size
        }
      };
    } catch (error: any) {
      return {
        success: false,
        originalFormat: 'json',
        targetFormat: 'csv',
        originalContent: jsonInput,
        convertedContent: '',
        processingTime: Date.now() - startTime,
        stats: {
          originalSize: new Blob([jsonInput]).size,
          convertedSize: 0,
          compressionRatio: 0
        },
        error: error.message
      };
    }
  }, [csvDelimiter, csvHasHeaders]);

  // Regex Tester
  const testRegex = useCallback((pattern: string, flags: string, testString: string): RegexTestResult => {
    const startTime = Date.now();
    try {
      const regex = new RegExp(pattern, flags);
      const matches: RegexMatch[] = [];
      let match;
      let matchCount = 0;
      const uniqueMatches = new Set<string>();
      
      if (flags.includes('g')) {
        while ((match = regex.exec(testString)) !== null && matchCount < 1000) {
          matches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
            namedGroups: match.groups
          });
          uniqueMatches.add(match[0]);
          matchCount++;
          
          // Prevent infinite loop on zero-length matches
          if (match[0].length === 0) {
            regex.lastIndex++;
          }
        }
      } else {
        match = regex.exec(testString);
        if (match) {
          matches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
            namedGroups: match.groups
          });
          uniqueMatches.add(match[0]);
        }
      }
      
      return {
        pattern,
        testString,
        flags,
        matches,
        isValid: true,
        processingTime: Date.now() - startTime,
        stats: {
          totalMatches: matches.length,
          uniqueMatches: uniqueMatches.size,
          executionTime: Date.now() - startTime
        }
      };
    } catch (error: any) {
      return {
        pattern,
        testString,
        flags,
        matches: [],
        isValid: false,
        error: error.message,
        processingTime: Date.now() - startTime,
        stats: {
          totalMatches: 0,
          uniqueMatches: 0,
          executionTime: Date.now() - startTime
        }
      };
    }
  }, []);

  // File handling
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (file.size > MAX_TEXT_FILE_SIZE) {
      alert(`File size exceeds ${MAX_TEXT_FILE_SIZE / (1024 * 1024)}MB limit`);
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content.length > MAX_TEXT_LENGTH) {
        alert(`File content exceeds ${MAX_TEXT_LENGTH.toLocaleString()} character limit`);
        return;
      }
      setInputText(content);
    };
    reader.readAsText(file);
  }, []);

  const downloadFile = useCallback((content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add a toast notification here
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }, []);

  // Process handlers for each tool
  const handleProcess = useCallback(async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    setValidationResult(null);
    setConversionResult(null);
    setRegexResult(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay for UX
      
      switch (activeTab) {
        case 'json-formatter':
          const jsonResult = formatJson(inputText);
          setValidationResult(jsonResult);
          if (jsonResult.formatted) {
            setOutputText(jsonResult.formatted);
          }
          break;
          
        case 'yaml-formatter':
          const yamlResult = formatYaml(inputText);
          setValidationResult(yamlResult);
          if (yamlResult.formatted) {
            setOutputText(yamlResult.formatted);
          }
          break;
          
        case 'csv-formatter':
          const csvResult = formatCsv(inputText);
          setValidationResult(csvResult);
          if (csvResult.formatted) {
            setOutputText(csvResult.formatted);
          }
          break;
          
        case 'csv-to-json':
          const csvToJsonResult = csvToJson(inputText);
          setConversionResult(csvToJsonResult);
          if (csvToJsonResult.success) {
            setOutputText(csvToJsonResult.convertedContent);
          }
          break;
          
        case 'json-to-csv':
          const jsonToCsvResult = jsonToCsv(inputText);
          setConversionResult(jsonToCsvResult);
          if (jsonToCsvResult.success) {
            setOutputText(jsonToCsvResult.convertedContent);
          }
          break;
          
        case 'regex-tester':
          const regexTestResult = testRegex(regexPattern, regexFlags, regexTestString || inputText);
          setRegexResult(regexTestResult);
          setOutputText(''); // Regex results are displayed differently
          break;
      }
    } finally {
      setIsProcessing(false);
    }
  }, [activeTab, inputText, regexPattern, regexFlags, regexTestString, formatJson, formatYaml, formatCsv, csvToJson, jsonToCsv, testRegex]);

  // Auto-process for regex tester
  useEffect(() => {
    if (activeTab === 'regex-tester' && regexPattern && (regexTestString || inputText)) {
      const timeoutId = setTimeout(() => {
        handleProcess();
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [activeTab, regexPattern, regexFlags, regexTestString, inputText, handleProcess]);

  const getTabContent = () => {
    switch (activeTab) {
      case 'json-formatter':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="json-indent">Indentation:</Label>
                <Select value={jsonIndentation.toString()} onValueChange={(v) => setJsonIndentation(parseInt(v))}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="8">8</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="sort-keys"
                  checked={jsonSortKeys}
                  onCheckedChange={setJsonSortKeys}
                />
                <Label htmlFor="sort-keys">Sort Keys</Label>
              </div>
            </div>
          </div>
        );
        
      case 'yaml-formatter':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="yaml-indent">Indentation:</Label>
              <Select value={yamlIndentation.toString()} onValueChange={(v) => setYamlIndentation(parseInt(v))}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      case 'csv-formatter':
      case 'csv-to-json':
      case 'json-to-csv':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="csv-delimiter">Delimiter:</Label>
                <Select value={csvDelimiter} onValueChange={setCsvDelimiter}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=",">,</SelectItem>
                    <SelectItem value=";">;</SelectItem>
                    <SelectItem value="|">|</SelectItem>
                    <SelectItem value="	">Tab</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="csv-headers"
                  checked={csvHasHeaders}
                  onCheckedChange={setCsvHasHeaders}
                />
                <Label htmlFor="csv-headers">Has Headers</Label>
              </div>
            </div>
          </div>
        );
        
      case 'regex-tester':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="regex-pattern">Regex Pattern</Label>
                <Input
                  id="regex-pattern"
                  value={regexPattern}
                  onChange={(e) => setRegexPattern(e.target.value)}
                  placeholder="Enter regex pattern..."
                  className="font-mono"
                />
              </div>
              <div>
                <Label htmlFor="regex-flags">Flags</Label>
                <Input
                  id="regex-flags"
                  value={regexFlags}
                  onChange={(e) => setRegexFlags(e.target.value)}
                  placeholder="gimuy"
                  className="font-mono"
                  maxLength={5}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="regex-test-string">Test String (or use input area below)</Label>
              <Textarea
                id="regex-test-string"
                value={regexTestString}
                onChange={(e) => setRegexTestString(e.target.value)}
                placeholder="Enter text to test against..."
                className="font-mono min-h-[100px]"
              />
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  const renderResults = () => {
    if (validationResult) {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {validationResult.isValid ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <Badge variant={validationResult.isValid ? "default" : "destructive"}>
              {validationResult.isValid ? 'Valid' : 'Invalid'}
            </Badge>
            {validationResult.stats && (
              <div className="flex gap-2 text-sm text-muted-foreground">
                <span>{validationResult.stats.lines} lines</span>
                <span>{validationResult.stats.characters} chars</span>
                <span>{(validationResult.stats.size / 1024).toFixed(1)} KB</span>
              </div>
            )}
          </div>
          
          {validationResult.errors.length > 0 && (
            <div className="space-y-2">
              {validationResult.errors.map((error, index) => (
                <Alert key={index} variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Line {error.line}, Column {error.column}: {error.message}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    if (conversionResult) {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {conversionResult.success ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <Badge variant={conversionResult.success ? "default" : "destructive"}>
              {conversionResult.success ? 'Converted' : 'Failed'}
            </Badge>
            {conversionResult.success && (
              <div className="flex gap-2 text-sm text-muted-foreground">
                <span>{conversionResult.originalFormat.toUpperCase()} → {conversionResult.targetFormat.toUpperCase()}</span>
                <span>{conversionResult.processingTime}ms</span>
                <span>{(conversionResult.stats.convertedSize / 1024).toFixed(1)} KB</span>
              </div>
            )}
          </div>
          
          {!conversionResult.success && conversionResult.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{conversionResult.error}</AlertDescription>
            </Alert>
          )}
        </div>
      );
    }
    
    if (regexResult) {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {regexResult.isValid ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <Badge variant={regexResult.isValid ? "default" : "destructive"}>
              {regexResult.isValid ? 'Valid Pattern' : 'Invalid Pattern'}
            </Badge>
            {regexResult.isValid && (
              <div className="flex gap-2 text-sm text-muted-foreground">
                <span>{regexResult.stats.totalMatches} matches</span>
                <span>{regexResult.stats.uniqueMatches} unique</span>
                <span>{regexResult.stats.executionTime}ms</span>
              </div>
            )}
          </div>
          
          {!regexResult.isValid && regexResult.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{regexResult.error}</AlertDescription>
            </Alert>
          )}
          
          {regexResult.isValid && regexResult.matches.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Matches:</h4>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {regexResult.matches.map((match, index) => (
                  <div key={index} className="p-3 bg-muted rounded border">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">Match {index + 1}</Badge>
                      <span className="text-sm text-muted-foreground">
                        Position: {match.index}
                      </span>
                    </div>
                    <div className="font-mono text-sm bg-background p-2 rounded">
                      "{match.match}"
                    </div>
                    {match.groups.length > 0 && (
                      <div className="mt-2">
                        <div className="text-sm font-medium">Capture Groups:</div>
                        {match.groups.map((group, groupIndex) => (
                          <div key={groupIndex} className="text-sm text-muted-foreground">
                            ${groupIndex + 1}: "{group}"
                          </div>
                        ))}
                      </div>
                    )}
                    {match.namedGroups && Object.keys(match.namedGroups).length > 0 && (
                      <div className="mt-2">
                        <div className="text-sm font-medium">Named Groups:</div>
                        {Object.entries(match.namedGroups).map(([name, value]) => (
                          <div key={name} className="text-sm text-muted-foreground">
                            {name}: "{value}"
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {regexResult.isValid && regexResult.matches.length === 0 && (
            <Alert>
              <Search className="h-4 w-4" />
              <AlertDescription>No matches found for the given pattern.</AlertDescription>
            </Alert>
          )}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="w-5 h-5" />
            Text Data Processing Suite
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              <TabsTrigger value="json-formatter">JSON</TabsTrigger>
              <TabsTrigger value="yaml-formatter">YAML</TabsTrigger>
              <TabsTrigger value="csv-formatter">CSV</TabsTrigger>
              <TabsTrigger value="csv-to-json">CSV→JSON</TabsTrigger>
              <TabsTrigger value="json-to-csv">JSON→CSV</TabsTrigger>
              <TabsTrigger value="regex-tester">Regex</TabsTrigger>
            </TabsList>
            
            <div className="mt-6 space-y-6">
              {/* Settings Panel */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {getTabContent()}
                </CardContent>
              </Card>
              
              {/* Input Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Input</CardTitle>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          onChange={handleFileUpload}
                          accept=".json,.yaml,.yml,.csv,.txt"
                          className="hidden"
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={`Paste your ${activeTab.includes('json') ? 'JSON' : activeTab.includes('yaml') ? 'YAML' : activeTab.includes('csv') ? 'CSV' : 'text'} data here...`}
                      className="min-h-[300px] font-mono text-sm resize-none"
                      maxLength={MAX_TEXT_LENGTH}
                    />
                    <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                      <span>{inputText.length.toLocaleString()} / {MAX_TEXT_LENGTH.toLocaleString()} characters</span>
                      <Button
                        onClick={handleProcess}
                        disabled={!inputText.trim() || isProcessing}
                        size="sm"
                      >
                        {isProcessing ? (
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Play className="w-4 h-4 mr-2" />
                        )}
                        {activeTab.includes('formatter') ? 'Format' : 
                         activeTab.includes('converter') || activeTab.includes('to-') ? 'Convert' : 
                         'Test'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Output Section */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {activeTab === 'regex-tester' ? 'Results' : 'Output'}
                      </CardTitle>
                      {outputText && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(outputText)}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const extension = activeTab.includes('json') ? '.json' : 
                                             activeTab.includes('yaml') ? '.yaml' : 
                                             activeTab.includes('csv') ? '.csv' : '.txt';
                              const filename = `formatted-${Date.now()}${extension}`;
                              const mimeType = activeTab.includes('json') ? 'application/json' : 
                                             activeTab.includes('yaml') ? 'text/yaml' : 
                                             activeTab.includes('csv') ? 'text/csv' : 'text/plain';
                              downloadFile(outputText, filename, mimeType);
                            }}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {activeTab === 'regex-tester' ? (
                      <div className="min-h-[300px]">
                        {renderResults()}
                      </div>
                    ) : (
                      <>
                        <Textarea
                          value={outputText}
                          readOnly
                          placeholder="Processed output will appear here..."
                          className="min-h-[300px] font-mono text-sm resize-none"
                        />
                        {renderResults()}
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
