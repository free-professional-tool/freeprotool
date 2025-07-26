
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Return empty providers since this app doesn't require authentication
  return NextResponse.json({
    providers: []
  });
}
