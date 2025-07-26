
export interface BackgroundRemovalOptions {
  quality: 'standard' | 'high';
  format: 'png' | 'jpg';
}

export interface ProcessedImage {
  originalUrl: string;
  processedUrl: string;
  filename: string;
  quality: 'standard' | 'high';
  fileSize: number;
}

export interface ExcelToPdfOptions {
  orientation: 'portrait' | 'landscape';
  pageSize: 'A4' | 'A3' | 'Letter';
  margins: 'normal' | 'narrow' | 'wide';
  fitToPage: boolean;
}

export interface ProcessedPdf {
  originalUrl: string;
  processedUrl: string;
  originalFileName: string;
  processedFileName: string;
  fileSize: number;
  pageCount: number;
  processingTime: number;
}

export interface PdfFile {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount?: number;
  order: number;
}

export interface PdfMergeOptions {
  outputFilename: string;
  includeBookmarks: boolean;
  maintainQuality: boolean;
}

export interface MergedPdf {
  processedUrl: string;
  processedFileName: string;
  fileSize: number;
  totalPages: number;
  originalFileCount: number;
  processingTime: number;
}

export interface UrlToPdfOptions {
  url: string;
  pageSize: 'A4' | 'A3' | 'Letter' | 'Legal';
  orientation: 'portrait' | 'landscape';
  margins: 'none' | 'minimum' | 'default';
  waitForNetworkIdle: boolean;
  includeBackground: boolean;
  scale: number;
}

export interface ProcessedUrlPdf {
  processedUrl: string;
  processedFileName: string;
  originalUrl: string;
  fileSize: number;
  pageCount: number;
  processingTime: number;
  title?: string;
}

export interface SteganographyOptions {
  mode: 'encode' | 'decode';
  message?: string;
  outputFormat: 'png' | 'jpg' | 'webp';
}

export interface SteganographyResult {
  success: boolean;
  mode: 'encode' | 'decode';
  originalFileName: string;
  processedUrl?: string;
  processedFileName?: string;
  extractedMessage?: string;
  fileSize?: number;
  processingTime: number;
  error?: string;
}

export interface ImageConverterOptions {
  outputFormat: 'jpeg' | 'png' | 'webp' | 'gif' | 'bmp' | 'ico';
  quality: number; // 0.1 to 1.0
  enableCompression: boolean;
  maintainAspectRatio: boolean;
}

export interface ConvertedImage {
  originalUrl: string;
  convertedUrl: string;
  originalFileName: string;
  convertedFileName: string;
  originalFormat: string;
  outputFormat: string;
  originalSize: number;
  convertedSize: number;
  compressionRatio: number;
  processingTime: number;
  quality: number;
}

export interface ToolCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  tools: Tool[];
  comingSoon?: boolean;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  href: string;
  category: string;
  featured?: boolean;
  comingSoon?: boolean;
}

// Text Utilities Types
export interface TextUtilityOptions {
  format: 'json' | 'yaml' | 'csv' | 'regex';
  operation: 'format' | 'validate' | 'convert' | 'test';
  targetFormat?: 'json' | 'yaml' | 'csv';
  indentation?: number;
  csvDelimiter?: string;
  csvHasHeaders?: boolean;
}

export interface TextValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  lineNumbers?: number[];
  formatted?: string;
  stats?: {
    lines: number;
    characters: number;
    size: number;
  };
}

export interface ValidationError {
  line: number;
  column: number;
  message: string;
  type: 'syntax' | 'format' | 'structure';
}

export interface ConversionResult {
  success: boolean;
  originalFormat: string;
  targetFormat: string;
  originalContent: string;
  convertedContent: string;
  processingTime: number;
  stats: {
    originalSize: number;
    convertedSize: number;
    compressionRatio: number;
  };
  error?: string;
}

export interface RegexTestResult {
  pattern: string;
  testString: string;
  flags: string;
  matches: RegexMatch[];
  isValid: boolean;
  error?: string;
  processingTime: number;
  stats: {
    totalMatches: number;
    uniqueMatches: number;
    executionTime: number;
  };
}

export interface RegexMatch {
  match: string;
  index: number;
  groups: string[];
  namedGroups?: Record<string, string>;
}

export interface JsonFormattingOptions {
  indentation: number;
  sortKeys: boolean;
  removeComments: boolean;
}

export interface YamlFormattingOptions {
  indentation: number;
  flowLevel: number;
  quotingType: 'single' | 'double' | 'preserve';
}

export interface CsvFormattingOptions {
  delimiter: string;
  quote: string;
  hasHeaders: boolean;
  trimWhitespace: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Text Comparison Types
export interface TextComparisonOptions {
  mode: 'word' | 'char' | 'line';
  viewMode: 'side-by-side' | 'unified' | 'inline';
  caseSensitive: boolean;
  ignoreWhitespace: boolean;
  showLineNumbers: boolean;
  contextLines: number;
}

export interface DiffChunk {
  type: 'added' | 'removed' | 'modified' | 'unchanged';
  content: string;
  originalStart?: number;
  originalEnd?: number;
  modifiedStart?: number;
  modifiedEnd?: number;
  lineNumber?: number;
}

export interface TextComparisonResult {
  originalText: string;
  modifiedText: string;
  chunks: DiffChunk[];
  statistics: DiffStatistics;
  processingTime: number;
  options: TextComparisonOptions;
  success: boolean;
  error?: string;
}

export interface DiffStatistics {
  totalLines: number;
  addedLines: number;
  removedLines: number;
  modifiedLines: number;
  unchangedLines: number;
  addedWords: number;
  removedWords: number;
  modifiedWords: number;
  unchangedWords: number;
  addedChars: number;
  removedChars: number;
  modifiedChars: number;
  unchangedChars: number;
  similarityPercentage: number;
}

export interface LCSResult {
  length: number;
  sequence: string[];
  matrix?: number[][];
}

export interface DiffOperation {
  operation: 'insert' | 'delete' | 'equal' | 'replace';
  text: string;
  position: number;
  length: number;
}

// Text Case Converter Types
export interface TextCaseConverterOptions {
  caseType: string;
  preserveFormatting: boolean;
  customDelimiter?: string;
  lineBreakInterval?: number;
}

export interface TextCaseResult {
  originalText: string;
  convertedText: string;
  caseType: string;
  processingTime: number;
  statistics: TextStatistics;
  success: boolean;
  error?: string;
}

export interface TextStatistics {
  characters: number;
  charactersWithoutSpaces: number;
  words: number;
  lines: number;
  paragraphs: number;
  sentences: number;
  numbers: number;
  specialCharacters: number;
  uppercaseLetters: number;
  lowercaseLetters: number;
}

export interface TransformationResult {
  originalText: string;
  transformedText: string;
  transformationType: string;
  processingTime: number;
  statistics: TextStatistics;
  success: boolean;
  error?: string;
}

// PDF Protection Suite Types
export interface PdfProtectionOptions {
  operation: 'protect' | 'unlock' | 'compare' | 'watermark' | 'metadata' | 'permissions';
  password?: string;
  newPassword?: string;
  encryptionLevel?: 'standard' | 'high';
  watermarkOptions?: PdfWatermarkOptions;
  metadataOptions?: PdfMetadataOptions;
  permissionOptions?: PdfPermissionOptions;
  comparisonMode?: 'text' | 'visual' | 'metadata' | 'structure';
}

export interface PdfWatermarkOptions {
  type: 'text' | 'timestamp' | 'confidential' | 'draft' | 'approved';
  customText?: string;
  position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'diagonal';
  opacity: number; // 0.1 to 1.0
  fontSize: number;
  color: string; // hex color
  rotation: number; // degrees
  allPages: boolean;
  pageRange?: string; // e.g., "1-5,10,15-20"
}

export interface PdfMetadataOptions {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creator?: string;
  producer?: string;
  preserveExisting: boolean;
}

export interface PdfPermissionOptions {
  allowPrint: boolean;
  allowModify: boolean;
  allowCopy: boolean;
  allowAnnotate: boolean;
  allowForms: boolean;
  allowAccessibility: boolean;
  allowAssembly: boolean;
  allowDegradedPrint: boolean;
}

export interface PdfProtectionResult {
  success: boolean;
  operation: string;
  originalFileName: string;
  processedUrl?: string;
  processedFileName?: string;
  fileSize?: number;
  pageCount?: number;
  processingTime: number;
  encryptionLevel?: string;
  hasPassword?: boolean;
  metadata?: PdfMetadataInfo;
  permissions?: PdfPermissionStatus;
  error?: string;
}

export interface PdfMetadataInfo {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creator?: string;
  producer?: string;
  creationDate?: string;
  modificationDate?: string;
  pageCount: number;
  fileSize: number;
  version?: string;
  isEncrypted: boolean;
  hasPermissions: boolean;
}

export interface PdfPermissionStatus {
  allowPrint: boolean;
  allowModify: boolean;
  allowCopy: boolean;
  allowAnnotate: boolean;
  allowForms: boolean;
  allowAccessibility: boolean;
  allowAssembly: boolean;
  allowDegradedPrint: boolean;
}

export interface PdfComparisonResult {
  success: boolean;
  comparisonMode: string;
  file1Name: string;
  file2Name: string;
  differences: PdfDifference[];
  statistics: PdfComparisonStats;
  processingTime: number;
  error?: string;
}

export interface PdfDifference {
  type: 'text' | 'metadata' | 'structure' | 'page';
  page?: number;
  description: string;
  file1Value?: string;
  file2Value?: string;
  severity: 'minor' | 'moderate' | 'major';
  category: string;
}

export interface PdfComparisonStats {
  totalPages1: number;
  totalPages2: number;
  totalDifferences: number;
  textDifferences: number;
  metadataDifferences: number;
  structureDifferences: number;
  similarityPercentage: number;
  identicalPages: number;
  modifiedPages: number;
}

export interface PdfUnlockResult {
  success: boolean;
  originalFileName: string;
  processedUrl?: string;
  processedFileName?: string;
  wasEncrypted: boolean;
  fileSize?: number;
  pageCount?: number;
  processingTime: number;
  error?: string;
}

export interface PdfWatermarkResult {
  success: boolean;
  originalFileName: string;
  processedUrl?: string;
  processedFileName?: string;
  watermarkType: string;
  pagesProcessed: number;
  fileSize?: number;
  processingTime: number;
  error?: string;
}

// Advanced PDF Editor Types
export interface PdfEditorState {
  document: any; // PDFDocumentProxy
  pdfDoc: any; // pdf-lib PDFDocument
  currentPage: number;
  totalPages: number;
  zoomLevel: number;
  activeTool: string;
  selectedAnnotation?: PdfAnnotation;
  annotations: PdfAnnotation[];
  layers: PdfEditorLayer[];
  history: PdfEditorHistoryEntry[];
  historyIndex: number;
  canUndo: boolean;
  canRedo: boolean;
}

export interface PdfAnnotation {
  id: string;
  type: 'text' | 'highlight' | 'underline' | 'strikeout' | 'rectangle' | 'circle' | 'line' | 'arrow' | 'freehand' | 'stamp' | 'image';
  pageNumber: number;
  layerId: string;
  position: { x: number; y: number };
  size?: { width: number; height: number };
  properties: PdfAnnotationProperties;
  content?: string;
  points?: Array<{ x: number; y: number }>; // For freehand and multi-point shapes
  created: string;
  modified: string;
  author?: string;
}

export interface PdfAnnotationProperties {
  color: string;
  fontSize?: number;
  fontFamily?: string;
  lineWidth?: number;
  opacity?: number;
  fillColor?: string;
  strokeColor?: string;
  rotation?: number;
  stampType?: string;
  imageData?: string; // base64 for images
}

export interface PdfEditorLayer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  annotations: string[]; // Array of annotation IDs
}

export interface PdfEditorHistoryEntry {
  id: string;
  type: 'add' | 'modify' | 'delete' | 'move' | 'batch';
  timestamp: string;
  description: string;
  data: any; // Serialized state changes
}

export interface PdfEditorToolOptions {
  color: string;
  fontSize: number;
  lineWidth: number;
  opacity: number;
  fillColor?: string;
  strokeColor?: string;
  stampType?: string;
}

export interface PdfPageInfo {
  pageNumber: number;
  width: number;
  height: number;
  rotation: number;
  thumbnail?: string; // base64 thumbnail
  annotations: string[]; // Array of annotation IDs on this page
}

export interface PdfEditorExportOptions {
  includeAnnotations: boolean;
  flattenAnnotations: boolean;
  exportLayers: string[];
  quality: 'high' | 'medium' | 'low';
  format: 'pdf' | 'annotations-only';
}

export interface PdfEditorResult {
  success: boolean;
  outputPdf?: string; // base64
  annotationsData?: string; // JSON string of annotations
  processingTime: number;
  totalPages: number;
  totalAnnotations: number;
  outputSize: number;
  error?: string;
}

export interface PdfTextSelection {
  pageNumber: number;
  text: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  items: Array<{
    str: string;
    transform: number[];
    width: number;
    height: number;
    fontName: string;
  }>;
}

export interface PdfCanvasContext {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  scale: number;
  viewport: any; // PDFPageProxy viewport
}

export interface PdfEditorSettings {
  autoSave: boolean;
  autoSaveInterval: number; // milliseconds
  maxHistoryEntries: number;
  defaultTool: string;
  snapToGrid: boolean;
  gridSize: number;
  showRulers: boolean;
  showGrid: boolean;
}

export interface PdfFormField {
  id: string;
  name: string;
  type: 'text' | 'checkbox' | 'radio' | 'select' | 'signature';
  value: string;
  pageNumber: number;
  bounds: { x: number; y: number; width: number; height: number };
  required: boolean;
  readOnly: boolean;
  options?: string[]; // For select fields
}

export interface PdfEditorStats {
  documentSize: number;
  totalAnnotations: number;
  annotationsByType: Record<string, number>;
  totalPages: number;
  editingTime: number; // seconds
  lastModified: string;
}
