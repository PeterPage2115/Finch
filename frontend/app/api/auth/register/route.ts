/**
 * API Route: POST /api/auth/register
 * 
 * Proxy do backend auth endpoint.
 * Wykonuje request server-side do backendu i zwraca odpowiedź do przeglądarki.
 */

import { NextRequest, NextResponse } from 'next/server';

// Backend URL - dostępne tylko na serwerze, NIE w przeglądarce
const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    console.log('📝 [API Route] POST /api/auth/register - proxy do backend');
    
    // Pobierz body z request
    const body = await request.json();
    
    console.log('📤 [API Route] Przekazywanie do backend:', {
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
    
    console.log('📥 [API Route] Odpowiedź z backend:', {
      status: response.status,
      ok: response.ok
    });
    
    // Pobierz dane z odpowiedzi
    const data = await response.json();
    
    // Zwróć odpowiedź do przeglądarki z tym samym statusem co backend
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
