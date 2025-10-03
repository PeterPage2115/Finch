import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware Next.js do ochrony tras wymagających autentykacji
 * 
 * Chroni trasy: /dashboard, /transactions, /budgets, /categories, /profile
 * Publiczne trasy: /login, /register, /
 */

// Trasy wymagające autentykacji
const protectedRoutes = [
  '/dashboard',
  '/transactions',
  '/budgets',
  '/categories',
  '/profile',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Sprawdź czy użytkownik jest zalogowany (sprawdzamy localStorage w cookies)
  // Uwaga: Middleware działa na serwerze, więc musimy sprawdzić cookie
  const authCookie = request.cookies.get('auth-storage');
  
  let isAuthenticated = false;
  
  if (authCookie) {
    try {
      const authData = JSON.parse(authCookie.value);
      isAuthenticated = authData.state?.isAuthenticated || false;
    } catch {
      // Cookie jest niepoprawne
      isAuthenticated = false;
    }
  }

  // Sprawdź czy trasa jest chroniona
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Jeśli trasa jest chroniona i użytkownik nie jest zalogowany
  if (isProtectedRoute && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    // Zapisz oryginalny URL do przekierowania po logowaniu
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // Jeśli użytkownik jest zalogowany i próbuje wejść na /login lub /register
  if (
    isAuthenticated &&
    (pathname === '/login' || pathname === '/register')
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Konfiguracja: na jakich ścieżkach uruchamiać middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
