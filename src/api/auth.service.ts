/**
 * Authentication API Service
 * Handles login, logout, and user profile requests with JWT Token Auth
 */

import { apiRequest } from '@/lib/api.client';
import { User } from '@/types/auth';

interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role?: 'user' | 'admin' | 'project_manager' | 'architect' | 'engineer';
  company?: string;
  phone_number?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface UserProfileResponse {
  user: User;
}

export interface LogoutResponse {
  message: string;
}

export const authService = {
  /**
   * Register a new user account
   */
  register: (payload: RegisterRequest): Promise<ApiResponse<LoginResponse>> =>
    apiRequest.post<ApiResponse<LoginResponse>>('/auth/register', payload),

  /**
   * Login with email and password
   * Returns JWT token that will be stored in localStorage
   */
  login: (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> =>
    apiRequest.post<ApiResponse<LoginResponse>>('/auth/login', credentials),

  /**
   * Get current authenticated user
   * Uses JWT token from Authorization header
   */
  getCurrentUser: (): Promise<ApiResponse<UserProfileResponse>> =>
    apiRequest.get<ApiResponse<UserProfileResponse>>('/auth/me'),

  /**
   * Logout and invalidate session
   * Clears JWT token from localStorage on client
   */
  logout: (): Promise<ApiResponse<Record<string, never>>> =>
    apiRequest.post<ApiResponse<Record<string, never>>>('/auth/logout'),
};
