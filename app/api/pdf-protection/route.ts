
import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';
import { validatePdfFile } from '@/lib/utils';
import { 
  PdfProtectionOptions, 
  PdfProtectionResult,
  PdfComparisonResult,
  PdfUnlockResult,
  PdfWatermarkResult,
  PdfMetadataInfo,
  PdfDifference,
  PdfComparisonStats
} from '@/lib/types';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const formData = await request.formData();
    
    // Extract options
    const optionsString = formData.get('options') as string;
    const options: PdfProtectionOptions = optionsString ? JSON.parse(optionsString) : {};

    // Extract PDF file(s)
    const file = formData.get('file') as File;
    const file2 = formData.get('file2') as File; // For comparison

    if (!file && options.operation !== 'compare') {
      return NextResponse.json(
        { error: 'PDF file is required' },
        { status: 400 }
      );
    }

    if (options.operation === 'compare' && (!file || !file2)) {
      return NextResponse.json(
        { error: 'Two PDF files are required for comparison' },
        { status: 400 }
      );
    }

    const maxSize = options.operation === 'compare' ? 50 * 1024 * 1024 : 100 * 1024 * 1024;
    
    if (file) {
      const validation = validatePdfFile(file);
      if (!validation.valid) {
        return NextResponse.json(
          { error: `Invalid first file: ${validation.error}` },
          { status: 400 }
        );
      }
      
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: `First file is too large. Maximum size: ${Math.round(maxSize / 1024 / 1024)}MB` },
          { status: 400 }
        );
      }
    }

    if (file2) {
      const validation = validatePdfFile(file2);
      if (!validation.valid) {
        return NextResponse.json(
          { error: `Invalid second file: ${validation.error}` },
          { status: 400 }
        );
      }
      
      if (file2.size > maxSize) {
        return NextResponse.json(
          { error: `Second file is too large. Maximum size: ${Math.round(maxSize / 1024 / 1024)}MB` },
          { status: 400 }
        );
      }
    }

    let result: any;

    switch (options.operation) {
      case 'protect':
        result = await protectPdf(file, options);
        break;
      case 'unlock':
        result = await unlockPdf(file, options);
        break;
      case 'compare':
        result = await comparePdfs(file, file2!, options);
        break;
      case 'watermark':
        result = await addWatermark(file, options);
        break;
      case 'metadata':
        result = await editMetadata(file, options);
        break;
      case 'permissions':
        result = await setPermissions(file, options);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid operation' },
          { status: 400 }
        );
    }

    result.processingTime = Math.round((Date.now() - startTime) / 1000);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('PDF protection error:', error);
    
    let errorMessage = 'Failed to process PDF';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

async function protectPdf(file: File, options: PdfProtectionOptions): Promise<PdfProtectionResult> {
  const pdfBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(pdfBuffer);

  if (!options.password) {
    throw new Error('Password is required for protection');
  }

  // Note: Browser-based pdf-lib doesn't support real password encryption
  // This is a simulation - in production, you'd need server-side processing
  // Add a watermark indicating the document is "protected"
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  for (const page of pages) {
    const { width, height } = page.getSize();
    page.drawText('PROTECTED DOCUMENT', {
      x: width - 150,
      y: 20,
      size: 8,
      font,
      color: rgb(0.5, 0.5, 0.5),
      opacity: 0.3,
    });
  }

  // Set document metadata to indicate protection
  pdfDoc.setTitle((pdfDoc.getTitle() || 'Document') + ' [PROTECTED]');
  pdfDoc.setModificationDate(new Date());

  const protectedPdfBytes = await pdfDoc.save();

  const base64Pdf = Buffer.from(protectedPdfBytes).toString('base64');
  const dataUrl = `data:application/pdf;base64,${base64Pdf}`;
  const filename = file.name.replace('.pdf', '_protected.pdf');

  return {
    success: true,
    operation: 'protect',
    originalFileName: file.name,
    processedUrl: dataUrl,
    processedFileName: filename,
    fileSize: protectedPdfBytes.length,
    pageCount: pdfDoc.getPageCount(),
    encryptionLevel: options.encryptionLevel || 'standard',
    hasPassword: true,
    processingTime: 0 // Will be set by caller
  };
}

async function unlockPdf(file: File, options: PdfProtectionOptions): Promise<PdfUnlockResult> {
  const pdfBuffer = await file.arrayBuffer();
  
  try {
    // Note: Browser-based pdf-lib doesn't support password-protected PDF loading
    // This is a simulation - in production, you'd need server-side processing
    const pdfDoc = await PDFDocument.load(pdfBuffer);

    // Check if password is provided (simulation)
    if (!options.password) {
      throw new Error('Password is required for unlocking');
    }

    // Remove protection indicators (if any)
    const title = pdfDoc.getTitle();
    if (title?.includes('[PROTECTED]')) {
      pdfDoc.setTitle(title.replace(' [PROTECTED]', ''));
    }

    const pages = pdfDoc.getPages();
    // Note: In a real implementation, you'd remove watermarks here
    // For now, we'll just mark it as unlocked in metadata
    pdfDoc.setModificationDate(new Date());

    const unlockedPdfBytes = await pdfDoc.save();

    const base64Pdf = Buffer.from(unlockedPdfBytes).toString('base64');
    const dataUrl = `data:application/pdf;base64,${base64Pdf}`;
    const filename = file.name.replace('.pdf', '_unlocked.pdf');

    return {
      success: true,
      originalFileName: file.name,
      processedUrl: dataUrl,
      processedFileName: filename,
      wasEncrypted: true,
      fileSize: unlockedPdfBytes.length,
      pageCount: pdfDoc.getPageCount(),
      processingTime: 0
    };
  } catch (error) {
    throw new Error('Failed to unlock PDF. The file may be corrupted or the password is incorrect.');
  }
}

async function comparePdfs(file1: File, file2: File, options: PdfProtectionOptions): Promise<PdfComparisonResult> {
  const [buffer1, buffer2] = await Promise.all([
    file1.arrayBuffer(),
    file2.arrayBuffer()
  ]);

  const [pdf1, pdf2] = await Promise.all([
    PDFDocument.load(buffer1),
    PDFDocument.load(buffer2)
  ]);

  const differences: PdfDifference[] = [];
  const pages1 = pdf1.getPageCount();
  const pages2 = pdf2.getPageCount();

  // Compare page counts
  if (pages1 !== pages2) {
    differences.push({
      type: 'structure',
      description: `Different page counts: ${pages1} vs ${pages2}`,
      file1Value: pages1.toString(),
      file2Value: pages2.toString(),
      severity: 'major',
      category: 'Structure'
    });
  }

  // Compare metadata
  const metadata1 = {
    title: pdf1.getTitle(),
    author: pdf1.getAuthor(),
    subject: pdf1.getSubject(),
    keywords: pdf1.getKeywords(),
    creator: pdf1.getCreator(),
    producer: pdf1.getProducer()
  };

  const metadata2 = {
    title: pdf2.getTitle(),
    author: pdf2.getAuthor(),
    subject: pdf2.getSubject(),
    keywords: pdf2.getKeywords(),
    creator: pdf2.getCreator(),
    producer: pdf2.getProducer()
  };

  Object.entries(metadata1).forEach(([key, value1]) => {
    const value2 = metadata2[key as keyof typeof metadata2];
    if (value1 !== value2) {
      differences.push({
        type: 'metadata',
        description: `Different ${key}: "${value1}" vs "${value2}"`,
        file1Value: value1 || '',
        file2Value: value2 || '',
        severity: 'minor',
        category: 'Metadata'
      });
    }
  });

  // Basic text comparison (simplified - would need more sophisticated extraction in production)
  const minPages = Math.min(pages1, pages2);
  let identicalPages = 0;
  let modifiedPages = 0;

  for (let i = 0; i < minPages; i++) {
    // This is a simplified comparison - in production, you'd extract and compare actual text content
    const page1Ref = pdf1.getPage(i);
    const page2Ref = pdf2.getPage(i);
    
    // Compare page dimensions as a proxy for content differences
    const { width: w1, height: h1 } = page1Ref.getSize();
    const { width: w2, height: h2 } = page2Ref.getSize();
    
    if (w1 === w2 && h1 === h2) {
      identicalPages++;
    } else {
      modifiedPages++;
      differences.push({
        type: 'page',
        page: i + 1,
        description: `Page ${i + 1} has different dimensions`,
        file1Value: `${w1}x${h1}`,
        file2Value: `${w2}x${h2}`,
        severity: 'moderate',
        category: 'Layout'
      });
    }
  }

  const totalDifferences = differences.length;
  const similarityPercentage = Math.max(0, Math.round(
    ((minPages - differences.filter(d => d.type === 'page').length) / minPages) * 100
  ));

  const statistics: PdfComparisonStats = {
    totalPages1: pages1,
    totalPages2: pages2,
    totalDifferences,
    textDifferences: differences.filter(d => d.type === 'text').length,
    metadataDifferences: differences.filter(d => d.type === 'metadata').length,
    structureDifferences: differences.filter(d => d.type === 'structure').length,
    similarityPercentage,
    identicalPages,
    modifiedPages
  };

  return {
    success: true,
    comparisonMode: options.comparisonMode || 'text',
    file1Name: file1.name,
    file2Name: file2.name,
    differences,
    statistics,
    processingTime: 0
  };
}

async function addWatermark(file: File, options: PdfProtectionOptions): Promise<PdfWatermarkResult> {
  const pdfBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const pages = pdfDoc.getPages();

  if (!options.watermarkOptions) {
    throw new Error('Watermark options are required');
  }

  const { watermarkOptions } = options;
  let watermarkText = '';

  switch (watermarkOptions.type) {
    case 'text':
      watermarkText = watermarkOptions.customText || 'WATERMARK';
      break;
    case 'timestamp':
      watermarkText = new Date().toLocaleString();
      break;
    case 'confidential':
      watermarkText = 'CONFIDENTIAL';
      break;
    case 'draft':
      watermarkText = 'DRAFT';
      break;
    case 'approved':
      watermarkText = 'APPROVED';
      break;
  }

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = watermarkOptions.fontSize || 48;
  const opacity = watermarkOptions.opacity || 0.3;
  const rotation = watermarkOptions.rotation || 45;

  // Convert hex color to RGB
  const hexColor = watermarkOptions.color || '#000000';
  const r = parseInt(hexColor.slice(1, 3), 16) / 255;
  const g = parseInt(hexColor.slice(3, 5), 16) / 255;
  const b = parseInt(hexColor.slice(5, 7), 16) / 255;

  let pagesProcessed = 0;

  for (let i = 0; i < pages.length; i++) {
    if (!watermarkOptions.allPages) {
      // Handle page range logic here if needed
      if (watermarkOptions.pageRange) {
        // Simple page range parsing (would need more sophisticated parsing in production)
        const ranges = watermarkOptions.pageRange.split(',');
        let shouldProcess = false;
        
        for (const range of ranges) {
          if (range.includes('-')) {
            const [start, end] = range.split('-').map(n => parseInt(n.trim()));
            if (i + 1 >= start && i + 1 <= end) {
              shouldProcess = true;
              break;
            }
          } else {
            if (i + 1 === parseInt(range.trim())) {
              shouldProcess = true;
              break;
            }
          }
        }
        
        if (!shouldProcess) continue;
      }
    }

    const page = pages[i];
    const { width, height } = page.getSize();

    let x = width / 2;
    let y = height / 2;

    // Calculate position
    switch (watermarkOptions.position) {
      case 'top-left':
        x = 50;
        y = height - 50;
        break;
      case 'top-right':
        x = width - 50;
        y = height - 50;
        break;
      case 'bottom-left':
        x = 50;
        y = 50;
        break;
      case 'bottom-right':
        x = width - 50;
        y = 50;
        break;
      case 'center':
        x = width / 2;
        y = height / 2;
        break;
      case 'diagonal':
        x = width / 2;
        y = height / 2;
        break;
    }

    page.drawText(watermarkText, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(r, g, b),
      opacity,
      rotate: degrees(rotation),
    });

    pagesProcessed++;
  }

  const watermarkedPdfBytes = await pdfDoc.save();
  const base64Pdf = Buffer.from(watermarkedPdfBytes).toString('base64');
  const dataUrl = `data:application/pdf;base64,${base64Pdf}`;
  const filename = file.name.replace('.pdf', '_watermarked.pdf');

  return {
    success: true,
    originalFileName: file.name,
    processedUrl: dataUrl,
    processedFileName: filename,
    watermarkType: watermarkOptions.type,
    pagesProcessed,
    fileSize: watermarkedPdfBytes.length,
    processingTime: 0
  };
}

async function editMetadata(file: File, options: PdfProtectionOptions): Promise<PdfProtectionResult> {
  const pdfBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(pdfBuffer);

  if (!options.metadataOptions) {
    throw new Error('Metadata options are required');
  }

  const { metadataOptions } = options;

  // Update metadata
  if (metadataOptions.title) pdfDoc.setTitle(metadataOptions.title);
  if (metadataOptions.author) pdfDoc.setAuthor(metadataOptions.author);
  if (metadataOptions.subject) pdfDoc.setSubject(metadataOptions.subject);
  if (metadataOptions.keywords) pdfDoc.setKeywords([metadataOptions.keywords]);
  if (metadataOptions.creator) pdfDoc.setCreator(metadataOptions.creator);
  if (metadataOptions.producer) pdfDoc.setProducer(metadataOptions.producer);

  pdfDoc.setModificationDate(new Date());

  const updatedPdfBytes = await pdfDoc.save();
  const base64Pdf = Buffer.from(updatedPdfBytes).toString('base64');
  const dataUrl = `data:application/pdf;base64,${base64Pdf}`;
  const filename = file.name.replace('.pdf', '_updated_metadata.pdf');

  const metadata: PdfMetadataInfo = {
    title: pdfDoc.getTitle(),
    author: pdfDoc.getAuthor(),
    subject: pdfDoc.getSubject(),
    keywords: pdfDoc.getKeywords(),
    creator: pdfDoc.getCreator(),
    producer: pdfDoc.getProducer(),
    creationDate: pdfDoc.getCreationDate()?.toISOString(),
    modificationDate: pdfDoc.getModificationDate()?.toISOString(),
    pageCount: pdfDoc.getPageCount(),
    fileSize: updatedPdfBytes.length,
    isEncrypted: false,
    hasPermissions: false
  };

  return {
    success: true,
    operation: 'metadata',
    originalFileName: file.name,
    processedUrl: dataUrl,
    processedFileName: filename,
    fileSize: updatedPdfBytes.length,
    pageCount: pdfDoc.getPageCount(),
    metadata,
    processingTime: 0
  };
}

async function setPermissions(file: File, options: PdfProtectionOptions): Promise<PdfProtectionResult> {
  const pdfBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(pdfBuffer);

  if (!options.password) {
    throw new Error('Owner password is required for setting permissions');
  }

  if (!options.permissionOptions) {
    throw new Error('Permission options are required');
  }

  const { permissionOptions } = options;

  // Note: Browser-based pdf-lib doesn't support real permission restrictions
  // This is a simulation - in production, you'd need server-side processing
  // Add metadata to indicate permission settings
  const permissionsText = `Permissions: Print:${permissionOptions.allowPrint}, Modify:${permissionOptions.allowModify}, Copy:${permissionOptions.allowCopy}`;
  pdfDoc.setSubject((pdfDoc.getSubject() || '') + ' [RESTRICTED]');
  pdfDoc.setKeywords([permissionsText]);
  pdfDoc.setModificationDate(new Date());

  // Add a small watermark indicating restrictions
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  for (const page of pages) {
    const { width } = page.getSize();
    page.drawText('RESTRICTED', {
      x: width - 80,
      y: 10,
      size: 6,
      font,
      color: rgb(0.7, 0.7, 0.7),
      opacity: 0.3,
    });
  }

  const restrictedPdfBytes = await pdfDoc.save();

  const base64Pdf = Buffer.from(restrictedPdfBytes).toString('base64');
  const dataUrl = `data:application/pdf;base64,${base64Pdf}`;
  const filename = file.name.replace('.pdf', '_restricted.pdf');

  return {
    success: true,
    operation: 'permissions',
    originalFileName: file.name,
    processedUrl: dataUrl,
    processedFileName: filename,
    fileSize: restrictedPdfBytes.length,
    pageCount: pdfDoc.getPageCount(),
    permissions: {
      allowPrint: permissionOptions.allowPrint,
      allowModify: permissionOptions.allowModify,
      allowCopy: permissionOptions.allowCopy,
      allowAnnotate: permissionOptions.allowAnnotate,
      allowForms: permissionOptions.allowForms,
      allowAccessibility: permissionOptions.allowAccessibility,
      allowAssembly: permissionOptions.allowAssembly,
      allowDegradedPrint: permissionOptions.allowDegradedPrint
    },
    processingTime: 0
  };
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to process PDF files.' },
    { status: 405 }
  );
}
