
export type UserRole = "admin" | "manager" | "staff" | "customer";

// Authenticated user
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone?: string | null;
  isActive?: boolean;
}

export interface ManagedUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  managerId: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface UserFormValues {
  name: string;
  email: string;
  password?: string;
  managerId?: number | null;
}

export interface UserListParams {
  page: number;
  limit: number;
  search?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UserListResult {
  users: ManagedUser[];
  pagination: Pagination;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
