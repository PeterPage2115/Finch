/**
 * API Route: POST /api/auth/register
 * 
 * Proxy to backend auth endpoint.
 * Executes server-side request to backend and returns response to browser.
 */

import { NextRequest, NextResponse } from 'next/server';

// Backend URL - available only on server, NOT in browser
const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    console.log('📝 [API Route] POST /api/auth/register - proxy to backend');
    
    // Get body from request
    const body = await request.json();
    
    console.log('📤 [API Route] Forwarding to backend:', {
      url: `${BACKEND_URL}/auth/register`,
      email: body.email,
      name: body.name
    });
    
    // Wywołaj backend (server-to-server, wewnątrz Docker network)
    const response = await fetch(`${BACKEND_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    console.log('📥 [API Route] Response from backend:', {
      status: response.status,
      ok: response.ok
    });
    
    // Get data from response
    const data = await response.json();
    
    // Return response to browser with same status as backend
    return NextResponse.json(data, { 
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
  } catch (error) {
    console.error('❌ [API Route] Error during proxy to backend:', error);
    
    return NextResponse.json(
      { 
        message: 'Server connection error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
