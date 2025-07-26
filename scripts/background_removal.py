
#!/usr/bin/env python3
"""
Advanced Background Removal Script using rembg with multiple AI models
Supports intelligent model selection and high-quality processing
"""

import sys
import os
import argparse
import json
from pathlib import Path
from typing import Tuple, Optional, Dict, Any
import tempfile
import time

try:
    from rembg import remove, new_session
    from PIL import Image, ImageEnhance, ImageFilter
    import numpy as np
    import cv2
except ImportError as e:
    print(json.dumps({
        "success": False,
        "error": f"Missing required packages: {e}"
    }))
    sys.exit(1)

class AdvancedBackgroundRemover:
    """Advanced background removal with multiple AI models and post-processing"""
    
    # Available models and their strengths
    MODELS = {
        'u2net': {
            'name': 'U²-Net General',
            'description': 'Best for general objects, products, and simple portraits',
            'speed': 'fast',
            'quality': 'good'
        },
        'isnet-general-use': {
            'name': 'IS-Net General',
            'description': 'High-quality general purpose model for complex scenes',
            'speed': 'medium',
            'quality': 'excellent'
        },
        'birefnet-general': {
            'name': 'BiRefNet General',
            'description': 'State-of-the-art for complex backgrounds and fine details',
            'speed': 'slow',
            'quality': 'exceptional'
        },
        'u2net_human_seg': {
            'name': 'U²-Net Human',
            'description': 'Optimized specifically for human portraits',
            'speed': 'fast',
            'quality': 'excellent_for_humans'
        }
    }
    
    def __init__(self):
        self.sessions = {}
        
    def get_session(self, model_name: str):
        """Get or create a model session"""
        if model_name not in self.sessions:
            try:
                self.sessions[model_name] = new_session(model_name)
            except Exception as e:
                raise Exception(f"Failed to load model {model_name}: {str(e)}")
        return self.sessions[model_name]
    
    def detect_image_type(self, image_path: str) -> str:
        """Analyze image to determine the best processing approach"""
        try:
            # Load image for analysis
            img = cv2.imread(image_path)
            if img is None:
                return 'general'
            
            # Convert to RGB
            img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            height, width = img_rgb.shape[:2]
            
            # Simple heuristics for image type detection
            # This could be enhanced with more sophisticated ML-based detection
            
            # Check aspect ratio and size for portrait detection
            aspect_ratio = height / width
            is_portrait_oriented = 1.2 <= aspect_ratio <= 2.0
            
            # Check for skin-tone detection (simple approach)
            hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
            lower_skin = np.array([0, 20, 70], dtype=np.uint8)
            upper_skin = np.array([20, 255, 255], dtype=np.uint8)
            skin_mask = cv2.inRange(hsv, lower_skin, upper_skin)
            skin_ratio = np.sum(skin_mask > 0) / (height * width)
            
            # Decision logic
            if is_portrait_oriented and skin_ratio > 0.1:
                return 'human'
            elif skin_ratio > 0.15:
                return 'human'
            else:
                return 'general'
                
        except Exception:
            return 'general'
    
    def select_optimal_model(self, image_path: str, quality: str) -> str:
        """Select the best model based on image analysis and quality requirements"""
        image_type = self.detect_image_type(image_path)
        
        if quality == 'standard':
            if image_type == 'human':
                return 'u2net_human_seg'
            else:
                return 'u2net'
        else:  # high quality
            if image_type == 'human':
                return 'u2net_human_seg'  # Still best for humans even in HQ
            else:
                return 'birefnet-general'  # Best for complex general scenes
    
    def post_process_image(self, image: Image.Image, quality: str) -> Image.Image:
        """Apply post-processing to improve edge quality and reduce artifacts"""
        try:
            # Convert to RGBA if not already
            if image.mode != 'RGBA':
                image = image.convert('RGBA')
            
            # Get the alpha channel
            alpha = image.split()[-1]
            
            if quality == 'high':
                # High-quality post-processing
                
                # Slight gaussian blur to smooth edges
                alpha = alpha.filter(ImageFilter.GaussianBlur(0.5))
                
                # Edge enhancement using unsharp mask
                enhancer = ImageEnhance.Sharpness(alpha)
                alpha = enhancer.enhance(1.2)
                
                # Apply subtle morphological operations using numpy
                alpha_array = np.array(alpha)
                
                # Closing operation to fill small holes
                kernel = np.ones((2,2), np.uint8)
                alpha_array = cv2.morphologyEx(alpha_array, cv2.MORPH_CLOSE, kernel)
                
                # Opening operation to smooth edges
                kernel = np.ones((1,1), np.uint8)
                alpha_array = cv2.morphologyEx(alpha_array, cv2.MORPH_OPEN, kernel)
                
                alpha = Image.fromarray(alpha_array)
            
            else:
                # Standard post-processing - minimal to maintain speed
                alpha = alpha.filter(ImageFilter.GaussianBlur(0.3))
            
            # Reconstruct the image with processed alpha
            r, g, b = image.split()[:3]
            return Image.merge('RGBA', (r, g, b, alpha))
            
        except Exception as e:
            print(f"Post-processing warning: {e}", file=sys.stderr)
            return image
    
    def resize_for_quality(self, image: Image.Image, quality: str) -> Image.Image:
        """Resize image based on quality requirements"""
        width, height = image.size
        
        if quality == 'standard':
            # Standard: max 1200px on longest side
            max_size = 1200
        else:
            # High: max 2400px on longest side for better detail
            max_size = 2400
        
        if max(width, height) > max_size:
            if width > height:
                new_width = max_size
                new_height = int(height * max_size / width)
            else:
                new_height = max_size
                new_width = int(width * max_size / height)
            
            # Use high-quality resampling
            return image.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        return image
    
    def remove_background(self, input_path: str, output_path: str, quality: str = 'standard') -> Dict[str, Any]:
        """Remove background from image with advanced processing"""
        start_time = time.time()
        
        try:
            # Select optimal model
            model_name = self.select_optimal_model(input_path, quality)
            
            # Load and validate input image
            with Image.open(input_path) as input_image:
                # Convert to RGB if needed (rembg expects RGB)
                if input_image.mode in ('RGBA', 'LA'):
                    # Create white background for transparent images
                    background = Image.new('RGB', input_image.size, (255, 255, 255))
                    if input_image.mode == 'RGBA':
                        background.paste(input_image, mask=input_image.split()[-1])
                    else:
                        background.paste(input_image, mask=input_image.split()[-1])
                    input_image = background
                elif input_image.mode != 'RGB':
                    input_image = input_image.convert('RGB')
                
                # Resize based on quality requirements
                processed_image = self.resize_for_quality(input_image, quality)
                
                # Get model session
                session = self.get_session(model_name)
                
                # Remove background using selected model
                output_image = remove(processed_image, session=session)
                
                # Apply post-processing
                output_image = self.post_process_image(output_image, quality)
                
                # Save the result
                output_image.save(output_path, 'PNG', optimize=True, quality=95)
                
                # Get file size
                file_size = os.path.getsize(output_path)
                processing_time = round(time.time() - start_time, 2)
                
                return {
                    'success': True,
                    'model_used': model_name,
                    'model_info': self.MODELS.get(model_name, {}),
                    'processing_time': processing_time,
                    'file_size': file_size,
                    'output_dimensions': output_image.size,
                    'quality': quality
                }
                
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'processing_time': round(time.time() - start_time, 2)
            }

def main():
    parser = argparse.ArgumentParser(description='Advanced Background Removal')
    parser.add_argument('input', help='Input image path')
    parser.add_argument('output', help='Output image path')
    parser.add_argument('--quality', choices=['standard', 'high'], default='standard', help='Processing quality')
    parser.add_argument('--model', choices=list(AdvancedBackgroundRemover.MODELS.keys()), help='Force specific model')
    
    args = parser.parse_args()
    
    # Validate input file
    if not os.path.exists(args.input):
        print(json.dumps({
            'success': False,
            'error': f'Input file not found: {args.input}'
        }))
        sys.exit(1)
    
    # Create output directory if needed
    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    
    # Process image
    remover = AdvancedBackgroundRemover()
    
    # Override model selection if specified
    if args.model:
        remover.select_optimal_model = lambda *_: args.model
    
    result = remover.remove_background(args.input, args.output, args.quality)
    
    # Output result as JSON
    print(json.dumps(result))
    
    # Exit with appropriate code
    sys.exit(0 if result['success'] else 1)

if __name__ == '__main__':
    main()
