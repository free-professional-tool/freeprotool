
import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExcelToPdfOptions } from '@/lib/types';

export const dynamic = 'force-dynamic';

interface ConversionResult {
  success: boolean;
  error?: string;
  filename?: string;
  fileSize?: number;
  pageCount?: number;
  processingTime?: number;
  pdfData?: string;
}

function getPageDimensions(pageSize: string, orientation: string) {
  const sizes = {
    'A4': { width: 210, height: 297 },
    'A3': { width: 297, height: 420 },
    'Letter': { width: 216, height: 279 }
  };
  
  const dims = sizes[pageSize as keyof typeof sizes] || sizes.A4;
  
  if (orientation === 'landscape') {
    return { width: dims.height, height: dims.width };
  }
  return dims;
}

function getMarginValue(margins: string): number {
  switch (margins) {
    case 'narrow': return 12.7; // 0.5 inch in mm
    case 'wide': return 38.1;   // 1.5 inch in mm
    default: return 25.4;       // 1 inch in mm
  }
}

async function convertExcelToPdf(
  fileBuffer: Buffer,
  options: ExcelToPdfOptions
): Promise<ConversionResult> {
  const startTime = Date.now();
  
  try {
    // Parse Excel file
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    
    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      return {
        success: false,
        error: 'No sheets found in the Excel file'
      };
    }

    // Get page dimensions and margins
    const pageDims = getPageDimensions(options.pageSize, options.orientation);
    const margin = getMarginValue(options.margins);
    
    // Create PDF document
    const doc = new jsPDF({
      orientation: options.orientation === 'landscape' ? 'l' : 'p',
      unit: 'mm',
      format: [pageDims.width, pageDims.height]
    });

    let pageCount = 0;
    
    // Process each sheet
    workbook.SheetNames.forEach((sheetName, sheetIndex) => {
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert sheet to JSON array
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
        header: 1, 
        defval: '',
        raw: false 
      }) as string[][];

      if (jsonData.length === 0) {
        return; // Skip empty sheets
      }

      // Add new page for each sheet (except the first one)
      if (sheetIndex > 0) {
        doc.addPage();
      }
      
      pageCount++;

      // Add sheet title
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(sheetName, margin, margin + 10);

      // Filter out completely empty rows
      const filteredData = jsonData.filter(row => 
        row.some(cell => cell !== null && cell !== undefined && cell.toString().trim() !== '')
      );

      if (filteredData.length === 0) {
        return; // Skip if no data after filtering
      }

      // Prepare table data
      const headers = filteredData[0] || [];
      const body = filteredData.slice(1);

      // Calculate available width for table
      const availableWidth = pageDims.width - (2 * margin);
      const availableHeight = pageDims.height - (2 * margin) - 20; // 20mm for title

      // Prepare autoTable options
      const tableOptions: any = {
        head: headers.length > 0 ? [headers] : undefined,
        body: body,
        startY: margin + 20,
        margin: { 
          top: margin + 20, 
          right: margin, 
          bottom: margin, 
          left: margin 
        },
        styles: {
          fontSize: 8,
          cellPadding: 2,
          overflow: 'linebreak',
          valign: 'top'
        },
        headStyles: {
          fillColor: [245, 245, 245],
          textColor: [0, 0, 0],
          fontStyle: 'bold',
          fontSize: 9
        },
        alternateRowStyles: {
          fillColor: [250, 250, 250]
        },
        tableWidth: options.fitToPage ? 'auto' : 'wrap',
        columnStyles: {}
      };

      // If fit to page is enabled, distribute columns evenly
      if (options.fitToPage && headers.length > 0) {
        const columnWidth = availableWidth / headers.length;
        for (let i = 0; i < headers.length; i++) {
          tableOptions.columnStyles[i] = { cellWidth: columnWidth };
        }
      }

      try {
        // Generate the table
        autoTable(doc, tableOptions);
      } catch (tableError) {
        console.warn(`Warning: Could not generate table for sheet "${sheetName}":`, tableError);
        
        // Fallback: Add simple text content
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Error displaying table data for sheet: ${sheetName}`, margin, margin + 35);
        
        // Try to display raw data as text
        const textContent = filteredData.slice(0, 10).map(row => 
          row.join(' | ')
        ).join('\n');
        
        doc.text(textContent.substring(0, 500), margin, margin + 45);
      }
    });

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    const processingTime = (Date.now() - startTime) / 1000;

    return {
      success: true,
      filename: `converted_${Date.now()}.pdf`,
      fileSize: pdfBuffer.length,
      pageCount: pageCount,
      processingTime,
      pdfData: pdfBuffer.toString('base64')
    };

  } catch (error) {
    console.error('Excel to PDF conversion error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Conversion failed'
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const optionsStr = formData.get('options') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const fileName = file.name.toLowerCase();
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
    
    if (!hasValidExtension) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Please upload an Excel file (.xlsx, .xls, .csv)' },
        { status: 400 }
      );
    }

    // Validate file size (25MB limit)
    const maxSize = 25 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size too large. Maximum size is 25MB.' },
        { status: 400 }
      );
    }

    // Parse options
    let options: ExcelToPdfOptions;
    try {
      options = JSON.parse(optionsStr || '{}');
    } catch (error) {
      options = {
        orientation: 'portrait',
        pageSize: 'A4',
        margins: 'normal',
        fitToPage: false
      };
    }

    // Convert file to buffer for processing
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Convert Excel to PDF using self-contained jsPDF
    const result = await convertExcelToPdf(fileBuffer, options);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        filename: result.filename,
        fileSize: result.fileSize,
        pageCount: result.pageCount,
        processingTime: result.processingTime,
        pdfData: result.pdfData
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
