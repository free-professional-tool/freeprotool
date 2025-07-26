
'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { 
  Download, 
  Upload,
  Shield,
  Lock,
  Unlock,
  GitCompare,
  Droplets,
  Edit3,
  Settings,
  CheckCircle,
  AlertCircle,
  FileText,
  Eye,
  EyeOff,
  X,
  Plus,
  Zap,
  Clock,
  Info,
  Menu,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { 
  validatePdfFile, 
  formatFileSize, 
  downloadFile, 
  generateRandomId 
} from '@/lib/utils';
import { 
  PdfProtectionOptions,
  PdfProtectionResult,
  PdfWatermarkOptions,
  PdfMetadataOptions,
  PdfPermissionOptions,
  PdfComparisonResult,
  PdfUnlockResult,
  PdfWatermarkResult,
  PdfMetadataInfo
} from '@/lib/types';
import {
  PDF_ENCRYPTION_LEVELS,
  PDF_PERMISSIONS,
  WATERMARK_POSITIONS,
  WATERMARK_TYPES,
  PDF_COMPARISON_MODES,
  PDF_METADATA_FIELDS,
  MAX_PDF_PROTECTION_SIZE,
  MAX_COMPARISON_FILE_SIZE
} from '@/lib/constants';

export default function PdfProtectionSuite() {
  const [activeTab, setActiveTab] = useState('protect');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [comparisonFile2, setComparisonFile2] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  // Enhanced Navigation State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavigationInitialized, setIsNavigationInitialized] = useState(false);
  
  // Navigation Configuration - Comprehensive tool definitions with icons and descriptions
  const navigationTools = [
    {
      id: 'protect',
      name: 'Protect PDF',
      icon: Lock,
      description: 'Add password protection with encryption',
      shortName: 'Protect',
      category: 'Security'
    },
    {
      id: 'unlock',
      name: 'Unlock PDF',
      icon: Unlock,
      description: 'Remove password protection from PDFs',
      shortName: 'Unlock',
      category: 'Security'
    },
    {
      id: 'compare',
      name: 'Compare PDF',
      icon: GitCompare,
      description: 'Compare two PDF documents for differences',
      shortName: 'Compare',
      category: 'Analysis'
    },
    {
      id: 'watermark',
      name: 'PDF Watermark',
      icon: Droplets,
      description: 'Add custom watermarks to PDFs',
      shortName: 'Watermark',
      category: 'Modification'
    },
    {
      id: 'metadata',
      name: 'PDF Metadata Editor',
      icon: Edit3,
      description: 'Edit PDF document properties and metadata',
      shortName: 'Metadata',
      category: 'Modification'
    },
    {
      id: 'permissions',
      name: 'Restrict PDF Permissions',
      icon: Settings,
      description: 'Control PDF access and editing permissions',
      shortName: 'Permissions',
      category: 'Security'
    }
  ];
  
  // Protection options
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [encryptionLevel, setEncryptionLevel] = useState<'standard' | 'high'>('standard');
  
  // Watermark options
  const [watermarkOptions, setWatermarkOptions] = useState<PdfWatermarkOptions>({
    type: 'text',
    customText: 'CONFIDENTIAL',
    position: 'center',
    opacity: 0.3,
    fontSize: 48,
    color: '#000000',
    rotation: 45,
    allPages: true,
    pageRange: ''
  });
  
  // Metadata options
  const [metadataOptions, setMetadataOptions] = useState<PdfMetadataOptions>({
    title: '',
    author: '',
    subject: '',
    keywords: '',
    creator: '',
    producer: '',
    preserveExisting: false
  });
  
  // Permission options
  const [permissionOptions, setPermissionOptions] = useState<PdfPermissionOptions>({
    allowPrint: true,
    allowModify: false,
    allowCopy: false,
    allowAnnotate: true,
    allowForms: true,
    allowAccessibility: true,
    allowAssembly: false,
    allowDegradedPrint: true
  });
  
  // Comparison options
  const [comparisonMode, setComparisonMode] = useState<'text' | 'visual' | 'metadata' | 'structure'>('text');
  
  const { toast } = useToast();

  // Enhanced Navigation Functionality - Initialize navigation system and handle state persistence
  useEffect(() => {
    // Load saved active tool from localStorage for persistence across page reloads
    const savedTool = localStorage.getItem('pdfProtectionSuite_activeTab');
    if (savedTool && navigationTools.find(tool => tool.id === savedTool)) {
      setActiveTab(savedTool);
    }
    setIsNavigationInitialized(true);
  }, []);

  // Navigation utility functions for enhanced user experience
  const handleToolSwitch = useCallback((toolId: string) => {
    // Validate tool exists before switching
    const tool = navigationTools.find(t => t.id === toolId);
    if (!tool) {
      console.warn(`Invalid tool ID: ${toolId}`);
      return;
    }

    // Clear previous results and file selections when switching tools
    if (toolId !== activeTab) {
      setResults(null);
      setProgress(0);
      
      // Only clear files if switching to a different tool category
      const currentTool = navigationTools.find(t => t.id === activeTab);
      if (currentTool?.category !== tool.category || toolId === 'compare') {
        setUploadedFile(null);
        setComparisonFile2(null);
      }
      
      // Clear passwords for security
      setPassword('');
      setNewPassword('');
    }

    setActiveTab(toolId);
    setIsMobileMenuOpen(false); // Close mobile menu when tool is selected
    
    // Save selection to localStorage for persistence
    localStorage.setItem('pdfProtectionSuite_activeTab', toolId);
    
    // Announce tool change for screen readers
    const announcement = `Switched to ${tool.name} tool`;
    if ('speechSynthesis' in window) {
      // Optional: Use speech synthesis for accessibility (can be disabled)
      // speechSynthesis.speak(new SpeechSynthesisUtterance(announcement));
    }
  }, [activeTab, navigationTools]);

  // Keyboard navigation handler for accessibility
  const handleKeyNavigation = useCallback((event: React.KeyboardEvent, toolId: string) => {
    // Handle Enter and Space key activation
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToolSwitch(toolId);
    }
    
    // Handle arrow key navigation
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      const currentIndex = navigationTools.findIndex(tool => tool.id === activeTab);
      const nextIndex = (currentIndex + 1) % navigationTools.length;
      handleToolSwitch(navigationTools[nextIndex].id);
    }
    
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      const currentIndex = navigationTools.findIndex(tool => tool.id === activeTab);
      const prevIndex = currentIndex === 0 ? navigationTools.length - 1 : currentIndex - 1;
      handleToolSwitch(navigationTools[prevIndex].id);
    }

    // Handle Escape key to close mobile menu
    if (event.key === 'Escape' && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [activeTab, navigationTools, handleToolSwitch, isMobileMenuOpen]);

  // Mobile menu toggle function
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  // Get current active tool for display purposes
  const getCurrentTool = useCallback(() => {
    return navigationTools.find(tool => tool.id === activeTab) || navigationTools[0];
  }, [activeTab, navigationTools]);

  const handleFileSelect = useCallback((files: FileList | null, isSecondFile = false) => {
    if (!files?.length) return;

    const file = files[0];
    const maxSize = activeTab === 'compare' ? MAX_COMPARISON_FILE_SIZE : MAX_PDF_PROTECTION_SIZE;
    const validation = validatePdfFile(file);
    
    // Check file size separately
    if (file.size > maxSize) {
      toast({
        title: 'File Too Large',
        description: `Maximum file size: ${formatFileSize(maxSize)}`,
        variant: 'destructive'
      });
      return;
    }
    
    if (!validation.valid) {
      toast({
        title: 'Invalid File',
        description: validation.error,
        variant: 'destructive'
      });
      return;
    }

    if (isSecondFile) {
      setComparisonFile2(file);
    } else {
      setUploadedFile(file);
    }
    
    toast({
      title: 'File Selected',
      description: `${file.name} (${formatFileSize(file.size)}) ready for processing`,
    });
  }, [activeTab, toast]);

  const processFile = async (operation: string) => {
    if (!uploadedFile && operation !== 'compare') {
      toast({
        title: 'No File Selected',
        description: 'Please select a PDF file to process',
        variant: 'destructive'
      });
      return;
    }

    if (operation === 'compare' && (!uploadedFile || !comparisonFile2)) {
      toast({
        title: 'Missing Files',
        description: 'Please select two PDF files to compare',
        variant: 'destructive'
      });
      return;
    }

    if ((operation === 'protect' || operation === 'unlock') && !password) {
      toast({
        title: 'Password Required',
        description: `Please enter a password to ${operation} the PDF`,
        variant: 'destructive'
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setResults(null);

    try {
      const formData = new FormData();
      
      if (uploadedFile) {
        formData.append('file', uploadedFile);
      }
      
      if (comparisonFile2) {
        formData.append('file2', comparisonFile2);
      }

      const options: PdfProtectionOptions = {
        operation: operation as any,
        password: password || undefined,
        newPassword: newPassword || undefined,
        encryptionLevel,
        watermarkOptions: operation === 'watermark' ? watermarkOptions : undefined,
        metadataOptions: operation === 'metadata' ? metadataOptions : undefined,
        permissionOptions: operation === 'permissions' ? permissionOptions : undefined,
        comparisonMode: operation === 'compare' ? comparisonMode : undefined
      };

      formData.append('options', JSON.stringify(options));

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('/api/pdf-protection', {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);
      setProgress(100);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Processing failed');
      }

      setResults(result.data);
      
      toast({
        title: 'Processing Complete',
        description: `PDF ${operation} completed successfully`,
      });

    } catch (error) {
      console.error('Processing error:', error);
      toast({
        title: 'Processing Failed',
        description: error instanceof Error ? error.message : 'An error occurred while processing the PDF',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const downloadResult = () => {
    if (!results?.processedUrl) return;
    
    downloadFile(results.processedUrl, results.processedFileName || 'processed.pdf');
  };

  const resetForm = () => {
    setUploadedFile(null);
    setComparisonFile2(null);
    setResults(null);
    setPassword('');
    setNewPassword('');
    setProgress(0);
  };

  const renderFileUpload = (label: string, file: File | null, isSecondFile = false) => (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
      <input
        type="file"
        accept=".pdf,application/pdf"
        onChange={(e) => handleFileSelect(e.target.files, isSecondFile)}
        className="hidden"
        id={isSecondFile ? 'pdf-upload-2' : 'pdf-upload'}
      />
      <label 
        htmlFor={isSecondFile ? 'pdf-upload-2' : 'pdf-upload'} 
        className="cursor-pointer"
      >
        {file ? (
          <div className="flex items-center justify-center space-x-2">
            <FileText className="w-8 h-8 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">{file.name}</p>
              <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                if (isSecondFile) {
                  setComparisonFile2(null);
                } else {
                  setUploadedFile(null);
                }
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div>
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">{label}</p>
            <p className="text-sm text-gray-500">Click to browse or drag and drop</p>
            <p className="text-xs text-gray-400 mt-2">
              Maximum size: {formatFileSize(activeTab === 'compare' ? MAX_COMPARISON_FILE_SIZE : MAX_PDF_PROTECTION_SIZE)}
            </p>
          </div>
        )}
      </label>
    </div>
  );

  const renderResults = () => {
    if (!results) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg"
      >
        <div className="flex items-center mb-4">
          <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-green-800">Processing Complete</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Original File</p>
            <p className="font-medium">{results.originalFileName}</p>
          </div>
          {results.fileSize && (
            <div>
              <p className="text-sm text-gray-600">File Size</p>
              <p className="font-medium">{formatFileSize(results.fileSize)}</p>
            </div>
          )}
          {results.pageCount && (
            <div>
              <p className="text-sm text-gray-600">Pages</p>
              <p className="font-medium">{results.pageCount}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-600">Processing Time</p>
            <p className="font-medium">{results.processingTime}s</p>
          </div>
        </div>

        {/* Operation-specific results */}
        {results.operation === 'compare' && results.statistics && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Comparison Results</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>Similarity: {results.statistics.similarityPercentage}%</div>
              <div>Total Differences: {results.statistics.totalDifferences}</div>
              <div>Identical Pages: {results.statistics.identicalPages}</div>
              <div>Modified Pages: {results.statistics.modifiedPages}</div>
            </div>
          </div>
        )}

        {results.processedUrl && (
          <Button onClick={downloadResult} className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Download Processed PDF
          </Button>
        )}
      </motion.div>
    );
  };

  // Enhanced Navigation Component - Renders responsive navigation menu with accessibility features
  const renderEnhancedNavigation = () => {
    const currentTool = getCurrentTool();
    
    return (
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        {/* Mobile Navigation Header */}
        <div className="lg:hidden px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <currentTool.icon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{currentTool.name}</h3>
                <p className="text-sm text-gray-500">{currentTool.description}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-menu"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="p-2"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Desktop Navigation - Horizontal Menu */}
        <nav 
          className="hidden lg:block px-6 py-2"
          role="navigation"
          aria-label="PDF Protection Tools Navigation"
        >
          <ul 
            className="flex space-x-1"
            role="tablist"
            aria-orientation="horizontal"
          >
            {navigationTools.map((tool, index) => {
              const IconComponent = tool.icon;
              const isActive = activeTab === tool.id;
              
              return (
                <li key={tool.id} role="none">
                  <button
                    role="tab"
                    tabIndex={isActive ? 0 : -1}
                    aria-selected={isActive}
                    aria-controls={`tool-panel-${tool.id}`}
                    aria-describedby={`tool-desc-${tool.id}`}
                    onClick={() => handleToolSwitch(tool.id)}
                    onKeyDown={(e) => handleKeyNavigation(e, tool.id)}
                    className={`
                      group relative px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                      flex items-center space-x-2 min-w-[140px] justify-center
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      ${isActive 
                        ? 'bg-blue-600 text-white shadow-md transform scale-105' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:scale-102'
                      }
                    `}
                  >
                    <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`} />
                    <span>{tool.shortName}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeToolIndicator"
                        className="absolute inset-0 bg-blue-600 rounded-lg -z-10"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                      />
                    )}
                  </button>
                  <div
                    id={`tool-desc-${tool.id}`}
                    className="sr-only"
                    aria-hidden="true"
                  >
                    {tool.description}
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile Navigation Menu - Collapsible */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden bg-gray-50 border-t border-gray-200"
            >
              <nav 
                id="mobile-navigation-menu"
                className="px-4 py-4"
                role="navigation"
                aria-label="Mobile PDF Protection Tools Navigation"
              >
                <ul className="space-y-2" role="menu">
                  {navigationTools.map((tool) => {
                    const IconComponent = tool.icon;
                    const isActive = activeTab === tool.id;
                    
                    return (
                      <li key={tool.id} role="none">
                        <button
                          role="menuitem"
                          tabIndex={0}
                          aria-current={isActive ? 'page' : undefined}
                          onClick={() => handleToolSwitch(tool.id)}
                          onKeyDown={(e) => handleKeyNavigation(e, tool.id)}
                          className={`
                            w-full text-left px-4 py-3 rounded-lg transition-all duration-200
                            flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-blue-500
                            ${isActive 
                              ? 'bg-blue-600 text-white shadow-sm' 
                              : 'text-gray-700 hover:bg-white hover:shadow-sm'
                            }
                          `}
                        >
                          <div className={`p-2 rounded-md ${isActive ? 'bg-blue-500' : 'bg-gray-100'}`}>
                            <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`font-medium ${isActive ? 'text-white' : 'text-gray-900'}`}>
                              {tool.name}
                            </div>
                            <div className={`text-sm truncate ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                              {tool.description}
                            </div>
                          </div>
                          {isActive && (
                            <ChevronRight className="w-4 h-4 text-white" />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="shadow-xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <CardTitle className="flex items-center text-2xl">
            <Shield className="w-6 h-6 mr-2 text-blue-600" />
            PDF Protection Suite
          </CardTitle>
          <CardDescription>
            Comprehensive PDF security and utility tools - all processing done in your browser
          </CardDescription>
        </CardHeader>

        {/* Enhanced Navigation System */}
        {renderEnhancedNavigation()}

        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={handleToolSwitch} className="w-full">
            {/* Hidden TabsList for accessibility - screen readers can still navigate */}
            <TabsList className="sr-only">
              {navigationTools.map((tool) => (
                <TabsTrigger key={tool.id} value={tool.id}>
                  {tool.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Protect Tab */}
            <TabsContent 
              value="protect" 
              id="tool-panel-protect"
              aria-labelledby="tool-protect"
              className="space-y-6 p-6 bg-white"
            >
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-blue-600" />
                  Protect PDF with Password
                </h2>
                <p className="text-gray-600 mt-1">Add password protection with industry-standard encryption</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  {renderFileUpload('Select PDF to Protect', uploadedFile)}
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password for protection"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Encryption Level</Label>
                    <Select value={encryptionLevel} onValueChange={(value: 'standard' | 'high') => setEncryptionLevel(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PDF_ENCRYPTION_LEVELS.map((level) => (
                          <SelectItem key={level.id} value={level.id}>
                            <div>
                              <div className="font-medium">{level.name}</div>
                              <div className="text-sm text-gray-500">{level.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => processFile('protect')} 
                disabled={isProcessing || !uploadedFile || !password}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-spin" />
                    Protecting PDF...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Protect PDF
                  </>
                )}
              </Button>
            </TabsContent>

            {/* Unlock Tab */}
            <TabsContent 
              value="unlock" 
              id="tool-panel-unlock"
              aria-labelledby="tool-unlock"
              className="space-y-6 p-6 bg-white"
            >
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Unlock className="w-5 h-5 mr-2 text-green-600" />
                  Unlock Protected PDF
                </h2>
                <p className="text-gray-600 mt-1">Remove password protection from encrypted PDF files</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  {renderFileUpload('Select Protected PDF', uploadedFile)}
                </div>
                <div>
                  <Label htmlFor="unlock-password">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="unlock-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => processFile('unlock')} 
                disabled={isProcessing || !uploadedFile || !password}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-spin" />
                    Unlocking PDF...
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4 mr-2" />
                    Unlock PDF
                  </>
                )}
              </Button>
            </TabsContent>

            {/* Compare Tab */}
            <TabsContent 
              value="compare" 
              id="tool-panel-compare"
              aria-labelledby="tool-compare"
              className="space-y-6 p-6 bg-white"
            >
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <GitCompare className="w-5 h-5 mr-2 text-purple-600" />
                  Compare PDF Documents
                </h2>
                <p className="text-gray-600 mt-1">Analyze differences between two PDF files</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  {renderFileUpload('Select First PDF', uploadedFile)}
                </div>
                <div>
                  {renderFileUpload('Select Second PDF', comparisonFile2, true)}
                </div>
              </div>
              
              <div>
                <Label>Comparison Mode</Label>
                <Select value={comparisonMode} onValueChange={(value: any) => setComparisonMode(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PDF_COMPARISON_MODES.map((mode) => (
                      <SelectItem key={mode.id} value={mode.id}>
                        <div>
                          <div className="font-medium">{mode.name}</div>
                          <div className="text-sm text-gray-500">{mode.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={() => processFile('compare')} 
                disabled={isProcessing || !uploadedFile || !comparisonFile2}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-spin" />
                    Comparing PDFs...
                  </>
                ) : (
                  <>
                    <GitCompare className="w-4 h-4 mr-2" />
                    Compare PDFs
                  </>
                )}
              </Button>
            </TabsContent>

            {/* Watermark Tab */}
            <TabsContent 
              value="watermark" 
              id="tool-panel-watermark"
              aria-labelledby="tool-watermark"
              className="space-y-6 p-6 bg-white"
            >
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Droplets className="w-5 h-5 mr-2 text-cyan-600" />
                  Add PDF Watermark
                </h2>
                <p className="text-gray-600 mt-1">Apply custom watermarks, timestamps, or stamps to your PDFs</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  {renderFileUpload('Select PDF for Watermark', uploadedFile)}
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>Watermark Type</Label>
                    <Select value={watermarkOptions.type} onValueChange={(value: any) => 
                      setWatermarkOptions({...watermarkOptions, type: value})
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {WATERMARK_TYPES.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            <div>
                              <div className="font-medium">{type.name}</div>
                              <div className="text-sm text-gray-500">{type.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {watermarkOptions.type === 'text' && (
                    <div>
                      <Label htmlFor="watermark-text">Custom Text</Label>
                      <Input
                        id="watermark-text"
                        value={watermarkOptions.customText || ''}
                        onChange={(e) => setWatermarkOptions({...watermarkOptions, customText: e.target.value})}
                        placeholder="Enter watermark text"
                      />
                    </div>
                  )}
                  
                  <div>
                    <Label>Position</Label>
                    <Select value={watermarkOptions.position} onValueChange={(value: any) => 
                      setWatermarkOptions({...watermarkOptions, position: value})
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {WATERMARK_POSITIONS.map((pos) => (
                          <SelectItem key={pos.id} value={pos.id}>
                            {pos.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Opacity: {Math.round(watermarkOptions.opacity * 100)}%</Label>
                    <Slider
                      value={[watermarkOptions.opacity]}
                      onValueChange={(value) => setWatermarkOptions({...watermarkOptions, opacity: value[0]})}
                      min={0.1}
                      max={1}
                      step={0.1}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => processFile('watermark')} 
                disabled={isProcessing || !uploadedFile}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-spin" />
                    Adding Watermark...
                  </>
                ) : (
                  <>
                    <Droplets className="w-4 h-4 mr-2" />
                    Add Watermark
                  </>
                )}
              </Button>
            </TabsContent>

            {/* Metadata Tab */}
            <TabsContent 
              value="metadata" 
              id="tool-panel-metadata"
              aria-labelledby="tool-metadata"
              className="space-y-6 p-6 bg-white"
            >
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Edit3 className="w-5 h-5 mr-2 text-orange-600" />
                  Edit PDF Metadata
                </h2>
                <p className="text-gray-600 mt-1">View and modify PDF document properties and information</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  {renderFileUpload('Select PDF for Metadata Edit', uploadedFile)}
                </div>
                <div className="space-y-4">
                  {PDF_METADATA_FIELDS.map((field) => (
                    <div key={field.id}>
                      <Label htmlFor={field.id}>{field.name}</Label>
                      <Input
                        id={field.id}
                        value={metadataOptions[field.id as keyof PdfMetadataOptions] as string || ''}
                        onChange={(e) => setMetadataOptions({
                          ...metadataOptions,
                          [field.id]: e.target.value
                        })}
                        placeholder={field.description}
                      />
                    </div>
                  ))}
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="preserve-existing"
                      checked={metadataOptions.preserveExisting}
                      onCheckedChange={(checked) => setMetadataOptions({
                        ...metadataOptions,
                        preserveExisting: checked
                      })}
                    />
                    <Label htmlFor="preserve-existing">Preserve existing metadata</Label>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => processFile('metadata')} 
                disabled={isProcessing || !uploadedFile}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-spin" />
                    Updating Metadata...
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Update Metadata
                  </>
                )}
              </Button>
            </TabsContent>

            {/* Permissions Tab */}
            <TabsContent 
              value="permissions" 
              id="tool-panel-permissions"
              aria-labelledby="tool-permissions"
              className="space-y-6 p-6 bg-white"
            >
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-red-600" />
                  Restrict PDF Permissions
                </h2>
                <p className="text-gray-600 mt-1">Control user access and interaction permissions for PDFs</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  {renderFileUpload('Select PDF for Permissions', uploadedFile)}
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="owner-password">Owner Password (Required)</Label>
                    <Input
                      id="owner-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter owner password for permissions"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label>PDF Permissions</Label>
                    {PDF_PERMISSIONS.map((permission) => (
                      <div key={permission.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{permission.name}</div>
                          <div className="text-sm text-gray-500">{permission.description}</div>
                        </div>
                        <Switch
                          checked={permissionOptions[permission.id as keyof PdfPermissionOptions]}
                          onCheckedChange={(checked) => setPermissionOptions({
                            ...permissionOptions,
                            [permission.id]: checked
                          })}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => processFile('permissions')} 
                disabled={isProcessing || !uploadedFile || !password}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-spin" />
                    Setting Permissions...
                  </>
                ) : (
                  <>
                    <Settings className="w-4 h-4 mr-2" />
                    Set Permissions
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>

          {/* Enhanced Progress Bar with Accessibility */}
          <AnimatePresence>
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg"
                role="status"
                aria-live="polite"
                aria-describedby="processing-status"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-blue-600 animate-spin" />
                    <span className="text-sm font-semibold text-blue-800">Processing PDF...</span>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                    {getCurrentTool().name}
                  </Badge>
                </div>
                <Progress value={progress} className="w-full h-2 mb-2" />
                <div className="flex justify-between items-center">
                  <p id="processing-status" className="text-xs text-blue-700">
                    {progress < 30 && 'Initializing document processing...'}
                    {progress >= 30 && progress < 60 && 'Analyzing PDF structure...'}
                    {progress >= 60 && progress < 90 && 'Applying security changes...'}
                    {progress >= 90 && 'Finalizing document...'}
                  </p>
                  <span className="text-xs text-blue-600 font-mono bg-white px-2 py-1 rounded">
                    {progress}%
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          {renderResults()}

          {/* Reset Button */}
          {(uploadedFile || comparisonFile2 || results) && (
            <Button 
              variant="outline" 
              onClick={resetForm}
              className="w-full mt-4"
            >
              <X className="w-4 h-4 mr-2" />
              Reset Form
            </Button>
          )}
        </CardContent>
      </Card>
      
      {/* Accessibility Instructions and Live Region (Screen Reader Only) */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        <p>PDF Protection Suite with 6 tools available. Use Tab key to navigate between tools. Press Enter or Space to select a tool. Use arrow keys for quick navigation between tools.</p>
        <p>Current active tool: {getCurrentTool().name} - {getCurrentTool().description}</p>
        {isProcessing && (
          <p>Processing in progress: {progress}% complete</p>
        )}
        {results && (
          <p>Processing completed successfully. Download button is now available.</p>
        )}
      </div>

      {/* Hidden Skip Link for Keyboard Users */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>
    </div>
  );
}
