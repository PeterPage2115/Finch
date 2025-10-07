/**
 * Shared API configuration for all API clients
 * Uses environment variable or defaults to local development URL
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
