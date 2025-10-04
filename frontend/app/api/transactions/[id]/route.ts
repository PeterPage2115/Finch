/**
 * API Route: /api/transactions/[id]
 * 
 * Proxy do backendu dla operacji na pojedynczej transakcji
 * GET, PATCH, DELETE
 */

import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL;

if (!BACKEND_URL) {
  console.error('❌ BACKEND_API_URL is not defined in environment variables');
}

/**
 * GET /api/transactions/[id]
 * Pobiera pojedynczą transakcję
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Pobierz Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Authorization header is missing' },
        { status: 401 }
      );
    }

    console.log(`🔄 [API Route] Proxying GET to backend: /transactions/${id}`);

    // Forward request do backendu
    const backendResponse = await fetch(`${BACKEND_URL}/transactions/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    const data = await backendResponse.json();

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
 * PATCH /api/transactions/[id]
 * Aktualizuje transakcję
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Pobierz Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Authorization header is missing' },
        { status: 401 }
      );
    }

    // Pobierz body
    const body = await request.json();

    console.log(`🔄 [API Route] Proxying PATCH to backend: /transactions/${id}`);

    // Forward request do backendu
    const backendResponse = await fetch(`${BACKEND_URL}/transactions/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();

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
 * DELETE /api/transactions/[id]
 * Usuwa transakcję
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Pobierz Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Authorization header is missing' },
        { status: 401 }
      );
    }

    console.log(`🔄 [API Route] Proxying DELETE to backend: /transactions/${id}`);

    // Forward request do backendu
    const backendResponse = await fetch(`${BACKEND_URL}/transactions/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    const data = await backendResponse.json();

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
