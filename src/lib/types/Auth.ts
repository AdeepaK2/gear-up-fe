export interface User {
  email: string;
  name: string;
  role: UserRole;
  isAuthenticated: boolean;
}

export enum UserRole {
  PUBLIC = 'PUBLIC',
  CUSTOMER = 'CUSTOMER',
  EMPLOYEE = 'EMPLOYEE',
  ADMIN = 'ADMIN'
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

export interface UserResponse {
  email: string;
  name: string;
}

export interface JwtPayload {
  sub: string; // email
  role: UserRole;
  requiresPasswordChange?: boolean; // Flag for temporary passwords
  exp: number;
  iat: number;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordChangeResponse {
  message: string;
  requiresPasswordChange: boolean;
}