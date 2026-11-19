// import {
//   useQuery,
//   useMutation,
//   useQueryClient,
// } from "@tanstack/react-query";

// export {
//   useCategories,
//   useCategory,
//   useCreateCategory,
//   useUpdateCategory,
//   useDeactivateCategory,
//   useActivateCategory,
//   categoryKeys,
// } from "@/features/categories/category.queries";

// import {
//   getCategories,
//   getCategoryById,
//   createCategory,
//   updateCategory,
//   deactivateCategory,
//   updateCategoryStatus,
// } from "../features/categories/category.api";

// import type {
//   GetCategoriesParams,
// } from "../features/categories/category.api";

// import type {
//   CategoryPayload,
//   CategoryUpdatePayload,
// } from "../types/category.types";

// export const categoryKeys = {
//   all: ["categories"] as const,

//   lists: () => [...categoryKeys.all, "list"] as const,

//   list: (params: GetCategoriesParams) =>
//     [...categoryKeys.lists(), params] as const,

//   details: () => [...categoryKeys.all, "detail"] as const,

//   detail: (id: number) =>
//     [...categoryKeys.details(), id] as const,
// };

// // Fetch categories
// export const useCategories = (
//   params: GetCategoriesParams = {}
// ) => {
//   return useQuery({
//     queryKey: categoryKeys.list(params),
//     queryFn: () => getCategories(params),
//   });
// };

// // Fetch one category
// export const useCategory = (id: number) => {
//   return useQuery({
//     queryKey: categoryKeys.detail(id),
//     queryFn: () => getCategoryById(id),
//     enabled: Number.isInteger(id) && id > 0,
//   });
// };

// // Create category
// export const useCreateCategory = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (payload: CategoryPayload) =>
//       createCategory(payload),

//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: categoryKeys.all,
//       });
//     },
//   });
// };

// // Update category
// export const useUpdateCategory = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({
//       id,
//       payload,
//     }: {
//       id: number;
//       payload: CategoryUpdatePayload;
//     }) => updateCategory(id, payload),

//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({
//         queryKey: categoryKeys.all,
//       });

//       queryClient.invalidateQueries({
//         queryKey: categoryKeys.detail(variables.id),
//       });
//     },
//   });
// };

// // Deactivate category
// export const useDeactivateCategory = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (id: number) => deactivateCategory(id),

//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: categoryKeys.all,
//       });
//     },
//   });
// };

// // Activate category
// export const useActivateCategory = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (id: number) => activateCategory(id),

//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: categoryKeys.all,
//       });
//     },
//   });
// };



export {
  useCategories,
  useCategory,
  useCreateCategory,
  useUpdateCategory,
  useDeactivateCategory,
  useActivateCategory,
  categoryKeys,
} from "@/features/categories/category.queries";
