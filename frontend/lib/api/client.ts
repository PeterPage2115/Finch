/**
 * API Client for communicating with the backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface FetchOptions extends RequestInit {
  token?: string;
}

/**
 * Generic fetch wrapper with authentication support
 */
async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  // Add authorization header if token is provided
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log('🌐 [API] Wywołanie:', {
    method: fetchOptions.method || 'GET',
    url,
    hasToken: !!token,
    hasBody: !!fetchOptions.body
  });

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });
    
    console.log('📡 [API] Odpowiedź otrzymana:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.warn('⚠️ [API] Odpowiedź nie jest JSON');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return {} as T;
    }

    const data = await response.json();
    console.log('📦 [API] Dane odpowiedzi:', data);

    if (!response.ok) {
      console.error('❌ [API] Status nie OK:', response.status);
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('❌ [API] Błąd fetch:', error);
    throw error;
  }
}

/**
 * API Client object with methods for different HTTP verbs
 */
export const apiClient = {
  get: <T>(endpoint: string, token?: string): Promise<T> =>
    apiFetch<T>(endpoint, { method: 'GET', token }),

  post: <T>(endpoint: string, data: unknown, token?: string): Promise<T> =>
    apiFetch<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  put: <T>(endpoint: string, data: unknown, token?: string): Promise<T> =>
    apiFetch<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    }),

  patch: <T>(endpoint: string, data: unknown, token?: string): Promise<T> =>
    apiFetch<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
      token,
    }),

  delete: <T>(endpoint: string, token?: string): Promise<T> =>
    apiFetch<T>(endpoint, { method: 'DELETE', token }),
};

export default apiClient;
