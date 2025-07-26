

import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import { validatePdfFile } from '@/lib/utils';
import { MergedPdf, PdfMergeOptions } from '@/lib/types';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const formData = await request.formData();
    
    // Extract options
    const optionsString = formData.get('options') as string;
    const options: PdfMergeOptions = optionsString ? JSON.parse(optionsString) : {
      outputFilename: 'merged_document.pdf',
      includeBookmarks: true,
      maintainQuality: true
    };

    // Extract PDF files
    const pdfFiles: { file: File; order: number }[] = [];
    let fileIndex = 0;
    
    while (true) {
      const file = formData.get(`file_${fileIndex}`) as File;
      if (!file) break;
      
      const validation = validatePdfFile(file);
      if (!validation.valid) {
        return NextResponse.json(
          { error: `Invalid file at position ${fileIndex + 1}: ${validation.error}` },
          { status: 400 }
        );
      }
      
      pdfFiles.push({ file, order: fileIndex });
      fileIndex++;
    }

    if (pdfFiles.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 PDF files are required for merging' },
        { status: 400 }
      );
    }

    // Create a new PDF document
    const mergedPdf = await PDFDocument.create();
    let totalPages = 0;
    let totalFileSize = 0;

    // Process each PDF file in order
    for (const { file } of pdfFiles) {
      const pdfBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(pdfBuffer);
      
      // Get all pages from the current PDF
      const pageCount = pdf.getPageCount();
      const pageIndices = Array.from({ length: pageCount }, (_, i) => i);
      
      // Copy pages to the merged PDF
      const copiedPages = await mergedPdf.copyPages(pdf, pageIndices);
      copiedPages.forEach((page) => {
        mergedPdf.addPage(page);
      });
      
      totalPages += pageCount;
      totalFileSize += file.size;

      // Copy bookmarks if enabled (simplified implementation)
      if (options.includeBookmarks) {
        try {
          // Note: pdf-lib has limited bookmark support
          // In a production environment, you might want to use a more advanced library
          // For now, we'll just acknowledge the option
        } catch (error) {
          console.warn('Bookmark copying not fully supported in this implementation');
        }
      }
    }

    // Set document metadata
    mergedPdf.setTitle(`Merged Document - ${new Date().toLocaleDateString()}`);
    mergedPdf.setAuthor('ProductivityHub PDF Merger');
    mergedPdf.setCreator('ProductivityHub');
    mergedPdf.setProducer('pdf-lib');
    mergedPdf.setCreationDate(new Date());
    mergedPdf.setModificationDate(new Date());

    // Generate the merged PDF
    const pdfBytes = await mergedPdf.save({
      useObjectStreams: options.maintainQuality,
    });

    const processingTime = Math.round((Date.now() - startTime) / 1000);

    // Convert to base64 for response
    const base64Pdf = Buffer.from(pdfBytes).toString('base64');
    const dataUrl = `data:application/pdf;base64,${base64Pdf}`;

    // Ensure filename has .pdf extension
    const filename = options.outputFilename.endsWith('.pdf') 
      ? options.outputFilename 
      : `${options.outputFilename}.pdf`;

    const result: MergedPdf = {
      processedUrl: dataUrl,
      processedFileName: filename,
      fileSize: pdfBytes.length,
      totalPages,
      originalFileCount: pdfFiles.length,
      processingTime
    };

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('PDF merge error:', error);
    
    let errorMessage = 'Failed to merge PDF files';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to merge PDF files.' },
    { status: 405 }
  );
}
