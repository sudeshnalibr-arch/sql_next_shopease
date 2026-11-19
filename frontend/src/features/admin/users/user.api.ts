import api from "@/lib/axiosInstance";

import type {
  AssignStaffPayload,
  CreateManagerPayload,
  CreateStaffPayload,
  Manager,
  PaginatedApiResponse,
  Staff,
  UpdateManagerPayload,
  UpdateStaffPayload,
  UserListData,
  UserListParams,
} from "./user.types";

/**
 * Fetch all managers.
 * GET /api/admin/users/managers
 */
export const getManagers = async (
  params?: UserListParams
): Promise<UserListData<Manager>> => {
  const response = await api.get<PaginatedApiResponse<Manager>>(
    "/admin/users/managers",
    { params }
  );

  return {
    users: response.data.data,
    pagination: response.data.pagination,
  };
};

/**
 * Create a manager.
 * POST /api/admin/users/managers
 */
export const createManager = async (
  payload: CreateManagerPayload
): Promise<Manager> => {
  const response = await api.post<{ data: Manager }>(
    "/admin/users/managers",
    payload
  );

  return response.data.data;
};

/**
 * Update a manager.
 * PATCH /api/admin/users/managers/:id
 */
export const updateManager = async ({
  id,
  payload,
}: {
  id: number;
  payload: UpdateManagerPayload;
}): Promise<Manager> => {
  const response = await api.patch<{ data: Manager }>(
    `/admin/users/managers/${id}`,
    payload
  );

  return response.data.data;
};

/**
 * Fetch all staff.
 * GET /api/admin/users/staff
 */
export const getStaff = async (
  params?: UserListParams
): Promise<UserListData<Staff>> => {
  const response = await api.get<PaginatedApiResponse<Staff>>(
    "/admin/users/staff",
    { params }
  );

  return {
    users: response.data.data,
    pagination: response.data.pagination,
  };
};

/**
 * Create staff.
 * POST /api/admin/users/staff
 */
export const createStaff = async (
  payload: CreateStaffPayload
): Promise<Staff> => {
  const response = await api.post<{ data: Staff }>(
    "/admin/users/staff",
    payload
  );

  return response.data.data;
};

/**
 * Update staff.
 * PATCH /api/admin/users/staff/:id
 */
export const updateStaff = async ({
  id,
  payload,
}: {
  id: number;
  payload: UpdateStaffPayload;
}): Promise<Staff> => {
  const response = await api.patch<{ data: Staff }>(
    `/admin/users/staff/${id}`,
    payload
  );

  return response.data.data;
};

/**
 * Deactivate staff.
 * PATCH /api/admin/users/staff/:id/deactivate
 */
export const deactivateStaff = async (
  id: number
): Promise<Staff> => {
  const response = await api.patch<{ data: Staff }>(
    `/admin/users/staff/${id}/deactivate`
  );

  return response.data.data;
};

/**
 * Assign staff to a manager.
 * PATCH /api/admin/users/staff/:id/assign-manager
 */
export const assignStaffToManager = async ({
  id,
  payload,
}: {
  id: number;
  payload: AssignStaffPayload;
}): Promise<Staff> => {
  const response = await api.patch<{ data: Staff }>(
    `/admin/users/staff/${id}/assign-manager`,
    payload
  );

  return response.data.data;
};