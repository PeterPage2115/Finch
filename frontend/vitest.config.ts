import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tsconfigPaths(), // Handle @/* path aliases from tsconfig.json
    react(), // Enable React JSX/TSX support
  ],
  test: {
    globals: true, // Enable Jest-like global APIs (describe, it, expect)
    environment: 'jsdom', // Simulate browser DOM for React components
    setupFiles: ['./tests/setup.ts'], // Run setup before tests
    coverage: {
      provider: 'v8', // Use V8 for fast coverage
      reporter: ['text', 'json', 'html'], // Multiple coverage formats
      include: ['components/**/*.{ts,tsx}', 'lib/**/*.{ts,tsx}', 'app/**/*.{ts,tsx}'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/types/**',
      ],
    },
  },
});
