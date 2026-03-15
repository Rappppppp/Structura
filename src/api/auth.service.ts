/**
 * Authentication API Service
 * Handles login, logout, and user profile requests with JWT Token Auth
 */

import { apiRequest } from '@/lib/api.client';
import { User } from '@/types/auth';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface UserProfileResponse {
  user: User;
}

export interface LogoutResponse {
  message: string;
}

export const authService = {
  /**
   * Login with email and password
   * Returns JWT token that will be stored in localStorage
   */
  login: (credentials: LoginRequest): Promise<LoginResponse> =>
    apiRequest.post<LoginResponse>('/auth/login', credentials),

  /**
   * Get current authenticated user
   * Uses JWT token from Authorization header
   */
  getCurrentUser: (): Promise<UserProfileResponse> =>
    apiRequest.get<UserProfileResponse>('/auth/me'),

  /**
   * Logout and invalidate session
   * Clears JWT token from localStorage on client
   */
  logout: (): Promise<LogoutResponse> =>
    apiRequest.post<LogoutResponse>('/auth/logout'),
};
