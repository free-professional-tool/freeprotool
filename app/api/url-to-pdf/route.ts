
import { NextRequest, NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';
import jsPDF from 'jspdf';
import { UrlToPdfOptions, ProcessedUrlPdf } from '@/lib/types';
import { validateUrl, sanitizeFilename } from '@/lib/utils';
import { URL_TO_PDF_TIMEOUT, MAX_PDF_OUTPUT_SIZE } from '@/lib/constants';

export async function POST(req: NextRequest) {
  try {
    const options: UrlToPdfOptions = await req.json();
    const startTime = Date.now();

    // Validate the URL
    const urlValidation = validateUrl(options.url);
    if (!urlValidation.valid) {
      return NextResponse.json(
        { error: urlValidation.error || 'Invalid URL provided' },
        { status: 400 }
      );
    }

    const normalizedUrl = urlValidation.normalizedUrl || options.url;

    // Fetch HTML content from the URL
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), URL_TO_PDF_TIMEOUT);

    let response;
    try {
      response = await fetch(normalizedUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Cache-Control': 'no-cache',
        },
        redirect: 'follow',
      });
      clearTimeout(timeoutId);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      throw new Error(`Failed to fetch URL: ${fetchError.message}`);
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const htmlContent = await response.text();

    // Parse HTML content using jsdom
    const dom = new JSDOM(htmlContent, { url: normalizedUrl });
    const document = dom.window.document;

    // Extract meaningful content
    const title = document.title || 'Untitled Document';
    
    // Remove script and style elements
    const scripts = document.querySelectorAll('script, style, noscript');
    scripts.forEach(script => script.remove());

    // Get main content - try to find article, main, or fallback to body
    let contentElement = document.querySelector('article') || 
                        document.querySelector('main') || 
                        document.querySelector('.post-content') ||
                        document.querySelector('.entry-content') ||
                        document.querySelector('.content') ||
                        document.body;

    if (!contentElement) {
      throw new Error('Could not extract readable content from the webpage');
    }

    // Extract text content and preserve some structure
    const extractContent = (element: Element): { text: string; isHeading: boolean; level: number } => {
      const text = element.textContent?.trim() || '';
      if (!text) return { text: '', isHeading: false, level: 0 };

      const tagName = element.tagName.toLowerCase();
      
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
        return { 
          text, 
          isHeading: true, 
          level: parseInt(tagName.charAt(1))
        };
      }
      
      return { text, isHeading: false, level: 0 };
    };

    // Get all meaningful text elements
    const elements = Array.from(contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, blockquote, div'))
      .map(extractContent)
      .filter(item => item.text.length > 0);

    // Add title if not already included
    if (!elements.some(el => el.text === title)) {
      elements.unshift({ text: title, isHeading: true, level: 1 });
    }

    // Configure PDF options
    const pageSize = options.pageSize.toLowerCase();
    const orientation = options.orientation === 'landscape' ? 'landscape' : 'portrait';
    
    // Calculate margins in points (1 inch = 72 points)
    let margins = { top: 72, right: 72, bottom: 72, left: 72 }; // default
    switch (options.margins) {
      case 'none':
        margins = { top: 0, right: 0, bottom: 0, left: 0 };
        break;
      case 'minimum':
        margins = { top: 18, right: 18, bottom: 18, left: 18 }; // 0.25 inch
        break;
    }

    // Create PDF
    const pdf = new jsPDF({
      orientation: orientation as 'portrait' | 'landscape',
      unit: 'pt',
      format: pageSize === 'a3' ? 'a3' : pageSize === 'letter' ? 'letter' : pageSize === 'legal' ? 'legal' : 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const contentWidth = pageWidth - margins.left - margins.right;
    const lineHeight = 14;
    let currentY = margins.top;

    // Helper function to add text with word wrapping
    const addTextToPdf = (text: string, fontSize: number, isBold: boolean = false) => {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
      
      const lines = pdf.splitTextToSize(text, contentWidth);
      
      for (const line of lines) {
        // Check if we need a new page
        if (currentY + lineHeight > pageHeight - margins.bottom) {
          pdf.addPage();
          currentY = margins.top;
        }
        
        pdf.text(line, margins.left, currentY);
        currentY += lineHeight;
      }
      
      currentY += lineHeight * 0.5; // Add some spacing
    };

    // Add URL as header
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(128, 128, 128);
    pdf.text(`Source: ${normalizedUrl}`, margins.left, 20);
    pdf.setTextColor(0, 0, 0); // Reset to black
    
    currentY += 20; // Add space after URL

    // Add content to PDF
    for (const element of elements) {
      if (element.isHeading) {
        const fontSize = Math.max(16 - element.level * 2, 10);
        addTextToPdf(element.text, fontSize, true);
        currentY += lineHeight * 0.5; // Extra spacing after headings
      } else {
        addTextToPdf(element.text, 10);
      }
    }

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));

    // Check file size
    if (pdfBuffer.length > MAX_PDF_OUTPUT_SIZE) {
      throw new Error('Generated PDF is too large. The webpage content is too extensive.');
    }

    // Count pages
    const pageCount = pdf.getNumberOfPages();

    // Generate filename
    const filename = sanitizeFilename(normalizedUrl);

    // Convert to base64 for client download
    const base64Pdf = pdfBuffer.toString('base64');
    const dataUrl = `data:application/pdf;base64,${base64Pdf}`;

    const processingTime = Date.now() - startTime;

    const result: ProcessedUrlPdf = {
      processedUrl: dataUrl,
      processedFileName: filename,
      originalUrl: normalizedUrl,
      fileSize: pdfBuffer.length,
      pageCount,
      processingTime,
      title: title || undefined
    };

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('URL to PDF conversion error:', error);
    
    let errorMessage = 'Failed to convert URL to PDF';
    
    if (error.name === 'AbortError') {
      errorMessage = 'The website took too long to load. Please try again or check if the URL is accessible.';
    } else if (error.message?.includes('Failed to fetch')) {
      errorMessage = 'Could not reach the website. Please check the URL and try again.';
    } else if (error.message?.includes('HTTP 4')) {
      errorMessage = 'The webpage could not be found (404). Please check the URL.';
    } else if (error.message?.includes('HTTP 5')) {
      errorMessage = 'The website is experiencing server issues. Please try again later.';
    } else if (error.message?.includes('too large')) {
      errorMessage = error.message;
    } else if (error.message?.includes('readable content')) {
      errorMessage = 'Could not extract readable content from the webpage. The site may be heavily JavaScript-dependent.';
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to convert URLs to PDF.' },
    { status: 405 }
  );
}
