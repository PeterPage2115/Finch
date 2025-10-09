/**
 * API Route: GET /api/auth/me
 * 
 * Proxy do backend auth endpoint dla pobrania profilu użytkownika.
 * Wykonuje request server-side do backendu z tokenem JWT.
 */

import { NextRequest, NextResponse } from 'next/server';

// Backend URL - dostępne tylko na serwerze, NIE w przeglądarce
const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    console.log('👤 [API Route] GET /api/auth/me - proxy do backend');
    
    // Pobierz Authorization header z request
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      console.warn('⚠️ [API Route] Brak Authorization header');
      return NextResponse.json(
        { message: 'Brak tokenu autoryzacji' },
        { status: 401 }
      );
    }
    
    console.log('📤 [API Route] Przekazywanie do backend:', {
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
