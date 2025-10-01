export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <main className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Tracker Kasy
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
          Zarz¹dzaj swoimi finansami w prosty sposób
        </p>
        <div className="flex gap-4 justify-center flex-wrap mt-8">
          <a href="/login" className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg">
            Zaloguj siê
          </a>
          <a href="/register" className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-colors font-medium text-lg border-2 border-blue-600">
            Za³ó¿ konto
          </a>
        </div>
      </main>
      <footer className="mt-16 text-center text-gray-500 dark:text-gray-400">
        <p>Open Source - Self-Hosted - MIT License</p>
      </footer>
    </div>
  );
}
