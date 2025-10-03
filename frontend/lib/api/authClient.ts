/**
 * API Auth Service
 * 
 * Wrapper dla endpointów autentykacji używający istniejącego apiClient
 */

import { apiClient } from './client';

/**
 * Typy odpowiedzi z API
 */
export interface ApiError {
  message: string | string[];
  statusCode: number;
  error?: string;
}

/**
 * DTO dla rejestracji
 */
export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

/**
 * DTO dla logowania
 */
export interface LoginDto {
  email: string;
  password: string;
}

/**
 * Odpowiedź z endpointu auth (register/login)
 */
export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}

/**
 * Pełny profil użytkownika
 */
export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Auth API Service
 */
export const authApi = {
  /**
   * POST /auth/register
   * Rejestracja nowego użytkownika
   */
  register: (data: RegisterDto): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/register', data);
  },

  /**
   * POST /auth/login
   * Logowanie użytkownika
   */
  login: (data: LoginDto): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/login', data);
  },

  /**
   * GET /auth/me
   * Pobranie profilu zalogowanego użytkownika
   */
  getProfile: (token: string): Promise<UserProfile> => {
    return apiClient.get<UserProfile>('/auth/me', token);
  },
};
