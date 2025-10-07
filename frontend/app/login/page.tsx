'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/stores/authStore';
import { authApi } from '@/lib/api/authClient';
import { useTheme } from '@/lib/providers/ThemeProvider';
import { Moon, Sun } from 'lucide-react';

export default function LoginPage() {
  const { setAuth, isAuthenticated } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Obserwuj zmianę stanu autentykacji i przekieruj gdy stan się zmieni
  useEffect(() => {
    if (loginSuccess && isAuthenticated) {
      console.log('✅ [LOGIN] Stan autentykacji potwierdzony, przekierowanie...');
      // Użyj window.location.href dla pełnego przeładowania - unika race condition z middleware
      window.location.href = '/dashboard';
    }
  }, [loginSuccess, isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔵 [LOGIN] Rozpoczęcie procesu logowania');
    console.log('📧 [LOGIN] Email:', formData.email);
    
    setError('');
    setIsLoading(true);
    setLoginSuccess(false);

    try {
      console.log('📡 [LOGIN] Wysyłanie żądania do API...');
      const response = await authApi.login(formData);
      console.log('✅ [LOGIN] Odpowiedź z API otrzymana:', {
        user: response.user,
        hasToken: !!response.accessToken,
        tokenLength: response.accessToken?.length
      });
      
      console.log('💾 [LOGIN] Zapisywanie danych do store...');
      // Zapisz dane w store
      setAuth(
        {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        { accessToken: response.accessToken }
      );
      console.log('✅ [LOGIN] Dane zapisane w store');

      // Ustaw flagę sukcesu - useEffect obsłuży przekierowanie
      setLoginSuccess(true);
      console.log('🎯 [LOGIN] Flaga loginSuccess ustawiona - czekam na useEffect...');
    } catch (err) {
      console.error('❌ [LOGIN] Błąd podczas logowania:', err);
      console.error('❌ [LOGIN] Szczegóły błędu:', {
        message: (err as Error).message,
        name: (err as Error).name,
        stack: (err as Error).stack
      });
      const error = err as Error;
      setError(error.message || 'Nieprawidłowy email lub hasło');
      setIsLoading(false);
    }
    // Note: nie ustawiamy isLoading=false w try, bo przekierowanie nastąpi
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 sm:px-6 lg:px-8">
      {/* Floating Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95 border border-gray-200 dark:border-gray-700"
        title={theme === 'dark' ? 'Tryb jasny' : 'Tryb ciemny'}
        aria-label="Przełącz tryb ciemny/jasny"
      >
        {theme === 'dark' ? (
          <Sun className="w-6 h-6 text-yellow-500" />
        ) : (
          <Moon className="w-6 h-6 text-indigo-600" />
        )}
      </button>

      <div className="max-w-md w-full space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              💰 Tracker Kasy
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Zaloguj się do swojego konta
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Adres email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="jan@example.com"
                disabled={isLoading}
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Hasło
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logowanie...
                </>
              ) : (
                'Zaloguj się'
              )}
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className="mt-4 text-center">
            <Link
              href="/forgot-password"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Zapomniałeś hasła?
            </Link>
          </div>

          {/* Footer - Link to Register */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Nie masz jeszcze konta?{' '}
              <Link
                href="/register"
                className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition"
              >
                Załóż konto
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          Twoje dane są bezpieczne i chronione
        </p>
      </div>
    </div>
  );
}
