import type { User, UserRole } from "./user.types";

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface RegisterResponse {
  user: AuthUser;
}
export interface AuthUser extends User {}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

export interface CurrentUserResponse {
  user: AuthUser;
}

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole | null;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
  confirmPassword: string;
}