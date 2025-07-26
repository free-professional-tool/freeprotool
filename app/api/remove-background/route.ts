
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile, unlink } from 'fs/promises';
import { join } from 'path';
import { spawn } from 'child_process';
import { generateRandomId } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface PythonProcessResult {
  success: boolean;
  error?: string;
  model_used?: string;
  model_info?: any;
  processing_time?: number;
  file_size?: number;
  output_dimensions?: [number, number];
  quality?: string;
}

function runPythonScript(inputPath: string, outputPath: string, quality: string): Promise<PythonProcessResult> {
  return new Promise((resolve) => {
    const pythonScript = join(process.cwd(), 'scripts', 'background_removal.py');
    const childProcess = spawn('python3', [pythonScript, inputPath, outputPath, '--quality', quality]);
    
    let stdout = '';
    let stderr = '';
    
    childProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    childProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    childProcess.on('close', (code) => {
      try {
        if (code === 0 && stdout.trim()) {
          const result = JSON.parse(stdout.trim());
          resolve(result);
        } else {
          resolve({
            success: false,
            error: stderr || `Process exited with code ${code}`
          });
        }
      } catch (parseError) {
        resolve({
          success: false,
          error: `Failed to parse result: ${parseError}. Output: ${stdout}`
        });
      }
    });
    
    childProcess.on('error', (error) => {
      resolve({
        success: false,
        error: `Failed to start process: ${error.message}`
      });
    });
  });
}

export async function POST(request: NextRequest) {
  const tempFiles: string[] = [];
  
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const quality = formData.get('quality') as string || 'standard';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Please upload a JPEG, PNG, or WebP image.' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size too large. Please upload an image smaller than 10MB.' },
        { status: 400 }
      );
    }

    // Store the original file temporarily
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Generate unique filenames
    const uniqueId = generateRandomId();
    const fileExtension = file.name.split('.').pop() || 'png';
    const inputFilename = `input_${uniqueId}_${Date.now()}.${fileExtension}`;
    const outputFilename = `output_${uniqueId}_${Date.now()}.png`;
    
    const inputPath = join(uploadsDir, inputFilename);
    const outputPath = join(uploadsDir, outputFilename);
    
    tempFiles.push(inputPath, outputPath);

    // Save input file
    await writeFile(inputPath, buffer);

    // Process image with Python script
    const result = await runPythonScript(inputPath, outputPath, quality);

    if (!result.success) {
      throw new Error(result.error || 'Background removal failed');
    }

    // Read processed image
    const processedImageBuffer = await readFile(outputPath);
    const processedImageBase64 = `data:image/png;base64,${processedImageBuffer.toString('base64')}`;

    // Clean up temporary files
    try {
      await Promise.all(tempFiles.map(file => unlink(file).catch(() => {})));
    } catch (cleanupError) {
      console.warn('Cleanup warning:', cleanupError);
    }

    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        originalFileName: file.name,
        processedFileName: `processed_${file.name.replace(/\.[^/.]+$/, '')}.png`,
        processedImageUrl: processedImageBase64,
        quality,
        fileSize: result.file_size || processedImageBuffer.length,
        processingTime: result.processing_time,
        modelUsed: result.model_used,
        modelInfo: result.model_info,
        outputDimensions: result.output_dimensions,
        apiUsed: `Advanced AI (${result.model_info?.name || result.model_used})`
      }
    });

  } catch (error) {
    // Clean up temporary files on error
    try {
      await Promise.all(tempFiles.map(file => unlink(file).catch(() => {})));
    } catch (cleanupError) {
      console.warn('Cleanup warning:', cleanupError);
    }

    console.error('Background removal error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process image' 
      },
      { status: 500 }
    );
  }
}
