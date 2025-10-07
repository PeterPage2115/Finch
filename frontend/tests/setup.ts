/**
 * Vitest Setup File
 * 
 * This file runs before the test environment is prepared.
 * It sets up jest-dom matchers and mocks Zustand for automatic store reset.
 */
import '@testing-library/jest-dom';
import { beforeAll, afterAll, afterEach } from 'vitest';

// Mock Zustand for automatic store reset between tests
vi.mock('zustand');

// Optional: Suppress console errors during tests (uncomment if needed)
// const originalError = console.error;
// beforeAll(() => {
//   console.error = (...args: any[]) => {
//     if (
//       typeof args[0] === 'string' &&
//       args[0].includes('Warning: ReactDOM.render')
//     ) {
//       return;
//     }
//     originalError.call(console, ...args);
//   };
// });

// afterAll(() => {
//   console.error = originalError;
// });
