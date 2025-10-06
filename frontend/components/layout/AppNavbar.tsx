/**
 * AppNavbar Component
 * 
 * Unified navigation bar for all authenticated pages
 * Contains logo, navigation links, theme toggle, and logout button
 */

'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { useTheme } from '@/lib/providers/ThemeProvider';
import { Wallet } from 'lucide-react';

export default function AppNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Navigation */}
          <div className="flex items-center space-x-8">
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => router.push('/dashboard')}
            >
              <Wallet className="text-indigo-600 dark:text-indigo-400" size={28} />
              <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                Tracker Kasy
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className={`font-medium transition ${
                  isActive('/dashboard')
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => router.push('/categories')}
                className={`font-medium transition ${
                  isActive('/categories')
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                Kategorie
              </button>
              <button
                onClick={() => router.push('/budgets')}
                className={`font-medium transition ${
                  isActive('/budgets')
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                Budżety
              </button>
              <button
                onClick={() => router.push('/reports')}
                className={`font-medium transition ${
                  isActive('/reports')
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                Raporty
              </button>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              title={theme === 'dark' ? 'Tryb jasny' : 'Tryb ciemny'}
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <div className="text-sm hidden sm:block">
              <p className="text-gray-700 dark:text-gray-200 font-medium">{user?.name || 'Użytkownik'}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
            >
              Wyloguj
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
