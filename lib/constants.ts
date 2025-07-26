
import { ToolCategory } from './types';

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: 'image-editing',
    name: 'Image Editing',
    description: 'Professional image editing tools for all your needs',
    icon: 'Image',
    tools: [
      {
        id: 'background-removal',
        name: 'Background Removal',
        description: 'Remove backgrounds from images with AI precision',
        icon: 'Scissors',
        href: '/tools/background-removal',
        category: 'image-editing',
        featured: true
      },
      {
        id: 'image-format-converter',
        name: 'Image Format Converter',
        description: 'Convert images between all major formats (JPG, PNG, WebP, GIF, etc.)',
        icon: 'RefreshCw',
        href: '/tools/image-converter',
        category: 'image-editing',
        featured: true
      },
      {
        id: 'image-resize',
        name: 'Image Resize',
        description: 'Resize images while maintaining quality',
        icon: 'Maximize2',
        href: '/tools/image-resize',
        category: 'image-editing',
        comingSoon: true
      },
      {
        id: 'image-compress',
        name: 'Image Compress',
        description: 'Reduce file size without losing quality',
        icon: 'Archive',
        href: '/tools/image-compress',
        category: 'image-editing',
        comingSoon: true
      },
      {
        id: 'image-steganography',
        name: 'Image Steganography',
        description: 'Hide and extract secret messages in images',
        icon: 'Shield',
        href: '/tools/image-steganography',
        category: 'image-editing',
        featured: true
      }
    ]
  },
  {
    id: 'text-tools',
    name: 'Text Tools',
    description: 'Comprehensive text data processing and formatting utilities',
    icon: 'FileText',
    tools: [
      {
        id: 'text-utilities',
        name: 'Text Data Utilities',
        description: 'JSON/YAML/CSV formatter, validator, converter & regex tester',
        icon: 'Code2',
        href: '/tools/text-utilities',
        category: 'text-tools',
        featured: true
      },
      {
        id: 'text-comparison',
        name: 'Text Comparison',
        description: 'Compare two texts and highlight differences with advanced diff algorithms',
        icon: 'GitCompare',
        href: '/tools/text-comparison',
        category: 'text-tools',
        featured: true
      },
      {
        id: 'text-counter',
        name: 'Word Counter',
        description: 'Count words, characters, and paragraphs',
        icon: 'Hash',
        href: '/tools/word-counter',
        category: 'text-tools',
        comingSoon: true
      },
      {
        id: 'text-case-converter',
        name: 'Text Case Converter',
        description: 'Convert text between various cases with advanced transformations',
        icon: 'Type',
        href: '/tools/text-case-converter',
        category: 'text-tools',
        featured: true
      }
    ]
  },
  {
    id: 'pdf-tools',
    name: 'PDF Tools',
    description: 'Complete PDF manipulation and processing suite',
    icon: 'FileType',
    tools: [
      {
        id: 'excel-to-pdf',
        name: 'Excel to PDF',
        description: 'Convert Excel files to high-quality PDF format',
        icon: 'FileSpreadsheet',
        href: '/tools/excel-to-pdf',
        category: 'pdf-tools',
        featured: true
      },
      {
        id: 'pdf-merge',
        name: 'PDF Merge',
        description: 'Combine multiple PDFs into one',
        icon: 'Combine',
        href: '/tools/pdf-merge',
        category: 'pdf-tools',
        featured: true
      },
      {
        id: 'url-to-pdf',
        name: 'URL to PDF',
        description: 'Convert any website to high-quality PDF',
        icon: 'Globe',
        href: '/tools/url-to-pdf',
        category: 'pdf-tools',
        featured: true
      },
      {
        id: 'pdf-protection',
        name: 'PDF Protection Suite',
        description: 'Comprehensive PDF security, comparison, and utility tools',
        icon: 'Shield',
        href: '/tools/pdf-protection',
        category: 'pdf-tools',
        featured: true
      },
      {
        id: 'pdf-editor',
        name: 'Advanced PDF Editor',
        description: 'Comprehensive PDF editing with annotations, markup, drawing, and page management',
        icon: 'Edit3',
        href: '/tools/pdf-editor',
        category: 'pdf-tools',
        featured: true
      },
      {
        id: 'pdf-split',
        name: 'PDF Split',
        description: 'Split PDF into separate pages',
        icon: 'Split',
        href: '/tools/pdf-split',
        category: 'pdf-tools',
        comingSoon: true
      }
    ]
  }
];

export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp'
];

// Comprehensive image format support for converter
export const IMAGE_CONVERTER_INPUT_FORMATS = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/bmp',
  'image/tiff',
  'image/svg+xml',
  'image/x-icon',
  'image/vnd.microsoft.icon'
];

export const IMAGE_CONVERTER_OUTPUT_FORMATS = [
  { value: 'jpeg', label: 'JPEG', extension: 'jpg', mimeType: 'image/jpeg' },
  { value: 'png', label: 'PNG', extension: 'png', mimeType: 'image/png' },
  { value: 'webp', label: 'WebP', extension: 'webp', mimeType: 'image/webp' },
  { value: 'gif', label: 'GIF', extension: 'gif', mimeType: 'image/gif' },
  { value: 'bmp', label: 'BMP', extension: 'bmp', mimeType: 'image/bmp' },
  { value: 'ico', label: 'ICO', extension: 'ico', mimeType: 'image/x-icon' }
];

export const MAX_IMAGE_SIZE = 20 * 1024 * 1024; // 20MB for image converter

export const SUPPORTED_EXCEL_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-excel', // .xls
  'text/csv' // .csv
];

export const SUPPORTED_PDF_TYPES = [
  'application/pdf'
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_EXCEL_FILE_SIZE = 25 * 1024 * 1024; // 25MB
export const MAX_PDF_FILE_SIZE = 50 * 1024 * 1024; // 50MB per PDF file
export const MAX_TOTAL_PDF_SIZE = 200 * 1024 * 1024; // 200MB total for all files

// URL to PDF constants
export const URL_TO_PDF_TIMEOUT = 30000; // 30 seconds
export const MAX_PDF_OUTPUT_SIZE = 100 * 1024 * 1024; // 100MB max output PDF

// Text utilities constants
export const MAX_TEXT_FILE_SIZE = 10 * 1024 * 1024; // 10MB max text file
export const MAX_TEXT_LENGTH = 1000000; // 1M characters max for processing
export const SUPPORTED_TEXT_FORMATS = [
  'application/json',
  'text/plain',
  'text/csv',
  'application/x-yaml',
  'text/yaml'
];

export const TEXT_UTILITY_FORMATS = [
  { id: 'json', name: 'JSON', extension: '.json', mimeType: 'application/json' },
  { id: 'yaml', name: 'YAML', extension: '.yaml', mimeType: 'text/yaml' },
  { id: 'csv', name: 'CSV', extension: '.csv', mimeType: 'text/csv' },
  { id: 'txt', name: 'Text', extension: '.txt', mimeType: 'text/plain' }
];

// Text comparison constants
export const TEXT_COMPARISON_MODES = [
  { id: 'word', name: 'Word-based', description: 'Compare text word by word' },
  { id: 'char', name: 'Character-based', description: 'Compare text character by character' },
  { id: 'line', name: 'Line-based', description: 'Compare text line by line' }
];

export const TEXT_COMPARISON_VIEW_MODES = [
  { id: 'side-by-side', name: 'Side by Side', description: 'Show original and modified text side by side' },
  { id: 'unified', name: 'Unified View', description: 'Show combined diff in a single view' },
  { id: 'inline', name: 'Inline View', description: 'Show changes inline with context' }
];

export const DIFF_COLORS = {
  added: '#22c55e', // green-500
  removed: '#ef4444', // red-500
  modified: '#f59e0b', // amber-500
  unchanged: '#6b7280', // gray-500
  context: '#374151' // gray-700
};

export const MAX_TEXT_COMPARISON_LENGTH = 500000; // 500K characters per text block
export const DEBOUNCE_DELAY = 300; // milliseconds for real-time comparison

// Text case converter constants
export const MAX_CASE_CONVERTER_LENGTH = 1000000; // 1M characters for case conversion
export const CASE_CONVERTER_DEBOUNCE = 150; // milliseconds for real-time case conversion

export const TEXT_CASE_TYPES = [
  { id: 'uppercase', name: 'UPPERCASE', description: 'Convert all text to uppercase letters' },
  { id: 'lowercase', name: 'lowercase', description: 'Convert all text to lowercase letters' },
  { id: 'titlecase', name: 'Title Case', description: 'Capitalize the first letter of every word' },
  { id: 'sentencecase', name: 'Sentence case', description: 'Capitalize the first letter of each sentence' },
  { id: 'capitalizewords', name: 'Capitalize Each Word', description: 'Smart word capitalization with proper handling' },
  { id: 'inversecase', name: 'InVeRsE CaSe', description: 'Swap uppercase and lowercase for each character' },
  { id: 'alternatingcase', name: 'aLtErNaTiNg CaSe', description: 'Alternating pattern of upper and lower case' },
  { id: 'camelcase', name: 'camelCase', description: 'Convert to camelCase format (first word lowercase)' },
  { id: 'pascalcase', name: 'PascalCase', description: 'Convert to PascalCase format (all words capitalized)' },
  { id: 'snakecase', name: 'snake_case', description: 'Convert to snake_case format with underscores' },
  { id: 'kebabcase', name: 'kebab-case', description: 'Convert to kebab-case format with hyphens' },
  { id: 'dotcase', name: 'dot.case', description: 'Convert to dot.case format with dots' }
];

export const TEXT_TRANSFORMATIONS = [
  { id: 'removeextraspaces', name: 'Remove Extra Spaces', description: 'Trim and reduce multiple spaces to single spaces' },
  { id: 'removeallspaces', name: 'Remove All Spaces', description: 'Strip all whitespace characters' },
  { id: 'addlinebreaks', name: 'Add Line Breaks', description: 'Insert line breaks at specified intervals' },
  { id: 'removelinebreaks', name: 'Remove Line Breaks', description: 'Remove all line breaks and join text' },
  { id: 'slugify', name: 'Slugify', description: 'Convert to URL-friendly format (lowercase with hyphens)' },
  { id: 'reversetext', name: 'Reverse Text', description: 'Reverse the entire text string' },
  { id: 'removenumbers', name: 'Remove Numbers', description: 'Strip all numeric characters from text' },
  { id: 'removespecialchars', name: 'Remove Special Characters', description: 'Keep only letters, numbers, and spaces' },
  { id: 'extractnumbers', name: 'Extract Numbers', description: 'Extract only numeric characters' },
  { id: 'extractletters', name: 'Extract Letters', description: 'Extract only alphabetic characters' }
];

// PDF Protection Suite constants
export const MAX_PDF_PROTECTION_SIZE = 100 * 1024 * 1024; // 100MB per PDF for protection operations
export const MAX_COMPARISON_FILE_SIZE = 50 * 1024 * 1024; // 50MB per PDF for comparison

export const PDF_ENCRYPTION_LEVELS = [
  { id: 'standard', name: 'Standard (128-bit)', description: 'Good security for most use cases' },
  { id: 'high', name: 'High (256-bit)', description: 'Maximum security with AES-256 encryption' }
];

export const PDF_PERMISSIONS = [
  { id: 'print', name: 'Printing', description: 'Allow or deny printing the document' },
  { id: 'modify', name: 'Content Modification', description: 'Allow or deny modifying document content' },
  { id: 'copy', name: 'Content Copying', description: 'Allow or deny copying text and images' },
  { id: 'annotate', name: 'Annotations', description: 'Allow or deny adding comments and annotations' },
  { id: 'forms', name: 'Form Filling', description: 'Allow or deny filling form fields' },
  { id: 'accessibility', name: 'Accessibility', description: 'Allow screen readers and accessibility tools' },
  { id: 'assembly', name: 'Document Assembly', description: 'Allow or deny page operations (rotate, delete, etc.)' },
  { id: 'degraded-print', name: 'High Quality Print', description: 'Allow or deny high-resolution printing' }
];

export const WATERMARK_POSITIONS = [
  { id: 'center', name: 'Center', description: 'Place watermark in the center of each page' },
  { id: 'top-left', name: 'Top Left', description: 'Place watermark in the top-left corner' },
  { id: 'top-right', name: 'Top Right', description: 'Place watermark in the top-right corner' },
  { id: 'bottom-left', name: 'Bottom Left', description: 'Place watermark in the bottom-left corner' },
  { id: 'bottom-right', name: 'Bottom Right', description: 'Place watermark in the bottom-right corner' },
  { id: 'diagonal', name: 'Diagonal', description: 'Place watermark diagonally across the page' }
];

export const WATERMARK_TYPES = [
  { id: 'text', name: 'Text', description: 'Add custom text as watermark' },
  { id: 'timestamp', name: 'Timestamp', description: 'Add current date/time as watermark' },
  { id: 'confidential', name: 'Confidential', description: 'Add "CONFIDENTIAL" stamp' },
  { id: 'draft', name: 'Draft', description: 'Add "DRAFT" stamp' },
  { id: 'approved', name: 'Approved', description: 'Add "APPROVED" stamp' }
];

export const PDF_COMPARISON_MODES = [
  { id: 'text', name: 'Text Comparison', description: 'Compare textual content only' },
  { id: 'visual', name: 'Visual Comparison', description: 'Compare page layout and visual elements' },
  { id: 'metadata', name: 'Metadata Comparison', description: 'Compare document properties and metadata' },
  { id: 'structure', name: 'Structure Comparison', description: 'Compare document structure and organization' }
];

export const PDF_METADATA_FIELDS = [
  { id: 'title', name: 'Title', description: 'Document title' },
  { id: 'author', name: 'Author', description: 'Document author/creator' },
  { id: 'subject', name: 'Subject', description: 'Document subject/topic' },
  { id: 'keywords', name: 'Keywords', description: 'Search keywords and tags' },
  { id: 'creator', name: 'Creator Application', description: 'Application that created the document' },
  { id: 'producer', name: 'Producer', description: 'Application that produced the PDF' }
];

// Advanced PDF Editor constants
export const MAX_PDF_EDITOR_SIZE = 100 * 1024 * 1024; // 100MB per PDF for editing operations
export const PDF_EDITOR_CANVAS_SCALE = 1.5; // Default scale for PDF rendering
export const PDF_EDITOR_MAX_ZOOM = 5.0; // Maximum zoom level
export const PDF_EDITOR_MIN_ZOOM = 0.25; // Minimum zoom level

export const PDF_ANNOTATION_TOOLS = [
  { id: 'text', name: 'Text', description: 'Add text annotations', icon: 'Type' },
  { id: 'highlight', name: 'Highlight', description: 'Highlight text with colors', icon: 'Highlighter' },
  { id: 'underline', name: 'Underline', description: 'Underline text', icon: 'Underline' },
  { id: 'strikeout', name: 'Strikeout', description: 'Strike through text', icon: 'Strikethrough' },
  { id: 'rectangle', name: 'Rectangle', description: 'Draw rectangles', icon: 'Square' },
  { id: 'circle', name: 'Circle', description: 'Draw circles', icon: 'Circle' },
  { id: 'line', name: 'Line', description: 'Draw lines', icon: 'Minus' },
  { id: 'arrow', name: 'Arrow', description: 'Draw arrows', icon: 'ArrowRight' },
  { id: 'freehand', name: 'Draw', description: 'Freehand drawing', icon: 'Pen' },
  { id: 'stamp', name: 'Stamp', description: 'Add stamps', icon: 'Stamp' },
  { id: 'image', name: 'Image', description: 'Insert images', icon: 'Image' }
];

export const PDF_ANNOTATION_COLORS = [
  { id: 'red', name: 'Red', hex: '#ef4444' },
  { id: 'orange', name: 'Orange', hex: '#f97316' },
  { id: 'yellow', name: 'Yellow', hex: '#eab308' },
  { id: 'green', name: 'Green', hex: '#22c55e' },
  { id: 'blue', name: 'Blue', hex: '#3b82f6' },
  { id: 'purple', name: 'Purple', hex: '#a855f7' },
  { id: 'pink', name: 'Pink', hex: '#ec4899' },
  { id: 'black', name: 'Black', hex: '#000000' },
  { id: 'gray', name: 'Gray', hex: '#6b7280' }
];

export const PDF_FONT_SIZES = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48];

export const PDF_LINE_WIDTHS = [1, 2, 3, 4, 5, 6, 8, 10];

export const PDF_STAMP_TYPES = [
  { id: 'approved', name: 'APPROVED', description: 'Green approved stamp' },
  { id: 'rejected', name: 'REJECTED', description: 'Red rejected stamp' },
  { id: 'confidential', name: 'CONFIDENTIAL', description: 'Red confidential stamp' },
  { id: 'draft', name: 'DRAFT', description: 'Blue draft stamp' },
  { id: 'reviewed', name: 'REVIEWED', description: 'Orange reviewed stamp' },
  { id: 'urgent', name: 'URGENT', description: 'Red urgent stamp' },
  { id: 'void', name: 'VOID', description: 'Gray void stamp' },
  { id: 'completed', name: 'COMPLETED', description: 'Green completed stamp' }
];

export const PDF_PAGE_OPERATIONS = [
  { id: 'rotate-left', name: 'Rotate Left', description: 'Rotate 90° counter-clockwise', icon: 'RotateCcw' },
  { id: 'rotate-right', name: 'Rotate Right', description: 'Rotate 90° clockwise', icon: 'RotateCw' },
  { id: 'delete', name: 'Delete', description: 'Delete this page', icon: 'Trash2' },
  { id: 'duplicate', name: 'Duplicate', description: 'Duplicate this page', icon: 'Copy' },
  { id: 'extract', name: 'Extract', description: 'Extract as separate PDF', icon: 'FileText' }
];

export const PDF_EDITOR_LAYERS = [
  { id: 'content', name: 'PDF Content', description: 'Original PDF content', editable: false },
  { id: 'annotations', name: 'Annotations', description: 'Text and markup annotations', editable: true },
  { id: 'drawings', name: 'Drawings', description: 'Shapes and freehand drawings', editable: true },
  { id: 'stamps', name: 'Stamps & Images', description: 'Stamps and inserted images', editable: true }
];
