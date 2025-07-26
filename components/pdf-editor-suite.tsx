
'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  Upload,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Undo,
  Redo,
  Type,
  Highlighter,
  Underline,
  Strikethrough,
  Square,
  Circle,
  Minus,
  ArrowRight,
  Pen,
  Stamp,
  Image as ImageIcon,
  Layers,
  Settings,
  Trash2,
  Copy,
  FileText,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Save,
  Grid3X3,
  MousePointer,
  Hand,
  Move,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic
} from 'lucide-react';
import {
  PDF_ANNOTATION_TOOLS,
  PDF_ANNOTATION_COLORS,
  PDF_FONT_SIZES,
  PDF_LINE_WIDTHS,
  PDF_STAMP_TYPES,
  PDF_PAGE_OPERATIONS,
  PDF_EDITOR_LAYERS,
  MAX_PDF_EDITOR_SIZE,
  PDF_EDITOR_CANVAS_SCALE,
  PDF_EDITOR_MAX_ZOOM,
  PDF_EDITOR_MIN_ZOOM
} from '@/lib/constants';
import {
  PdfEditorState,
  PdfAnnotation,
  PdfEditorToolOptions,
  PdfPageInfo,
  PdfEditorResult,
  PdfCanvasContext
} from '@/lib/types';

export default function PdfEditorSuite() {
  // Core state
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [editorState, setEditorState] = useState<PdfEditorState | null>(null);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [activeTool, setActiveTool] = useState('select');
  const [toolOptions, setToolOptions] = useState<PdfEditorToolOptions>({
    color: '#ef4444',
    fontSize: 14,
    lineWidth: 2,
    opacity: 1,
    fillColor: '#ef4444',
    strokeColor: '#ef4444'
  });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);

  // Layer management
  const [layers, setLayers] = useState([
    { id: 'content', name: 'PDF Content', visible: true, locked: true, opacity: 1, annotations: [] },
    { id: 'annotations', name: 'Annotations', visible: true, locked: false, opacity: 1, annotations: [] },
    { id: 'drawings', name: 'Drawings', visible: true, locked: false, opacity: 1, annotations: [] },
    { id: 'stamps', name: 'Stamps & Images', visible: true, locked: false, opacity: 1, annotations: [] }
  ]);

  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // PDF processing state
  const [annotations, setAnnotations] = useState<PdfAnnotation[]>([]);
  const [pageInfo, setPageInfo] = useState<PdfPageInfo[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // File validation
  const validateFile = (file: File): boolean => {
    if (!file) {
      setError('Please select a file');
      return false;
    }

    if (file.type !== 'application/pdf') {
      setError('Please select a valid PDF file');
      return false;
    }

    if (file.size > MAX_PDF_EDITOR_SIZE) {
      setError(`File size must be less than ${Math.round(MAX_PDF_EDITOR_SIZE / (1024 * 1024))}MB`);
      return false;
    }

    return true;
  };

  // Handle file upload
  const handleFileUpload = useCallback(async (uploadedFile: File) => {
    if (!validateFile(uploadedFile)) return;
    
    console.log('🔵 PDF Loading Started:', {
      fileName: uploadedFile.name,
      fileSize: `${(uploadedFile.size / 1024 / 1024).toFixed(2)}MB`,
      fileType: uploadedFile.type
    });

    setFile(uploadedFile);
    setIsLoading(true);
    setProgress(0);
    setError(null);

    try {
      // Enhanced file validation
      if (!uploadedFile.type.includes('pdf')) {
        throw new Error('VALIDATION_ERROR: Invalid file type. Please upload a PDF file.');
      }
      
      if (uploadedFile.size === 0) {
        throw new Error('VALIDATION_ERROR: File is empty.');
      }
      
      if (uploadedFile.size > 100 * 1024 * 1024) { // 100MB limit
        throw new Error('VALIDATION_ERROR: File too large. Maximum size is 100MB.');
      }
      
      console.log('✅ File validation passed');
      setProgress(10);

      // Load file as ArrayBuffer with detailed logging
      console.log('🔵 Reading file as ArrayBuffer...');
      const arrayBuffer = await uploadedFile.arrayBuffer();
      
      console.log('✅ ArrayBuffer loaded:', {
        byteLength: arrayBuffer.byteLength,
        isValid: arrayBuffer.byteLength > 0
      });
      
      // Validate ArrayBuffer
      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        throw new Error('ARRAYBUFFER_ERROR: File appears to be empty or corrupted');
      }
      
      // Check for PDF magic number (PDF signature)
      const uint8Array = new Uint8Array(arrayBuffer);
      const pdfSignature = String.fromCharCode(...uint8Array.slice(0, 4));
      console.log('🔵 PDF signature check:', pdfSignature);
      
      if (pdfSignature !== '%PDF') {
        throw new Error('SIGNATURE_ERROR: File does not appear to be a valid PDF (missing PDF signature)');
      }
      
      console.log('✅ PDF signature validated');
      setProgress(20);

      // Load PDF.js from CDN to avoid chunk loading issues
      console.log('🔵 Loading PDF.js library from CDN...');
      
      let pdfjsLib: any;
      
      // Try to use existing PDF.js if already loaded
      if (typeof window !== 'undefined' && (window as any).pdfjsLib) {
        pdfjsLib = (window as any).pdfjsLib;
        console.log('✅ Using existing PDF.js instance');
      } else {
        // Load PDF.js from CDN using script injection
        await new Promise<void>((resolve, reject) => {
          if (typeof window === 'undefined') {
            reject(new Error('PDF.js requires browser environment'));
            return;
          }

          // Check if already loaded
          if ((window as any).pdfjsLib) {
            resolve();
            return;
          }

          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
          script.onload = () => {
            console.log('✅ PDF.js loaded from CDN');
            resolve();
          };
          script.onerror = () => {
            // Fallback to different CDN
            const fallbackScript = document.createElement('script');
            fallbackScript.src = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.min.js';
            fallbackScript.onload = () => {
              console.log('✅ PDF.js loaded from fallback CDN');
              resolve();
            };
            fallbackScript.onerror = () => reject(new Error('Failed to load PDF.js from CDN'));
            document.head.removeChild(script);
            document.head.appendChild(fallbackScript);
          };
          document.head.appendChild(script);
        });
        
        pdfjsLib = (window as any).pdfjsLib;
      }
      
      if (!pdfjsLib) {
        throw new Error('LIBRARY_ERROR: PDF.js failed to load');
      }
      
      // Configure worker with matching version
      if (typeof window !== 'undefined') {
        const workerConfigs = [
          // Primary: Matching version CDN
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
          // Fallback 1: Different CDN same version
          'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js',
          // Fallback 2: JSDelivr CDN same version
          'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js'
        ];
        
        let workerConfigured = false;
        
        for (const workerSrc of workerConfigs) {
          try {
            console.log('🔵 Configuring PDF.js worker:', workerSrc);
            pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
            console.log('✅ Worker configured:', workerSrc);
            workerConfigured = true;
            break;
          } catch (configError) {
            console.log('⚠️  Worker config failed, trying next...', configError);
            continue;
          }
        }
        
        if (!workerConfigured) {
          console.error('❌ All worker configurations failed');
          throw new Error('WORKER_ERROR: PDF.js worker could not be configured. Please check your internet connection.');
        }
      }

      setProgress(30);

      // Load PDF document with comprehensive error handling
      console.log('🔵 Creating PDF loading task...');
      const loadingTask = pdfjsLib.getDocument({ 
        data: arrayBuffer,
        verbosity: 1, // Enable some logging for debugging
        cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
        cMapPacked: true,
        enableXfa: false, // Disable XFA for better compatibility
        fontExtraProperties: false // Disable extra font properties for performance
      });
      
      console.log('🔵 Loading PDF document...');
      
      // Add loading progress tracking
      loadingTask.onProgress = (progressData: any) => {
        console.log('📊 PDF loading progress:', progressData);
        if (progressData.total > 0) {
          const loadingProgress = Math.round((progressData.loaded / progressData.total) * 100);
          setProgress(30 + (loadingProgress * 0.2)); // 30-50% range
        }
      };

      const pdf = await Promise.race([
        loadingTask.promise,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('TIMEOUT_ERROR: PDF loading timed out after 30 seconds')), 30000)
        )
      ]) as any;
      
      console.log('✅ PDF document loaded successfully:', {
        numPages: pdf.numPages,
        fingerprint: pdf.fingerprints?.[0] || 'unknown'
      });
      
      if (!pdf || pdf.numPages === 0) {
        throw new Error('DOCUMENT_ERROR: PDF document has no pages or is invalid');
      }

      setProgress(55);

      // Test loading the first page to ensure PDF is readable
      console.log('🔵 Testing first page load...');
      try {
        const testPage = await pdf.getPage(1);
        const testViewport = testPage.getViewport({ scale: 1.0 });
        console.log('✅ First page loaded successfully:', {
          width: testViewport.width,
          height: testViewport.height
        });
      } catch (pageTestError) {
        console.error('❌ First page test failed:', pageTestError);
        throw new Error('PAGE_ERROR: Unable to read PDF pages. The PDF may be corrupted or use unsupported features.');
      }

      setProgress(65);

      // Initialize editor state
      console.log('🔵 Initializing editor state...');
      const newEditorState: PdfEditorState = {
        document: pdf,
        pdfDoc: null, // Will be set when pdf-lib loads
        currentPage: 1,
        totalPages: pdf.numPages,
        zoomLevel: 1,
        activeTool: 'select',
        annotations: [],
        layers: layers,
        history: [],
        historyIndex: -1,
        canUndo: false,
        canRedo: false
      };

      setEditorState(newEditorState);
      setProgress(75);

      // Generate page info with enhanced error handling
      console.log('🔵 Generating page information...');
      const pages: PdfPageInfo[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        try {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 0.2 });
          
          pages.push({
            pageNumber: i,
            width: viewport.width,
            height: viewport.height,
            rotation: 0,
            annotations: []
          });
          
          if (i <= 3) { // Log first few pages for debugging
            console.log(`📄 Page ${i} info:`, {
              width: viewport.width,
              height: viewport.height
            });
          }
        } catch (pageError) {
          console.error(`❌ Error loading page ${i}:`, pageError);
          // Continue with other pages but log error
        }
      }
      
      if (pages.length === 0) {
        throw new Error('PAGES_ERROR: Unable to load any pages from the PDF');
      }
      
      console.log(`✅ Generated info for ${pages.length}/${pdf.numPages} pages`);
      setPageInfo(pages);
      setProgress(85);

      // Render first page with timeout
      console.log('🔵 Rendering first page...');
      await Promise.race([
        renderPage(1, pdf),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('RENDER_TIMEOUT: First page rendering timed out')), 10000)
        )
      ]);
      
      console.log('✅ First page rendered successfully');
      setProgress(100);

      console.log('🎉 PDF loading completed successfully!');
      toast.success(`PDF loaded successfully! ${pdf.numPages} pages ready for editing.`);
      
    } catch (err) {
      console.error('❌ PDF loading failed:', err);
      
      // Enhanced error message based on error type and code
      let errorMessage = 'Failed to load PDF: ';
      let errorCode = 'UNKNOWN_ERROR';
      
      if (err instanceof Error) {
        const message = err.message;
        
        if (message.includes('VALIDATION_ERROR:')) {
          errorCode = 'VALIDATION_ERROR';
          errorMessage = message.replace('VALIDATION_ERROR: ', '');
        } else if (message.includes('ARRAYBUFFER_ERROR:')) {
          errorCode = 'ARRAYBUFFER_ERROR';
          errorMessage = 'File appears to be empty or corrupted. Please try a different PDF.';
        } else if (message.includes('SIGNATURE_ERROR:')) {
          errorCode = 'SIGNATURE_ERROR';
          errorMessage = 'File is not a valid PDF. Please ensure you are uploading a PDF file.';
        } else if (message.includes('WORKER_ERROR:')) {
          errorCode = 'WORKER_ERROR';
          errorMessage = 'PDF processing system unavailable. Please check your internet connection and try again.';
        } else if (message.includes('TIMEOUT_ERROR:')) {
          errorCode = 'TIMEOUT_ERROR';
          errorMessage = 'PDF loading timed out. The file may be too large or complex.';
        } else if (message.includes('DOCUMENT_ERROR:')) {
          errorCode = 'DOCUMENT_ERROR';
          errorMessage = 'PDF document is invalid or has no pages.';
        } else if (message.includes('PAGE_ERROR:')) {
          errorCode = 'PAGE_ERROR';
          errorMessage = 'Unable to read PDF pages. The PDF may be corrupted or password protected.';
        } else if (message.includes('PAGES_ERROR:')) {
          errorCode = 'PAGES_ERROR';
          errorMessage = 'Unable to load any pages from the PDF. The file may be corrupted.';
        } else if (message.includes('RENDER_TIMEOUT:')) {
          errorCode = 'RENDER_TIMEOUT';
          errorMessage = 'PDF rendering timed out. Please try a simpler PDF or refresh the page.';
        } else if (message.toLowerCase().includes('password')) {
          errorCode = 'PASSWORD_ERROR';
          errorMessage = 'This PDF is password protected. Please remove the password first.';
        } else if (message.toLowerCase().includes('network') || message.toLowerCase().includes('fetch')) {
          errorCode = 'NETWORK_ERROR';
          errorMessage = 'Network error while loading PDF processing system. Please check your connection.';
        } else {
          // Log the actual error for debugging while showing user-friendly message
          console.error('Detailed error information:', {
            message: err.message,
            stack: err.stack,
            name: err.name
          });
          errorMessage = `Unexpected error: ${err.message}. Please try again or contact support.`;
        }
      } else {
        console.error('Non-Error object thrown:', err);
        errorMessage = 'An unexpected error occurred. Please try again.';
      }
      
      console.error(`💥 Final error [${errorCode}]:`, errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
      
    } finally {
      setIsLoading(false);
    }
  }, [layers]);

  // Render PDF page with comprehensive debugging
  const renderPage = async (pageNum: number, pdf?: any) => {
    if (!editorState && !pdf) {
      console.log('⚠️  Render page skipped: no editor state or PDF provided');
      return;
    }
    
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log('⚠️  Render page skipped: no canvas ref available');
      return;
    }

    console.log(`🔵 Rendering page ${pageNum}...`);

    try {
      const pdfDoc = pdf || editorState?.document;
      if (!pdfDoc) {
        console.error('❌ No PDF document available for rendering');
        throw new Error('RENDER_NO_DOC: No PDF document available for rendering');
      }

      console.log(`🔵 Getting page ${pageNum} from PDF document...`);
      const page = await Promise.race([
        pdfDoc.getPage(pageNum),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('RENDER_PAGE_TIMEOUT: Page loading timed out')), 5000)
        )
      ]) as any;
      
      if (!page) {
        throw new Error(`RENDER_PAGE_NULL: Unable to load page ${pageNum} - returned null`);
      }

      console.log(`✅ Page ${pageNum} loaded successfully`);

      // Calculate viewport with detailed logging
      console.log(`🔵 Calculating viewport for page ${pageNum}...`, {
        zoomLevel,
        canvasScale: PDF_EDITOR_CANVAS_SCALE,
        finalScale: zoomLevel * PDF_EDITOR_CANVAS_SCALE
      });
      
      const viewport = page.getViewport({ scale: zoomLevel * PDF_EDITOR_CANVAS_SCALE });
      
      console.log(`✅ Viewport calculated:`, {
        width: viewport.width,
        height: viewport.height,
        scale: viewport.scale
      });

      // Set canvas dimensions
      console.log(`🔵 Setting canvas dimensions...`);
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // Get canvas context with validation
      console.log(`🔵 Getting canvas 2D context...`);
      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('RENDER_CONTEXT_NULL: Unable to get canvas 2D rendering context');
      }

      console.log(`✅ Canvas context obtained successfully`);

      // Clear canvas
      console.log(`🔵 Clearing canvas...`);
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Render PDF page with comprehensive error handling
      console.log(`🔵 Starting PDF page render task...`);
      const renderTask = page.render({
        canvasContext: context,
        viewport: viewport,
        // Add additional render options for better compatibility
        intent: 'display',
        renderInteractiveForms: false,
        transform: null,
        background: null
      });

      console.log(`🔵 Waiting for render task to complete...`);
      
      // Race against timeout to catch hanging renders
      await Promise.race([
        renderTask.promise,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('RENDER_TASK_TIMEOUT: PDF page rendering timed out after 10 seconds')), 10000)
        )
      ]);

      console.log(`✅ Page ${pageNum} rendered successfully to canvas`);

      // Render grid if enabled
      if (showGrid) {
        console.log(`🔵 Rendering grid overlay...`);
        try {
          renderGrid(context, canvas.width, canvas.height);
          console.log(`✅ Grid overlay rendered successfully`);
        } catch (gridError) {
          console.error('❌ Grid rendering failed:', gridError);
          // Don't fail the whole render for grid issues
        }
      }

      // Render annotations for current page
      console.log(`🔵 Rendering annotations for page ${pageNum}...`);
      try {
        renderAnnotations(context, pageNum);
        console.log(`✅ Annotations rendered successfully`);
      } catch (annotationError) {
        console.error('❌ Annotation rendering failed:', annotationError);
        // Don't fail the whole render for annotation issues
      }

      console.log(`🎉 Page ${pageNum} render completed successfully!`);

    } catch (err) {
      console.error(`❌ Page ${pageNum} rendering failed:`, err);
      
      // Enhanced error handling with specific error codes
      let errorMessage = `Failed to render page ${pageNum}: `;
      let errorCode = 'RENDER_UNKNOWN';
      
      if (err instanceof Error) {
        const message = err.message;
        
        if (message.includes('RENDER_NO_DOC:')) {
          errorCode = 'RENDER_NO_DOC';
          errorMessage = 'PDF document is not available. Please reload the PDF.';
        } else if (message.includes('RENDER_PAGE_TIMEOUT:')) {
          errorCode = 'RENDER_PAGE_TIMEOUT';
          errorMessage = `Page ${pageNum} loading timed out. The page may be complex or corrupted.`;
        } else if (message.includes('RENDER_PAGE_NULL:')) {
          errorCode = 'RENDER_PAGE_NULL';
          errorMessage = `Page ${pageNum} could not be loaded. It may be corrupted.`;
        } else if (message.includes('RENDER_CONTEXT_NULL:')) {
          errorCode = 'RENDER_CONTEXT_NULL';
          errorMessage = 'Canvas rendering failed. Please refresh the page and try again.';
        } else if (message.includes('RENDER_TASK_TIMEOUT:')) {
          errorCode = 'RENDER_TASK_TIMEOUT';
          errorMessage = `Page ${pageNum} rendering timed out. The page may be too complex.`;
        } else if (message.toLowerCase().includes('out of memory')) {
          errorCode = 'RENDER_MEMORY';
          errorMessage = 'Not enough memory to render this page. Try refreshing the page.';
        } else if (message.toLowerCase().includes('network')) {
          errorCode = 'RENDER_NETWORK';
          errorMessage = 'Network error during page rendering. Check your connection.';
        } else {
          // Log detailed error information for debugging
          console.error('Detailed render error:', {
            message: err.message,
            stack: err.stack,
            name: err.name,
            pageNumber: pageNum,
            zoomLevel,
            canvasWidth: canvas?.width,
            canvasHeight: canvas?.height
          });
          errorMessage = `Rendering error: ${err.message}. Please try refreshing the page.`;
        }
      } else {
        console.error('Non-Error object in render:', err);
        errorMessage = `Unexpected rendering error on page ${pageNum}. Please try again.`;
      }
      
      console.error(`💥 Render error [${errorCode}]:`, errorMessage);
      
      // Show toast error but don't throw - allow the app to continue
      toast.error(errorMessage);
    }
  };

  // Render grid overlay
  const renderGrid = (context: CanvasRenderingContext2D, width: number, height: number) => {
    const gridSize = 20 * zoomLevel;
    context.strokeStyle = '#e5e5e5';
    context.lineWidth = 0.5;
    context.setLineDash([2, 2]);

    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }

    context.setLineDash([]);
  };

  // Render annotations on canvas
  const renderAnnotations = (context: CanvasRenderingContext2D, pageNum: number) => {
    const pageAnnotations = annotations.filter(ann => ann.pageNumber === pageNum);
    
    pageAnnotations.forEach(annotation => {
      const layer = layers.find(l => l.id === annotation.layerId);
      if (!layer?.visible) return;

      context.save();
      context.globalAlpha = (annotation.properties.opacity || 1) * (layer.opacity || 1);

      switch (annotation.type) {
        case 'text':
          renderTextAnnotation(context, annotation);
          break;
        case 'highlight':
          renderHighlightAnnotation(context, annotation);
          break;
        case 'rectangle':
          renderRectangleAnnotation(context, annotation);
          break;
        case 'circle':
          renderCircleAnnotation(context, annotation);
          break;
        case 'line':
          renderLineAnnotation(context, annotation);
          break;
        case 'freehand':
          renderFreehandAnnotation(context, annotation);
          break;
        case 'stamp':
          renderStampAnnotation(context, annotation);
          break;
        default:
          break;
      }

      context.restore();
    });
  };

  // Annotation rendering functions
  const renderTextAnnotation = (context: CanvasRenderingContext2D, annotation: PdfAnnotation) => {
    if (!annotation.content) return;
    
    context.fillStyle = annotation.properties.color;
    context.font = `${annotation.properties.fontSize || 14}px Arial`;
    context.textAlign = 'left';
    context.textBaseline = 'top';
    
    context.fillText(
      annotation.content,
      annotation.position.x * zoomLevel,
      annotation.position.y * zoomLevel
    );
  };

  const renderHighlightAnnotation = (context: CanvasRenderingContext2D, annotation: PdfAnnotation) => {
    if (!annotation.size) return;
    
    context.fillStyle = annotation.properties.color;
    context.globalAlpha = 0.3;
    context.fillRect(
      annotation.position.x * zoomLevel,
      annotation.position.y * zoomLevel,
      annotation.size.width * zoomLevel,
      annotation.size.height * zoomLevel
    );
  };

  const renderRectangleAnnotation = (context: CanvasRenderingContext2D, annotation: PdfAnnotation) => {
    if (!annotation.size) return;
    
    context.strokeStyle = annotation.properties.strokeColor || annotation.properties.color;
    context.lineWidth = annotation.properties.lineWidth || 2;
    
    if (annotation.properties.fillColor) {
      context.fillStyle = annotation.properties.fillColor;
      context.fillRect(
        annotation.position.x * zoomLevel,
        annotation.position.y * zoomLevel,
        annotation.size.width * zoomLevel,
        annotation.size.height * zoomLevel
      );
    }
    
    context.strokeRect(
      annotation.position.x * zoomLevel,
      annotation.position.y * zoomLevel,
      annotation.size.width * zoomLevel,
      annotation.size.height * zoomLevel
    );
  };

  const renderCircleAnnotation = (context: CanvasRenderingContext2D, annotation: PdfAnnotation) => {
    if (!annotation.size) return;
    
    const centerX = (annotation.position.x + annotation.size.width / 2) * zoomLevel;
    const centerY = (annotation.position.y + annotation.size.height / 2) * zoomLevel;
    const radius = Math.min(annotation.size.width, annotation.size.height) / 2 * zoomLevel;
    
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    
    if (annotation.properties.fillColor) {
      context.fillStyle = annotation.properties.fillColor;
      context.fill();
    }
    
    context.strokeStyle = annotation.properties.strokeColor || annotation.properties.color;
    context.lineWidth = annotation.properties.lineWidth || 2;
    context.stroke();
  };

  const renderLineAnnotation = (context: CanvasRenderingContext2D, annotation: PdfAnnotation) => {
    if (!annotation.size) return;
    
    context.strokeStyle = annotation.properties.strokeColor || annotation.properties.color;
    context.lineWidth = annotation.properties.lineWidth || 2;
    context.beginPath();
    context.moveTo(annotation.position.x * zoomLevel, annotation.position.y * zoomLevel);
    context.lineTo(
      (annotation.position.x + annotation.size.width) * zoomLevel,
      (annotation.position.y + annotation.size.height) * zoomLevel
    );
    context.stroke();
  };

  const renderFreehandAnnotation = (context: CanvasRenderingContext2D, annotation: PdfAnnotation) => {
    if (!annotation.points || annotation.points.length < 2) return;
    
    context.strokeStyle = annotation.properties.color;
    context.lineWidth = annotation.properties.lineWidth || 2;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    
    context.beginPath();
    context.moveTo(annotation.points[0].x * zoomLevel, annotation.points[0].y * zoomLevel);
    
    for (let i = 1; i < annotation.points.length; i++) {
      context.lineTo(annotation.points[i].x * zoomLevel, annotation.points[i].y * zoomLevel);
    }
    
    context.stroke();
  };

  const renderStampAnnotation = (context: CanvasRenderingContext2D, annotation: PdfAnnotation) => {
    if (!annotation.properties.stampType || !annotation.size) return;
    
    const stamp = PDF_STAMP_TYPES.find(s => s.id === annotation.properties.stampType);
    if (!stamp) return;
    
    context.fillStyle = annotation.properties.color;
    context.strokeStyle = annotation.properties.color;
    context.lineWidth = 2;
    context.font = `bold ${Math.min(annotation.size.width / 6, 24) * zoomLevel}px Arial`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    // Draw stamp border
    context.strokeRect(
      annotation.position.x * zoomLevel,
      annotation.position.y * zoomLevel,
      annotation.size.width * zoomLevel,
      annotation.size.height * zoomLevel
    );
    
    // Draw stamp text
    context.fillText(
      stamp.name,
      (annotation.position.x + annotation.size.width / 2) * zoomLevel,
      (annotation.position.y + annotation.size.height / 2) * zoomLevel
    );
  };

  // Handle canvas interactions
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!editorState || activeTool === 'select') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / zoomLevel;
    const y = (event.clientY - rect.top) / zoomLevel;
    
    addAnnotation(x, y);
  };

  // Add new annotation
  const addAnnotation = (x: number, y: number) => {
    if (!editorState) return;
    
    const newAnnotation: PdfAnnotation = {
      id: `annotation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: activeTool as any,
      pageNumber: currentPage,
      layerId: getLayerForTool(activeTool),
      position: { x, y },
      properties: { ...toolOptions },
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    };
    
    // Set default size for shape tools
    if (['rectangle', 'circle', 'stamp'].includes(activeTool)) {
      newAnnotation.size = { width: 100, height: 50 };
    }
    
    // Set default content for text tool
    if (activeTool === 'text') {
      newAnnotation.content = 'New Text';
    }
    
    setAnnotations(prev => [...prev, newAnnotation]);
    addToHistory('add', `Added ${activeTool} annotation`);
    
    // Re-render page
    renderPage(currentPage);
    
    toast.success('Annotation added');
  };

  // Get appropriate layer for tool
  const getLayerForTool = (tool: string): string => {
    switch (tool) {
      case 'text':
      case 'highlight':
      case 'underline':
      case 'strikeout':
        return 'annotations';
      case 'rectangle':
      case 'circle':
      case 'line':
      case 'arrow':
      case 'freehand':
        return 'drawings';
      case 'stamp':
      case 'image':
        return 'stamps';
      default:
        return 'annotations';
    }
  };

  // History management
  const addToHistory = (type: string, description: string) => {
    const historyEntry = {
      id: `history_${Date.now()}`,
      type,
      description,
      timestamp: new Date().toISOString(),
      data: { annotations: [...annotations] }
    };
    
    setHistory(prev => [...prev.slice(0, historyIndex + 1), historyEntry]);
    setHistoryIndex(prev => prev + 1);
  };

  // Undo/Redo functions
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      const previousState = history[historyIndex - 1];
      setAnnotations(previousState.data.annotations);
      renderPage(currentPage);
      toast.success('Undid last action');
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      const nextState = history[historyIndex + 1];
      setAnnotations(nextState.data.annotations);
      renderPage(currentPage);
      toast.success('Redid action');
    }
  };

  // Zoom controls
  const zoomIn = () => {
    const newZoom = Math.min(zoomLevel * 1.25, PDF_EDITOR_MAX_ZOOM);
    setZoomLevel(newZoom);
    renderPage(currentPage);
  };

  const zoomOut = () => {
    const newZoom = Math.max(zoomLevel / 1.25, PDF_EDITOR_MIN_ZOOM);
    setZoomLevel(newZoom);
    renderPage(currentPage);
  };

  // Page navigation
  const goToPage = (page: number) => {
    if (page >= 1 && page <= (editorState?.totalPages || 1)) {
      setCurrentPage(page);
      renderPage(page);
    }
  };

  // Export functions
  const exportPdf = async () => {
    if (!editorState || !file) return;
    
    setIsLoading(true);
    setProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('annotations', JSON.stringify(annotations));
      formData.append('exportOptions', JSON.stringify({
        includeAnnotations: true,
        flattenAnnotations: true,
        quality: 'high'
      }));
      
      setProgress(25);
      
      const response = await fetch('/api/pdf-editor', {
        method: 'POST',
        body: formData
      });
      
      setProgress(75);
      
      if (!response.ok) {
        throw new Error('Failed to process PDF');
      }
      
      const result: PdfEditorResult = await response.json();
      
      if (result.success && result.outputPdf) {
        // Download the processed PDF
        const blob = new Blob([new Uint8Array(atob(result.outputPdf).split('').map(c => c.charCodeAt(0)))], {
          type: 'application/pdf'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `edited_${file.name}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        setProgress(100);
        toast.success('PDF exported successfully!');
      } else {
        throw new Error(result.error || 'Failed to export PDF');
      }
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Failed to export PDF');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      handleFileUpload(pdfFile);
    } else {
      toast.error('Please drop a PDF file');
    }
  };

  // Re-render when zoom or page changes
  useEffect(() => {
    if (editorState) {
      renderPage(currentPage);
    }
  }, [zoomLevel, currentPage, showGrid, editorState]);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Advanced PDF Editor
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* File Upload */}
          {!editorState && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-blue-50 rounded-full">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Upload PDF to Edit</h3>
                  <p className="text-gray-600 mb-4">
                    Drag and drop your PDF file here, or click to browse
                  </p>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose PDF File
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    className="hidden"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Maximum file size: 100MB
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Processing PDF</h3>
                  <p className="text-gray-600 mb-4">
                    Loading and preparing your PDF for editing...
                  </p>
                  <Progress value={progress} className="w-64 mx-auto" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-xl p-6 text-center"
            >
              <div className="text-red-600 mb-2">
                <FileText className="w-8 h-8 mx-auto mb-2" />
                <h3 className="text-lg font-semibold">Processing Error</h3>
              </div>
              <p className="text-red-700 mb-4">{error}</p>
              <Button
                onClick={() => {
                  setError(null);
                  setFile(null);
                  setEditorState(null);
                }}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Try Again
              </Button>
            </motion.div>
          )}

          {/* PDF Editor Interface */}
          {editorState && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Main Toolbar */}
              <div className="flex flex-wrap items-center gap-2 p-4 bg-gray-50 rounded-lg border">
                {/* File Operations */}
                <div className="flex items-center gap-1 border-r pr-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={exportPdf}
                    disabled={isLoading}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>

                {/* Undo/Redo */}
                <div className="flex items-center gap-1 border-r pr-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={undo}
                    disabled={historyIndex <= 0}
                  >
                    <Undo className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={redo}
                    disabled={historyIndex >= history.length - 1}
                  >
                    <Redo className="w-4 h-4" />
                  </Button>
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center gap-1 border-r pr-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={zoomOut}
                    disabled={zoomLevel <= PDF_EDITOR_MIN_ZOOM}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium px-2 min-w-[4rem] text-center">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={zoomIn}
                    disabled={zoomLevel >= PDF_EDITOR_MAX_ZOOM}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>

                {/* Tool Selection */}
                <div className="flex items-center gap-1 flex-wrap">
                  <Button
                    size="sm"
                    variant={activeTool === 'select' ? 'default' : 'outline'}
                    onClick={() => setActiveTool('select')}
                  >
                    <MousePointer className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={activeTool === 'text' ? 'default' : 'outline'}
                    onClick={() => setActiveTool('text')}
                  >
                    <Type className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={activeTool === 'highlight' ? 'default' : 'outline'}
                    onClick={() => setActiveTool('highlight')}
                  >
                    <Highlighter className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={activeTool === 'rectangle' ? 'default' : 'outline'}
                    onClick={() => setActiveTool('rectangle')}
                  >
                    <Square className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={activeTool === 'circle' ? 'default' : 'outline'}
                    onClick={() => setActiveTool('circle')}
                  >
                    <Circle className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={activeTool === 'line' ? 'default' : 'outline'}
                    onClick={() => setActiveTool('line')}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={activeTool === 'freehand' ? 'default' : 'outline'}
                    onClick={() => setActiveTool('freehand')}
                  >
                    <Pen className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={activeTool === 'stamp' ? 'default' : 'outline'}
                    onClick={() => setActiveTool('stamp')}
                  >
                    <Stamp className="w-4 h-4" />
                  </Button>
                </div>

                {/* View Options */}
                <div className="flex items-center gap-2 ml-auto">
                  <div className="flex items-center gap-2">
                    <label className="text-sm">Grid</label>
                    <Switch
                      checked={showGrid}
                      onCheckedChange={setShowGrid}
                    />
                  </div>
                </div>
              </div>

              {/* Editor Layout */}
              <div className="grid grid-cols-12 gap-4 min-h-[600px]">
                {/* Left Sidebar - Pages & Layers */}
                <div className="col-span-3 space-y-4">
                  <Tabs defaultValue="pages" className="w-full">
                    <TabsList className="grid grid-cols-2 w-full">
                      <TabsTrigger value="pages">Pages</TabsTrigger>
                      <TabsTrigger value="layers">Layers</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="pages" className="space-y-2">
                      <div className="text-sm font-medium mb-2">
                        Page {currentPage} of {editorState.totalPages}
                      </div>
                      <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                        {Array.from({ length: editorState.totalPages }, (_, i) => i + 1).map(pageNum => (
                          <button
                            key={pageNum}
                            onClick={() => goToPage(pageNum)}
                            className={`aspect-[3/4] border-2 rounded-lg p-2 text-sm font-medium transition-colors ${
                              currentPage === pageNum
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="layers" className="space-y-2">
                      {layers.map(layer => (
                        <div
                          key={layer.id}
                          className="flex items-center gap-2 p-2 border rounded-lg"
                        >
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setLayers(prev => prev.map(l => 
                              l.id === layer.id ? { ...l, visible: !l.visible } : l
                            ))}
                            className="p-1 h-auto"
                          >
                            {layer.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setLayers(prev => prev.map(l => 
                              l.id === layer.id ? { ...l, locked: !l.locked } : l
                            ))}
                            className="p-1 h-auto"
                          >
                            {layer.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                          </Button>
                          <span className="text-sm flex-1">{layer.name}</span>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Main Canvas Area */}
                <div className="col-span-6 border rounded-lg bg-gray-100 p-4">
                  <div 
                    ref={containerRef}
                    className="w-full h-full overflow-auto bg-white rounded shadow-inner"
                  >
                    <canvas
                      ref={canvasRef}
                      onClick={handleCanvasClick}
                      className="block mx-auto cursor-crosshair"
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                  </div>
                </div>

                {/* Right Sidebar - Properties */}
                <div className="col-span-3 space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Tool Properties</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Color Selection */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">Color</label>
                        <div className="grid grid-cols-3 gap-2">
                          {PDF_ANNOTATION_COLORS.map(color => (
                            <button
                              key={color.id}
                              onClick={() => setToolOptions(prev => ({ ...prev, color: color.hex }))}
                              className={`w-8 h-8 rounded border-2 ${
                                toolOptions.color === color.hex ? 'border-gray-900' : 'border-gray-300'
                              }`}
                              style={{ backgroundColor: color.hex }}
                              title={color.name}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Font Size */}
                      {activeTool === 'text' && (
                        <div>
                          <label className="text-sm font-medium mb-2 block">Font Size</label>
                          <Select
                            value={toolOptions.fontSize.toString()}
                            onValueChange={(value) => setToolOptions(prev => ({ ...prev, fontSize: parseInt(value) }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {PDF_FONT_SIZES.map(size => (
                                <SelectItem key={size} value={size.toString()}>
                                  {size}px
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Line Width */}
                      {['rectangle', 'circle', 'line', 'freehand'].includes(activeTool) && (
                        <div>
                          <label className="text-sm font-medium mb-2 block">Line Width</label>
                          <Select
                            value={toolOptions.lineWidth.toString()}
                            onValueChange={(value) => setToolOptions(prev => ({ ...prev, lineWidth: parseInt(value) }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {PDF_LINE_WIDTHS.map(width => (
                                <SelectItem key={width} value={width.toString()}>
                                  {width}px
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Opacity */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Opacity ({Math.round(toolOptions.opacity * 100)}%)
                        </label>
                        <Slider
                          value={[toolOptions.opacity]}
                          onValueChange={([value]) => setToolOptions(prev => ({ ...prev, opacity: value }))}
                          min={0.1}
                          max={1}
                          step={0.1}
                          className="w-full"
                        />
                      </div>

                      {/* Stamp Type */}
                      {activeTool === 'stamp' && (
                        <div>
                          <label className="text-sm font-medium mb-2 block">Stamp Type</label>
                          <Select
                            value={toolOptions.stampType || 'approved'}
                            onValueChange={(value) => setToolOptions(prev => ({ ...prev, stampType: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {PDF_STAMP_TYPES.map(stamp => (
                                <SelectItem key={stamp.id} value={stamp.id}>
                                  {stamp.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Document Info */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Document Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Pages:</span>
                        <span>{editorState.totalPages}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Annotations:</span>
                        <span>{annotations.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Zoom:</span>
                        <span>{Math.round(zoomLevel * 100)}%</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Status Bar */}
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded border text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  <span>Active Tool: {activeTool}</span>
                  <span>Page {currentPage} of {editorState.totalPages}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span>{annotations.length} annotations</span>
                  <span>Zoom: {Math.round(zoomLevel * 100)}%</span>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
