
import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { MAX_PDF_EDITOR_SIZE } from '@/lib/constants';
import { PdfEditorResult, PdfAnnotation, PdfEditorExportOptions } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const annotationsData = formData.get('annotations') as string;
    const exportOptionsData = formData.get('exportOptions') as string;

    // Validate file
    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No PDF file provided'
      });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({
        success: false,
        error: 'Invalid file type. Please upload a PDF file.'
      });
    }

    if (file.size > MAX_PDF_EDITOR_SIZE) {
      return NextResponse.json({
        success: false,
        error: `File size exceeds ${Math.round(MAX_PDF_EDITOR_SIZE / (1024 * 1024))}MB limit`
      });
    }

    // Parse annotations and export options
    let annotations: PdfAnnotation[] = [];
    let exportOptions: PdfEditorExportOptions = {
      includeAnnotations: true,
      flattenAnnotations: true,
      exportLayers: ['annotations', 'drawings', 'stamps'],
      quality: 'high',
      format: 'pdf'
    };

    try {
      if (annotationsData) {
        annotations = JSON.parse(annotationsData);
      }
      if (exportOptionsData) {
        exportOptions = { ...exportOptions, ...JSON.parse(exportOptionsData) };
      }
    } catch (parseError) {
      console.error('Failed to parse annotations or options:', parseError);
    }

    // Load PDF with pdf-lib
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();

    // Process annotations if included
    if (exportOptions.includeAnnotations && annotations.length > 0) {
      // Group annotations by page
      const annotationsByPage = new Map<number, PdfAnnotation[]>();
      annotations.forEach(annotation => {
        const pageAnnotations = annotationsByPage.get(annotation.pageNumber) || [];
        pageAnnotations.push(annotation);
        annotationsByPage.set(annotation.pageNumber, pageAnnotations);
      });

      // Process each page with annotations
      for (const [pageNumber, pageAnnotations] of annotationsByPage) {
        const page = pages[pageNumber - 1]; // Convert to 0-based index
        if (!page) continue;

        const { width, height } = page.getSize();

        // Process annotations for this page
        for (const annotation of pageAnnotations) {
          try {
            await addAnnotationToPage(page, annotation, width, height);
          } catch (annotationError) {
            console.error(`Failed to add annotation ${annotation.id}:`, annotationError);
            // Continue with other annotations
          }
        }
      }
    }

    // Generate output PDF
    const pdfBytes = await pdfDoc.save();
    const base64Pdf = Buffer.from(pdfBytes).toString('base64');

    const processingTime = Date.now() - startTime;

    // Calculate statistics
    const totalAnnotations = annotations.length;
    const annotationsByType = annotations.reduce((acc, ann) => {
      acc[ann.type] = (acc[ann.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const result: PdfEditorResult = {
      success: true,
      outputPdf: base64Pdf,
      annotationsData: exportOptions.format === 'annotations-only' ? JSON.stringify(annotations) : undefined,
      processingTime,
      totalPages: pages.length,
      totalAnnotations,
      outputSize: pdfBytes.length,
      error: undefined
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('PDF editor processing error:', error);
    
    const processingTime = Date.now() - startTime;
    
    return NextResponse.json({
      success: false,
      processingTime,
      totalPages: 0,
      totalAnnotations: 0,
      outputSize: 0,
      error: error instanceof Error ? error.message : 'Failed to process PDF'
    } as PdfEditorResult);
  }
}

// Helper function to add annotations to PDF pages
async function addAnnotationToPage(
  page: any,
  annotation: PdfAnnotation,
  pageWidth: number,
  pageHeight: number
) {
  const { position, size, properties, content, points, type } = annotation;

  // Convert coordinates (PDF coordinate system has origin at bottom-left)
  const x = position.x;
  const y = pageHeight - position.y - (size?.height || 0);

  switch (type) {
    case 'text':
      if (content) {
        await addTextAnnotation(page, x, y, content, properties);
      }
      break;

    case 'highlight':
      if (size) {
        await addHighlightAnnotation(page, x, y, size.width, size.height, properties);
      }
      break;

    case 'rectangle':
      if (size) {
        await addRectangleAnnotation(page, x, y, size.width, size.height, properties);
      }
      break;

    case 'circle':
      if (size) {
        await addCircleAnnotation(page, x, y, size.width, size.height, properties);
      }
      break;

    case 'line':
      if (size) {
        await addLineAnnotation(page, x, y, x + size.width, y + size.height, properties);
      }
      break;

    case 'freehand':
      if (points && points.length > 1) {
        await addFreehandAnnotation(page, points, pageHeight, properties);
      }
      break;

    case 'stamp':
      if (size && properties.stampType) {
        await addStampAnnotation(page, x, y, size.width, size.height, properties);
      }
      break;

    default:
      console.warn(`Unsupported annotation type: ${type}`);
  }
}

// Annotation rendering functions
async function addTextAnnotation(page: any, x: number, y: number, text: string, properties: any) {
  const fontSize = properties.fontSize || 14;
  const color = hexToRgb(properties.color || '#000000');
  const font = await page.doc.embedFont(StandardFonts.Helvetica);

  page.drawText(text, {
    x,
    y,
    size: fontSize,
    font,
    color: rgb(color.r, color.g, color.b),
    opacity: properties.opacity || 1
  });
}

async function addHighlightAnnotation(page: any, x: number, y: number, width: number, height: number, properties: any) {
  const color = hexToRgb(properties.color || '#ffff00');
  
  page.drawRectangle({
    x,
    y,
    width,
    height,
    color: rgb(color.r, color.g, color.b),
    opacity: 0.3
  });
}

async function addRectangleAnnotation(page: any, x: number, y: number, width: number, height: number, properties: any) {
  const strokeColor = hexToRgb(properties.strokeColor || properties.color || '#000000');
  const fillColor = properties.fillColor ? hexToRgb(properties.fillColor) : null;
  const lineWidth = properties.lineWidth || 2;

  if (fillColor) {
    page.drawRectangle({
      x,
      y,
      width,
      height,
      color: rgb(fillColor.r, fillColor.g, fillColor.b),
      opacity: properties.opacity || 1
    });
  }

  page.drawRectangle({
    x,
    y,
    width,
    height,
    borderColor: rgb(strokeColor.r, strokeColor.g, strokeColor.b),
    borderWidth: lineWidth,
    opacity: properties.opacity || 1
  });
}

async function addCircleAnnotation(page: any, x: number, y: number, width: number, height: number, properties: any) {
  const strokeColor = hexToRgb(properties.strokeColor || properties.color || '#000000');
  const fillColor = properties.fillColor ? hexToRgb(properties.fillColor) : null;
  const lineWidth = properties.lineWidth || 2;

  const centerX = x + width / 2;
  const centerY = y + height / 2;
  const radius = Math.min(width, height) / 2;

  if (fillColor) {
    page.drawCircle({
      x: centerX,
      y: centerY,
      size: radius,
      color: rgb(fillColor.r, fillColor.g, fillColor.b),
      opacity: properties.opacity || 1
    });
  }

  page.drawCircle({
    x: centerX,
    y: centerY,
    size: radius,
    borderColor: rgb(strokeColor.r, strokeColor.g, strokeColor.b),
    borderWidth: lineWidth,
    opacity: properties.opacity || 1
  });
}

async function addLineAnnotation(page: any, x1: number, y1: number, x2: number, y2: number, properties: any) {
  const color = hexToRgb(properties.strokeColor || properties.color || '#000000');
  const lineWidth = properties.lineWidth || 2;

  page.drawLine({
    start: { x: x1, y: y1 },
    end: { x: x2, y: y2 },
    thickness: lineWidth,
    color: rgb(color.r, color.g, color.b),
    opacity: properties.opacity || 1
  });
}

async function addFreehandAnnotation(page: any, points: Array<{ x: number; y: number }>, pageHeight: number, properties: any) {
  if (points.length < 2) return;

  const color = hexToRgb(properties.color || '#000000');
  const lineWidth = properties.lineWidth || 2;

  // Convert points to PDF coordinate system
  const convertedPoints = points.map(point => ({
    x: point.x,
    y: pageHeight - point.y
  }));

  // Draw path as series of lines
  for (let i = 0; i < convertedPoints.length - 1; i++) {
    page.drawLine({
      start: convertedPoints[i],
      end: convertedPoints[i + 1],
      thickness: lineWidth,
      color: rgb(color.r, color.g, color.b),
      opacity: properties.opacity || 1,
      lineCap: 'round'
    });
  }
}

async function addStampAnnotation(page: any, x: number, y: number, width: number, height: number, properties: any) {
  const color = hexToRgb(properties.color || '#ff0000');
  const fontSize = Math.min(width / 6, height / 2, 24);
  const font = await page.doc.embedFont(StandardFonts.HelveticaBold);

  // Get stamp text
  const stampTypes: Record<string, string> = {
    'approved': 'APPROVED',
    'rejected': 'REJECTED',
    'confidential': 'CONFIDENTIAL',
    'draft': 'DRAFT',
    'reviewed': 'REVIEWED',
    'urgent': 'URGENT',
    'void': 'VOID',
    'completed': 'COMPLETED'
  };

  const stampText = stampTypes[properties.stampType || 'approved'] || 'APPROVED';

  // Draw stamp border
  page.drawRectangle({
    x,
    y,
    width,
    height,
    borderColor: rgb(color.r, color.g, color.b),
    borderWidth: 2,
    opacity: properties.opacity || 1
  });

  // Draw stamp text
  const textWidth = font.widthOfTextAtSize(stampText, fontSize);
  const textX = x + (width - textWidth) / 2;
  const textY = y + height / 2 - fontSize / 2;

  page.drawText(stampText, {
    x: textX,
    y: textY,
    size: fontSize,
    font,
    color: rgb(color.r, color.g, color.b),
    opacity: properties.opacity || 1
  });
}

// Helper function to convert hex color to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255,
  } : { r: 0, g: 0, b: 0 };
}
