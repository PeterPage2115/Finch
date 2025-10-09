/**
 * API Route: POST /api/import/transactions
 * 
 * Proxy to backend for CSV import
 * Forwards multipart/form-data to backend POST /import/transactions
 */

import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL;

if (!BACKEND_URL) {
  console.error('❌ BACKEND_API_URL is not defined in environment variables');
}

/**
 * POST /api/import/transactions
 * Uploads CSV file and imports transactions
 * 
 * Body: multipart/form-data with 'file' field
 * Returns: ImportResultDto
 */
export async function POST(request: NextRequest) {
  try {
    // Check authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Authorization header is missing' },
        { status: 401 }
      );
    }

    // Get FormData from request
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { message: 'CSV file is required' },
        { status: 400 }
      );
    }

    console.log('📤 [API] Forwarding CSV import to backend:', {
      filename: file.name,
      size: file.size,
      type: file.type,
    });

    // Forward to backend
    const backendUrl = `${BACKEND_URL}/import/transactions`;
    const backendFormData = new FormData();
    backendFormData.append('file', file);

    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
      },
      body: backendFormData,
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      console.error('❌ [API] Backend import failed:', {
        status: backendResponse.status,
        error: data,
      });
      return NextResponse.json(data, { status: backendResponse.status });
    }

    console.log('✅ [API] Import successful:', {
      successCount: data.successCount,
      failedCount: data.failedCount,
      autoCreatedCategories: data.autoCreatedCategories?.length || 0,
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('❌ [API] Import error:', error);
    return NextResponse.json(
      { message: 'Internal server error during import' },
      { status: 500 }
    );
  }
}
