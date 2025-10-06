import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://backend:3001';

/**
 * GET /api/categories/[id]
 * Pobiera szczegóły pojedynczej kategorii
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return NextResponse.json(
      { message: 'Brak tokenu autoryzacji' },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(`${BACKEND_URL}/categories/${id}`, {
      method: 'GET',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ [API] Error fetching category:', error);
    return NextResponse.json(
      { message: 'Błąd podczas pobierania kategorii' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/categories/[id]
 * Aktualizuje kategorię
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return NextResponse.json(
      { message: 'Brak tokenu autoryzacji' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/categories/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ [API] Error updating category:', error);
    return NextResponse.json(
      { message: 'Błąd podczas aktualizacji kategorii' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/categories/[id]
 * Usuwa kategorię
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return NextResponse.json(
      { message: 'Brak tokenu autoryzacji' },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(`${BACKEND_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: authHeader,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    // DELETE może zwrócić 200 z message lub 204 bez body
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data);
    }

    return NextResponse.json({ message: 'Kategoria usunięta' });
  } catch (error) {
    console.error('❌ [API] Error deleting category:', error);
    return NextResponse.json(
      { message: 'Błąd podczas usuwania kategorii' },
      { status: 500 }
    );
  }
}
