import axiosInstance from "@/lib/axiosInstance";

import type {
  Category,
  CategoryListResponse,
  CategoryResponse,
  CategoryPayload,
  UpdateCategoryPayload,
} from "@/types/category.types";

export interface GetCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean | "all";
}

// Get all categories
export const getCategories = async (
  params: GetCategoriesParams = {}
): Promise<CategoryListResponse> => {
  const response = await axiosInstance.get<CategoryListResponse>(
    "/categories",
    { params }
  );

  return response.data;
};

// Get category by ID
export const getCategoryById = async (
  id: number
): Promise<Category> => {
  const response = await axiosInstance.get<CategoryResponse>(
    `/categories/${id}`
  );

  return response.data.data;
};

// Create category
export const createCategory = async (
  payload: CategoryPayload
): Promise<Category> => {
  const response = await axiosInstance.post<CategoryResponse>(
    "/categories",
    payload
  );

  return response.data.data;
};

// Update category
export const updateCategory = async (
  id: number,
  payload: UpdateCategoryPayload
): Promise<Category> => {
  const response = await axiosInstance.patch<CategoryResponse>(
    `/categories/${id}`,
    payload
  );

  return response.data.data;
};

// Deactivate category
export const deactivateCategory = async (
  id: number
): Promise<Category> => {
  const response = await axiosInstance.patch<CategoryResponse>(
    `/categories/${id}/deactivate`
  );

  return response.data.data;
};

// Activate or deactivate category
export const updateCategoryStatus = async (
  id: number,
  isActive: boolean
): Promise<Category> => {
  const response = await axiosInstance.patch<CategoryResponse>(
  `/categories/${id}/status`,
  {
    isActive,
  }
);

  return response.data.data;
};

// Delete category (only if your backend supports permanent deletion)
export const deleteCategory = async (
  id: number
): Promise<void> => {
  await axiosInstance.delete(`/categories/${id}`);
};