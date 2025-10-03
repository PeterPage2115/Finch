'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/stores/authStore';
import { authApi } from '@/lib/api/authClient';

export default function LoginDebugPage() {
  const { setAuth, isAuthenticated, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    email: 'piotr.paz04@gmail.com',
    password: '',
  });

  const addLog = (message: string, data?: any) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = data 
      ? `[${timestamp}] ${message}\n${JSON.stringify(data, null, 2)}`
      : `[${timestamp}] ${message}`;
    setLogs(prev => [...prev, logMessage]);
    console.log(message, data || '');
  };

  // Obserwuj zmianę stanu autentykacji
  useEffect(() => {
    addLog('🔄 useEffect triggered', { loginSuccess, isAuthenticated });
    
    if (loginSuccess && isAuthenticated) {
      addLog('✅ Warunki spełnione - przekierowanie za 2s...');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    }
  }, [loginSuccess, isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLogs([]); // Wyczyść poprzednie logi
    addLog('🔵 START - Kliknięto przycisk Zaloguj');
    addLog('📧 Email', { email: formData.email });
    
    setError('');
    setIsLoading(true);
    setLoginSuccess(false);

    try {
      addLog('📡 Wysyłanie POST /auth/login...');
      const response = await authApi.login(formData);
      addLog('✅ Odpowiedź otrzymana', {
        user: response.user,
        hasToken: !!response.accessToken,
        tokenLength: response.accessToken?.length
      });
      
      addLog('💾 Wywołanie setAuth()...');
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
      addLog('✅ setAuth() zakończone');

      addLog('🎯 Ustawienie loginSuccess = true');
      setLoginSuccess(true);
      
      addLog('⏰ Czekanie na useEffect...');
    } catch (err) {
      addLog('❌ BŁĄD', {
        message: (err as Error).message,
        name: (err as Error).name,
      });
      const error = err as Error;
      setError(error.message || 'Nieprawidłowy email lub hasło');
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      {/* Formularz - Lewa strona */}
      <div className="w-1/2 flex items-center justify-center p-8">
        <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-4xl mb-2">💰</div>
            <h1 className="text-3xl font-bold text-slate-800">Debug Login</h1>
            <p className="text-slate-600 mt-2">Testy z pełnym logowaniem</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <p className="font-medium">Błąd</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
            <p className="font-medium text-blue-900">Stan:</p>
            <p className="text-blue-700">isAuthenticated: <strong>{isAuthenticated ? 'true ✅' : 'false ❌'}</strong></p>
            <p className="text-blue-700">loginSuccess: <strong>{loginSuccess ? 'true ✅' : 'false ❌'}</strong></p>
            <p className="text-blue-700">isLoading: <strong>{isLoading ? 'true ⏳' : 'false'}</strong></p>
            {user && <p className="text-blue-700">User: <strong>{user.email}</strong></p>}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Adres email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-slate-900"
                placeholder="twoj@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Hasło
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-slate-900"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logowanie...
                </span>
              ) : (
                'Zaloguj się'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            <Link href="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Nie masz jeszcze konta? Załóż konto
            </Link>
          </div>
        </div>
      </div>

      {/* Logi - Prawa strona */}
      <div className="w-1/2 bg-slate-900 text-green-400 p-8 overflow-auto font-mono text-sm">
        <h2 className="text-xl font-bold mb-4 text-white">📋 Live Debug Logs</h2>
        <div className="space-y-2">
          {logs.length === 0 ? (
            <p className="text-slate-500">Czekam na logowanie...</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="whitespace-pre-wrap break-words border-b border-slate-700 pb-2">
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
