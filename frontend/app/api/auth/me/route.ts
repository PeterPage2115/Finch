/**
 * API Route: GET /api/auth/me
 * 
 * Proxy to backend auth endpoint for fetching user profile.
 * Executes server-side request to backend with JWT token.
 */

import { NextRequest, NextResponse } from 'next/server';

// Backend URL - available only on server, NOT in browser
const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    console.log('👤 [API Route] GET /api/auth/me - proxy to backend');
    
    // Get Authorization header from request
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      console.warn('⚠️ [API Route] Missing Authorization header');
      return NextResponse.json(
        { message: 'Authorization token missing' },
        { status: 401 }
      );
    }
    
    console.log('📤 [API Route] Forwarding to backend:', {
      url: `${BACKEND_URL}/auth/me`,
      hasToken: true
    });
    
    // Wywołaj backend (server-to-server, wewnątrz Docker network)
    const response = await fetch(`${BACKEND_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader, // Przekaż token
      },
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
