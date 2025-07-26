
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { SUPPORTED_EXCEL_TYPES, MAX_EXCEL_FILE_SIZE, SUPPORTED_PDF_TYPES, MAX_PDF_FILE_SIZE } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function downloadFile(url: string, filename: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Please upload a valid image file (JPEG, PNG, or WebP)'
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size must be less than 10MB'
    };
  }

  return { valid: true };
}

export function validateExcelFile(file: File): { valid: boolean; error?: string } {
  // Check file extension as well for better validation
  const fileName = file.name.toLowerCase();
  const hasValidExtension = fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.csv');
  
  if (!SUPPORTED_EXCEL_TYPES.includes(file.type) && !hasValidExtension) {
    return {
      valid: false,
      error: 'Please select a valid Excel file (.xlsx, .xls, or .csv)'
    };
  }

  if (file.size > MAX_EXCEL_FILE_SIZE) {
    return {
      valid: false,
      error: `File size must be less than ${Math.round(MAX_EXCEL_FILE_SIZE / 1024 / 1024)}MB`
    };
  }

  return { valid: true };
}

export function validatePdfFile(file: File): { valid: boolean; error?: string } {
  // Check file extension as well for better validation
  const fileName = file.name.toLowerCase();
  const hasValidExtension = fileName.endsWith('.pdf');
  
  if (!SUPPORTED_PDF_TYPES.includes(file.type) && !hasValidExtension) {
    return {
      valid: false,
      error: 'Please select a valid PDF file'
    };
  }

  if (file.size > MAX_PDF_FILE_SIZE) {
    return {
      valid: false,
      error: `File size must be less than ${Math.round(MAX_PDF_FILE_SIZE / 1024 / 1024)}MB`
    };
  }

  return { valid: true };
}

export function validateUrl(url: string): { valid: boolean; error?: string; normalizedUrl?: string } {
  if (!url?.trim()) {
    return {
      valid: false,
      error: 'Please enter a URL'
    };
  }

  let normalizedUrl = url.trim();
  
  // Add protocol if missing
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = 'https://' + normalizedUrl;
  }

  try {
    const urlObj = new URL(normalizedUrl);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return {
        valid: false,
        error: 'Only HTTP and HTTPS URLs are supported'
      };
    }

    // Basic hostname validation
    if (!urlObj.hostname || urlObj.hostname.length < 3) {
      return {
        valid: false,
        error: 'Please enter a valid website URL'
      };
    }

    // Block obviously invalid or potentially dangerous URLs
    const blockedHostnames = ['localhost', '127.0.0.1', '0.0.0.0'];
    if (blockedHostnames.some(blocked => urlObj.hostname.includes(blocked))) {
      return {
        valid: false,
        error: 'Local URLs are not supported for security reasons'
      };
    }

    return { 
      valid: true, 
      normalizedUrl 
    };
  } catch (error) {
    return {
      valid: false,
      error: 'Please enter a valid website URL (e.g., https://example.com)'
    };
  }
}

export function sanitizeFilename(url: string): string {
  try {
    const urlObj = new URL(url);
    let filename = urlObj.hostname;
    
    if (urlObj.pathname && urlObj.pathname !== '/') {
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      if (pathParts.length > 0) {
        filename += '-' + pathParts[pathParts.length - 1];
      }
    }
    
    // Remove invalid filename characters
    filename = filename.replace(/[<>:"/\\|?*]/g, '-');
    
    // Limit length and add timestamp for uniqueness
    const timestamp = new Date().toISOString().slice(0, 10);
    return `${filename.slice(0, 50)}-${timestamp}.pdf`;
  } catch {
    const timestamp = new Date().toISOString().slice(0, 10);
    return `website-${timestamp}.pdf`;
  }
}
