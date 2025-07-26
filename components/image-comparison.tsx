
'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, ScanLine } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageComparisonProps {
  originalImage: string;
  processedImage: string;
  originalFileName: string;
}

export default function ImageComparison({
  originalImage,
  processedImage,
  originalFileName
}: ImageComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [showProcessedOnly, setShowProcessedOnly] = useState(false);
  const [isTransparentBackground, setIsTransparentBackground] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const position = ((e.clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, position)));
  };

  const toggleView = () => {
    setShowProcessedOnly(!showProcessedOnly);
  };

  const toggleBackground = () => {
    setIsTransparentBackground(!isTransparentBackground);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <ScanLine className="w-5 h-5 text-primary" />
            <span>Before & After Comparison</span>
          </CardTitle>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleView}
              className="flex items-center space-x-2"
            >
              {showProcessedOnly ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span>{showProcessedOnly ? 'Show Compare' : 'Show Result Only'}</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={toggleBackground}
              className="text-xs"
            >
              {isTransparentBackground ? 'Dark BG' : 'Transparent'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Comparison View */}
          {!showProcessedOnly ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-lg bg-muted"
              style={{ aspectRatio: '16/10' }}
            >
              <div
                ref={containerRef}
                className="relative w-full h-full cursor-col-resize select-none"
                onMouseMove={handleSliderMove}
              >
                {/* Original Image */}
                <div className="absolute inset-0">
                  <img
                    src={originalImage}
                    alt="Original"
                    className="w-full h-full object-contain"
                    draggable={false}
                  />
                  <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Original
                  </div>
                </div>

                {/* Processed Image Overlay */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                  <div
                    className={cn(
                      "w-full h-full flex items-center justify-center",
                      isTransparentBackground
                        ? "bg-transparent"
                        : "bg-gray-900",
                      // Checkerboard pattern for transparency
                      isTransparentBackground && 
                      "bg-[linear-gradient(45deg,#f0f0f0_25%,transparent_25%),linear-gradient(-45deg,#f0f0f0_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f0f0f0_75%),linear-gradient(-45deg,transparent_75%,#f0f0f0_75%)] bg-[length:20px_20px] bg-[0_0,0_10px,10px_-10px,-10px_0px]"
                    )}
                  >
                    <img
                      src={processedImage}
                      alt="Processed"
                      className="max-w-full max-h-full object-contain"
                      draggable={false}
                    />
                  </div>
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    Processed
                  </div>
                </div>

                {/* Slider Line */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-col-resize z-10"
                  style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <ScanLine className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
              </div>

              {/* Slider Instructions */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-xs">
                Move cursor to compare
              </div>
            </motion.div>
          ) : (
            /* Processed Image Only */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "relative overflow-hidden rounded-lg flex items-center justify-center",
                isTransparentBackground
                  ? "bg-[linear-gradient(45deg,#f0f0f0_25%,transparent_25%),linear-gradient(-45deg,#f0f0f0_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f0f0f0_75%),linear-gradient(-45deg,transparent_75%,#f0f0f0_75%)] bg-[length:20px_20px] bg-[0_0,0_10px,10px_-10px,-10px_0px]"
                  : "bg-gray-900"
              )}
              style={{ aspectRatio: '16/10' }}
            >
              <img
                src={processedImage}
                alt="Processed result"
                className="max-w-full max-h-full object-contain"
              />
              <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                Background Removed
              </div>
            </motion.div>
          )}

          {/* Image Info */}
          <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
            <div>
              <span className="font-medium">Filename:</span> {originalFileName}
            </div>
            <div className="flex items-center space-x-4">
              <span>
                <span className="font-medium">Format:</span> PNG with transparency
              </span>
              <span>
                <span className="font-medium">Background:</span> Removed
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
