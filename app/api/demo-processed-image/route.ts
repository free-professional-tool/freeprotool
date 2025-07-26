
import { NextRequest, NextResponse } from 'next/server';

// Demo endpoint for when no API keys are configured
export async function GET(request: NextRequest) {
  // Create a simple transparent PNG with text indicating this is a demo
  const svg = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="none" stroke="#e2e8f0" stroke-width="2" stroke-dasharray="10,5"/>
      <text x="200" y="140" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#64748b">
        Demo Mode - Background Removed
      </text>
      <text x="200" y="165" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#94a3b8">
        Configure API keys for real processing
      </text>
    </svg>
  `;

  const buffer = Buffer.from(svg);
  
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache',
    },
  });
}
