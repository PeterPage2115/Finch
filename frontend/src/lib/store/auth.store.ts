import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Typ użytkownika (zgodny z backendem)
 */
export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Stan autentykacji
 */
interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Akcje autentykacji
 */
interface AuthActions {
  setAuth: (user: User, accessToken: string) => void;
  logout: () => void;
  setLoading: (isLoading: boolean) => void;
  updateUser: (user: Partial<User>) => void;
}

/**
 * Zustand store dla autentykacji
 * 
 * Funkcjonalności:
 * - Przechowywanie stanu użytkownika i tokenu JWT
 * - Persystencja w localStorage (automatyczne logowanie po odświeżeniu)
 * - Akcje: setAuth, logout, updateUser
 */
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      // Stan początkowy
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      /**
       * Ustawia dane uwierzytelnienia po logowaniu/rejestracji
       */
      setAuth: (user, accessToken) =>
        set({
          user,
          accessToken,
          isAuthenticated: true,
          isLoading: false,
        }),

      /**
       * Wylogowanie użytkownika - czyści stan
       */
      logout: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      /**
       * Ustawia stan ładowania
       */
      setLoading: (isLoading) => set({ isLoading }),

      /**
       * Aktualizuje dane użytkownika (np. po edycji profilu)
       */
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: 'auth-storage', // Klucz w localStorage
      partialize: (state) => ({
        // Persystujemy tylko te pola
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
