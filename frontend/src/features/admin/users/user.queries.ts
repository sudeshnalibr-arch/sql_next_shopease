import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  assignStaffToManager,
  createManager,
  createStaff,
  deactivateStaff,
  getManagers,
  getStaff,
  updateManager,
  updateStaff,
} from "./user.api";

import type {
  AssignStaffPayload,
  CreateManagerPayload,
  CreateStaffPayload,
  UpdateManagerPayload,
  UpdateStaffPayload,
  UserListParams,
} from "./user.types";

/* =========================================
   QUERY KEYS
========================================= */

export const userQueryKeys = {
  all: ["admin-users"] as const,

  managers: () => [...userQueryKeys.all, "managers"] as const,

  managerList: (params?: UserListParams) =>
    [...userQueryKeys.managers(), params] as const,

  staff: () => [...userQueryKeys.all, "staff"] as const,

  staffList: (params?: UserListParams) =>
    [...userQueryKeys.staff(), params] as const,
};

/* =========================================
   MANAGER QUERIES
========================================= */

/**
 * Fetch managers.
 */
export const useManagers = (params?: UserListParams) => {
  return useQuery({
    queryKey: userQueryKeys.managerList(params),
    queryFn: () => getManagers(params),
  });
};

/* =========================================
   STAFF QUERIES
========================================= */

/**
 * Fetch staff.
 */
export const useStaff = (params?: UserListParams) => {
  return useQuery({
    queryKey: userQueryKeys.staffList(params),
    queryFn: () => getStaff(params),
  });
};

/* =========================================
   MANAGER MUTATIONS
========================================= */

/**
 * Create manager.
 */
export const useCreateManager = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateManagerPayload) =>
      createManager(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userQueryKeys.managers(),
      });
    },
  });
};

/**
 * Update manager.
 */
export const useUpdateManager = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateManagerPayload;
    }) => updateManager({ id, payload }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userQueryKeys.managers(),
      });
    },
  });
};

/* =========================================
   STAFF MUTATIONS
========================================= */

/**
 * Create staff.
 */
export const useCreateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateStaffPayload) =>
      createStaff(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userQueryKeys.staff(),
      });

      queryClient.invalidateQueries({
        queryKey: userQueryKeys.managers(),
      });
    },
  });
};

/**
 * Update staff.
 */
export const useUpdateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateStaffPayload;
    }) => updateStaff({ id, payload }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userQueryKeys.staff(),
      });
    },
  });
};

/**
 * Deactivate staff.
 */
export const useDeactivateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deactivateStaff(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userQueryKeys.staff(),
      });
    },
  });
};

/**
 * Assign staff to manager.
 */
export const useAssignStaffToManager = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: AssignStaffPayload;
    }) => assignStaffToManager({ id, payload }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userQueryKeys.staff(),
      });

      queryClient.invalidateQueries({
        queryKey: userQueryKeys.managers(),
      });
    },
  });
};