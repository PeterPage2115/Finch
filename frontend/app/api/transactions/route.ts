/**
 * API Route: GET /api/transactions
 * 
 * Proxy to backend for fetching transaction list with filters and pagination
 * Uses BACKEND_API_URL (server-side only)
 */

import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL;

/**
 * Sanitizes user-controlled values before logging to prevent log injection.
 * Removes control characters (CR/LF, etc.) and limits overall length.
 * Reference: OWASP Logging guidance on neutralizing untrusted input.
 */
const sanitizeForLog = (value: string, maxLength = 200): string =>
  value
    .replace(/[\u0000-\u001F\u007F]+/g, '')
    .slice(0, maxLength);

if (!BACKEND_URL) {
  console.error('❌ BACKEND_API_URL is not defined in environment variables');
}

/**
 * GET /api/transactions
 * Fetches transaction list with filters and pagination
 * 
 * Query params:
 * - type?: INCOME | EXPENSE
 * - categoryId?: UUID
 * - startDate?: ISO 8601
 * - endDate?: ISO 8601
 * - page?: number
 * - limit?: number
 */
export async function GET(request: NextRequest) {
  try {
    // Pobierz Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Authorization header is missing' },
        { status: 401 }
      );
    }

    // Pobierz query parameters
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/transactions?${queryString}` : '/transactions';

    console.log('🔄 [API Route] Proxying GET to backend:', sanitizeForLog(endpoint));

    // Forward request to backend
    const backendResponse = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    const data = await backendResponse.json();

    // Return response z tym samym status code
    return NextResponse.json(data, {
      status: backendResponse.status,
    });
  } catch (error) {
    console.error('❌ [API Route] Error proxying to backend:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/transactions
 * Tworzy nową transakcję
 */
export async function POST(request: NextRequest) {
  try {
    // Pobierz Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Authorization header is missing' },
        { status: 401 }
      );
    }

    // Get body
    const body = await request.json();

    console.log('🔄 [API Route] Proxying POST to backend: /transactions');

    // Forward request to backend
    const backendResponse = await fetch(`${BACKEND_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();

    // Return response z tym samym status code
    return NextResponse.json(data, {
      status: backendResponse.status,
    });
  } catch (error) {
    console.error('❌ [API Route] Error proxying to backend:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
