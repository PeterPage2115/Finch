import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:3001';

/**
 * GET /api/categories
 * Proxy do backendu - pobiera kategorie użytkownika
 */
export async function GET(request: NextRequest) {
  try {
    // Forward Authorization header
    const authorization = request.headers.get('authorization');
    if (!authorization) {
      return NextResponse.json(
        { message: 'Authorization header missing' },
        { status: 401 }
      );
    }

    const response = await fetch(`${BACKEND_API_URL}/categories`, {
      method: 'GET',
      headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Categories fetch failed' }));
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Categories API Route Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
