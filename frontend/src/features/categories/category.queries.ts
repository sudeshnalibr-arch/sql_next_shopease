
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  updateCategoryStatus,
} from "./category.api";

import type {
  GetCategoriesParams,
} from "./category.api";

import type {
  CategoryPayload,
  UpdateCategoryPayload,
} from "@/types/category.types";

// Query keys
export const categoryKeys = {
  all: ["categories"] as const,

  lists: () => [...categoryKeys.all, "list"] as const,

  list: (params: GetCategoriesParams) =>
    [...categoryKeys.lists(), params] as const,

  details: () => [...categoryKeys.all, "detail"] as const,

  detail: (id: number) =>
    [...categoryKeys.details(), id] as const,
};

// Fetch all categories
export const useCategories = (
  params: GetCategoriesParams = {}
) => {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => getCategories(params),
  });
};

// Fetch category by ID
export const useCategory = (id: number) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => getCategoryById(id),
    enabled: Number.isInteger(id) && id > 0,
  });
};

// Create category
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CategoryPayload) =>
      createCategory(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoryKeys.all,
      });
    },
  });
};

// Update category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateCategoryPayload;
    }) => updateCategory(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: categoryKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: categoryKeys.detail(variables.id),
      });
    },
  });
};

// Deactivate category
export const useDeactivateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      updateCategoryStatus(id, false),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: categoryKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: categoryKeys.detail(id),
      });
    },
  });
};

// Activate category
export const useActivateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      updateCategoryStatus(id, true),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: categoryKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: categoryKeys.detail(id),
      });
    },
  });
};
