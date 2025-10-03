import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, AuthTokens } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // Actions
  setAuth: (user: User, tokens: AuthTokens) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

/**
 * Custom storage that syncs between localStorage and cookies
 * This allows server-side middleware to read authentication state
 */
const cookieStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(name);
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === 'undefined') return;
    
    // Save to localStorage
    localStorage.setItem(name, value);
    
    // Also save to cookies for server-side access (middleware)
    const maxAge = 60 * 60 * 24 * 7; // 7 days
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  },
  removeItem: (name: string): void => {
    if (typeof window === 'undefined') return;
    
    // Remove from localStorage
    localStorage.removeItem(name);
    
    // Remove from cookies
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  },
};

/**
 * Zustand store for authentication state
 * Persisted to both localStorage AND cookies (for server-side middleware)
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, tokens) =>
        set({
          user,
          token: tokens.accessToken,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => cookieStorage),
    }
  )
);
