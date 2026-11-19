export type UserRole = "admin" | "manager" | "staff" | "customer";

export interface ManagedUser {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: "manager" | "staff";
  managerId?: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Manager extends ManagedUser {
  role: "manager";
}

export interface Staff extends ManagedUser {
  role: "staff";
  managerId: number | null;
}

export interface CreateManagerPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UpdateManagerPayload {
  name?: string;
  email?: string;
  phone?: string;
  isActive?: boolean;
}

export interface CreateStaffPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  managerId?: number | null;
}

export interface UpdateStaffPayload {
  name?: string;
  email?: string;
  phone?: string;
  managerId?: number | null;
  isActive?: boolean;
}

export interface AssignStaffPayload {
  managerId: number;
}

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UserListData<T> {
  users: T[];
  pagination: Pagination;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface UserFormValues {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  managerId?: number | null;
  isActive?: boolean;
}

export interface PaginatedApiResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: Pagination;
}