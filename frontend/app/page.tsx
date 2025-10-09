'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../lib/stores/authStore';
import { Wallet, BarChart2, Briefcase, Lock } from 'lucide-react';

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
        <div className="flex items-center justify-center gap-4 mb-6">
          <Wallet className="w-16 h-16 md:w-20 md:h-20 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
            Finch
          </h1>
        </div>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
          Manage your finances in a simple way
        </p>
        <div className="flex gap-4 justify-center flex-wrap mt-8">
          <Link 
            href="/login" 
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-lg shadow-lg"
          >
            Sign In
          </Link>
          <Link 
            href="/register" 
            className="px-8 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-50 transition-colors font-medium text-lg border-2 border-indigo-600 shadow-lg"
          >
            Create Account
          </Link>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-center w-12 h-12 mb-3 rounded-lg bg-indigo-100 dark:bg-indigo-900">
              <BarChart2 size={28} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
              Track Transactions
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Add income and expenses, categorize them and review history
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-center w-12 h-12 mb-3 rounded-lg bg-indigo-100 dark:bg-indigo-900">
              <Briefcase size={28} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
              Manage Budget
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Set spending limits and monitor progress toward your goals
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-center w-12 h-12 mb-3 rounded-lg bg-indigo-100 dark:bg-indigo-900">
              <Lock size={28} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
              Privacy First
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your data stays with you - self-hosted and open source
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
