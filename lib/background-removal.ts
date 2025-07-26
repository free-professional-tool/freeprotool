
interface BackgroundRemovalResult {
  processedImageUrl: string;
  processedBlob: Blob;
  success: boolean;
  error?: string;
  processingTime?: number;
  modelUsed?: string;
  modelInfo?: any;
  outputDimensions?: [number, number];
  fileSize?: number;
}

interface ApiResponse {
  success: boolean;
  data?: {
    originalFileName: string;
    processedFileName: string;
    processedImageUrl: string;
    quality: string;
    fileSize: number;
    processingTime?: number;
    modelUsed?: string;
    modelInfo?: any;
    outputDimensions?: [number, number];
    apiUsed?: string;
  };
  error?: string;
}

class AdvancedBackgroundRemovalProcessor {
  
  async processImage(
    imageFile: File, 
    quality: 'standard' | 'high' = 'standard'
  ): Promise<BackgroundRemovalResult> {
    try {
      // Create form data for API request
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('quality', quality);

      // Call the API endpoint
      const response = await fetch('/api/remove-background', {
        method: 'POST',
        body: formData,
      });

      const result: ApiResponse = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Processing failed');
      }

      // Convert base64 to blob for consistency with previous interface
      const processedBlob = await this.dataUrlToBlob(result.data.processedImageUrl);

      return {
        processedImageUrl: result.data.processedImageUrl,
        processedBlob,
        success: true,
        processingTime: result.data.processingTime,
        modelUsed: result.data.modelUsed,
        modelInfo: result.data.modelInfo,
        outputDimensions: result.data.outputDimensions,
        fileSize: result.data.fileSize
      };

    } catch (error) {
      console.error('Background removal error:', error);
      return {
        processedImageUrl: '',
        processedBlob: new Blob(),
        success: false,
        error: error instanceof Error ? error.message : 'Processing failed'
      };
    }
  }

  private async dataUrlToBlob(dataUrl: string): Promise<Blob> {
    try {
      const response = await fetch(dataUrl);
      return await response.blob();
    } catch (error) {
      console.error('Failed to convert data URL to blob:', error);
      return new Blob();
    }
  }

  // Compatibility method - no longer needed but kept for backward compatibility
  async initialize(): Promise<void> {
    // No initialization needed for server-side processing
    return Promise.resolve();
  }

  // Compatibility method - no longer needed but kept for backward compatibility
  cleanup(): void {
    // No cleanup needed for server-side processing
  }
}

// Export singleton instance
export const backgroundRemovalProcessor = new AdvancedBackgroundRemovalProcessor();

export type { BackgroundRemovalResult };
