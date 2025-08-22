export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company?: string;
  avatar?: string;
  lastLogin?: Date;
  isEmailVerified: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  company?: string;
  termsAccepted: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}

export enum UserRole {
  ADMIN = 'admin',
  OWNER = 'owner',
  MANAGER = 'manager',
  USER = 'user'
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: number;
}
