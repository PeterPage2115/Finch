'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../lib/stores/authStore';

export default function Home() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    // Jeśli użytkownik jest zalogowany, przekieruj na dashboard
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <main className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          💰 Tracker Kasy
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
          Zarządzaj swoimi finansami w prosty sposób
        </p>
        <div className="flex gap-4 justify-center flex-wrap mt-8">
          <Link 
            href="/login" 
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-lg shadow-lg"
          >
            Zaloguj się
          </Link>
          <Link 
            href="/register" 
            className="px-8 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-50 transition-colors font-medium text-lg border-2 border-indigo-600 shadow-lg"
          >
            Załóż konto
          </Link>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
              Śledź transakcje
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Dodawaj przychody i wydatki, kategoryzuj je i przeglądaj historię
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="text-3xl mb-3">💼</div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
              Zarządzaj budżetem
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Ustaw limity wydatków i monitoruj postępy w realizacji celów
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
              Prywatność przede wszystkim
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Twoje dane pozostają u Ciebie - self-hosted i open source
            </p>
          </div>
        </div>
      </main>

      <footer className="mt-16 text-center text-gray-500 dark:text-gray-400">
        <p>Open Source - Self-Hosted - MIT License</p>
      </footer>
    </div>
  );
}
